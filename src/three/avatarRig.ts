import * as THREE from 'three';

// Procedural animation rig for a Mixamo / Ready Player Me style skeleton
// (Hips, Spine, Spine1, Spine2, Neck, Head, LeftArm, LeftForeArm, ...).
// The source model ships in T-pose with no animation clips, so every motion
// here is computed in code: a relaxed standing pose, a set of gesture poses
// (one per story chapter), a walk cycle, breathing, gaze and blinks.
//
// All rotations are expressed in the "character frame" (the model root's
// space: +Y up, +Z facing the camera, character's left on +X) and converted
// into each bone's local space, so the rig does not depend on per-bone axis
// conventions.

const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);

const FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'] as const;
const FINGER_CURL = [0.18, 0.3, 0.22];
const THUMB_TUCK = [0.45, 0.22, 0.12];

export type AvatarPose =
  | 'idle'
  | 'wave'
  | 'think'
  | 'proud'
  | 'point'
  | 'present'
  | 'explain'
  | 'type';

const GESTURES: Exclude<AvatarPose, 'idle'>[] = [
  'wave',
  'think',
  'proud',
  'point',
  'present',
  'explain',
  'type',
];

interface HeadOffset {
  yaw: number;
  pitch: number;
  roll: number;
  smile: number;
}

const HEAD: Record<AvatarPose, HeadOffset> = {
  idle: { yaw: 0, pitch: 0, roll: 0, smile: 0.22 },
  wave: { yaw: 0, pitch: -0.02, roll: 0.07, smile: 0.62 },
  think: { yaw: -0.28, pitch: -0.16, roll: 0.07, smile: 0.08 },
  proud: { yaw: 0.05, pitch: -0.05, roll: 0, smile: 0.4 },
  point: { yaw: 0.5, pitch: -0.02, roll: 0, smile: 0.3 },
  present: { yaw: 0.32, pitch: 0.04, roll: -0.04, smile: 0.32 },
  explain: { yaw: 0.08, pitch: 0, roll: 0.03, smile: 0.35 },
  type: { yaw: 0.06, pitch: 0.32, roll: 0, smile: 0.18 },
};

export interface RigInput {
  time: number;
  delta: number;
  pointer: { x: number; y: number };
  pose: AvatarPose;
  /** Signed travel speed; non-zero while the character is walking. */
  speed: number;
}

const _qRoot = new THREE.Quaternion();
const _qParent = new THREE.Quaternion();
const _qDelta = new THREE.Quaternion();
const _qInv = new THREE.Quaternion();
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _vC = new THREE.Vector3();

type Side = 'Left' | 'Right';
type BonePose = Map<THREE.Bone, THREE.Quaternion>;

interface MorphTarget {
  influences: number[];
  index: number;
}

interface FingerCurl {
  fingers: [number, number, number, number];
  thumb: number;
}

export class AvatarRig {
  private root: THREE.Object3D;
  private bones = new Map<string, THREE.Bone>();
  private tPose: BonePose = new Map();
  private relaxed: BonePose = new Map();
  private poses = new Map<AvatarPose, BonePose>();
  private weights = new Map<AvatarPose, number>();
  private morphs = new Map<string, MorphTarget[]>();
  private armChain: THREE.Bone[] = [];
  private leftSign = 1;

  private walkWeight = 0;
  private walkPhase = 0;
  private nextBlink = 1.2;
  private blinkStart = -Infinity;
  private gazeX = 0;
  private gazeY = 0;
  private head: HeadOffset = { ...HEAD.idle };

  constructor(root: THREE.Object3D) {
    this.root = root;

    root.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        // Strip exporter prefixes such as "mixamorig:" so lookups use plain names
        const name = child.name.replace(/^.*[:|]/, '');
        if (!this.bones.has(name)) this.bones.set(name, child as THREE.Bone);
      }
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
        for (const [name, index] of Object.entries(mesh.morphTargetDictionary)) {
          const list = this.morphs.get(name) ?? [];
          list.push({ influences: mesh.morphTargetInfluences, index });
          this.morphs.set(name, list);
        }
      }
    });

    root.updateMatrixWorld(true);

    const leftArm = this.bone('LeftArm');
    const spine = this.bone('Spine2') ?? this.bone('Spine');
    if (leftArm && spine) {
      this.leftSign =
        Math.sign(this.framePosition(leftArm, _vA).x - this.framePosition(spine, _vB).x) || 1;
    }

    for (const [name, bone] of this.bones) {
      this.tPose.set(bone, bone.quaternion.clone());
      if (/(Arm|Hand)/.test(name) && !/Shoulder/.test(name)) this.armChain.push(bone);
    }

    this.buildRelaxedPose();
    this.buildGestures();
    this.restore(this.relaxed);
  }

  /** True when the model has the bones this rig drives. */
  get isSupported() {
    return Boolean(this.bone('LeftArm') && this.bone('RightArm') && this.bone('Head'));
  }

  update({ time, delta, pointer, pose, speed }: RigInput) {
    this.restore(this.relaxed);

    // Walking takes over the whole body; gestures resume when the character stops
    const walking = Math.abs(speed) > 0.03;
    this.walkWeight = THREE.MathUtils.damp(this.walkWeight, walking ? 1 : 0, walking ? 6 : 4, delta);
    this.walkPhase += delta * (6 + Math.min(Math.abs(speed), 2.5) * 2.4) * this.walkWeight;
    const still = 1 - this.walkWeight;

    for (const name of GESTURES) {
      const target = name === pose && !walking ? 1 : 0;
      const w = THREE.MathUtils.damp(this.weights.get(name) ?? 0, target, 5, delta);
      this.weights.set(name, w);
      if (w > 0.001) this.blendTo(this.poses.get(name)!, w);
    }

    this.applyGestureMotion(time);
    this.applyIdle(time, still);
    this.applyWalk(this.walkWeight);

    // Head offsets blend with the active gesture
    const offset = HEAD[walking ? 'idle' : pose];
    const k = 1 - Math.exp(-4 * delta);
    this.head.yaw += (offset.yaw - this.head.yaw) * k;
    this.head.pitch += (offset.pitch - this.head.pitch) * k;
    this.head.roll += (offset.roll - this.head.roll) * k;
    this.head.smile += (offset.smile - this.head.smile) * k;

    // Gaze: a little pointer tracking and an idle look-around on top of the pose
    const idleYaw = Math.sin(time * 0.37) * 0.08 + Math.sin(time * 0.83) * 0.03;
    const idlePitch = Math.sin(time * 0.52) * 0.03;
    const targetX = THREE.MathUtils.clamp(pointer.x * 0.25 + idleYaw * still + this.head.yaw, -0.8, 0.8);
    const targetY = THREE.MathUtils.clamp(pointer.y * 0.15 + idlePitch * still + this.head.pitch, -0.4, 0.45);
    this.gazeX = THREE.MathUtils.damp(this.gazeX, targetX, 4, delta);
    this.gazeY = THREE.MathUtils.damp(this.gazeY, targetY, 4, delta);

    this.rotate('Neck', AXIS_Y, this.gazeX * 0.4);
    this.rotate('Neck', AXIS_X, this.gazeY * 0.4);
    this.rotate('Head', AXIS_Y, this.gazeX * 0.6);
    this.rotate('Head', AXIS_X, this.gazeY * 0.6);
    this.rotate('Head', AXIS_Z, this.head.roll * -this.leftSign);
    for (const eye of ['LeftEye', 'RightEye']) {
      this.rotate(eye, AXIS_Y, this.gazeX * 0.3);
      this.rotate(eye, AXIS_X, this.gazeY * 0.25);
    }

    // Face: periodic blinks (occasionally doubled) and a pose-dependent smile
    if (time >= this.nextBlink) {
      this.blinkStart = time;
      this.nextBlink = time + (Math.random() < 0.2 ? 0.28 : 2.2 + Math.random() * 3.2);
    }
    const blinkT = (time - this.blinkStart) / 0.16;
    const blink = blinkT >= 0 && blinkT <= 1 ? Math.sin(blinkT * Math.PI) : 0;
    this.setMorph('eyeBlinkLeft', blink);
    this.setMorph('eyeBlinkRight', blink);
    this.setMorph('mouthSmileLeft', this.head.smile);
    this.setMorph('mouthSmileRight', this.head.smile);
    this.setMorph('cheekSquintLeft', this.head.smile * 0.35);
    this.setMorph('cheekSquintRight', this.head.smile * 0.35);
  }

  /** Current walk-cycle phase, for the scene's vertical bob. */
  get stride() {
    return { phase: this.walkPhase, weight: this.walkWeight };
  }

  // ---------------------------------------------------------------- layers

  private applyIdle(time: number, amount: number) {
    // Slow weight shift with the legs counter-rotated to keep the feet planted
    const shift = Math.sin(time * 0.45) * 0.022 * amount;
    this.rotate('Hips', AXIS_Z, shift);
    this.rotate('Hips', AXIS_Y, Math.sin(time * 0.3) * 0.03 * amount);
    this.rotate('LeftUpLeg', AXIS_Z, -shift);
    this.rotate('RightUpLeg', AXIS_Z, -shift);
    this.rotate('Spine', AXIS_Z, -shift * 0.6);

    // Breathing never stops
    const breath = Math.sin(time * 1.7);
    this.rotate('Spine1', AXIS_X, breath * -0.012);
    this.rotate('Spine2', AXIS_X, breath * -0.014);
    this.rotate('LeftShoulder', AXIS_Z, breath * 0.012 * this.leftSign);
    this.rotate('RightShoulder', AXIS_Z, breath * -0.012 * this.leftSign);
  }

  private applyWalk(w: number) {
    if (w < 0.001) return;
    const p = this.walkPhase;
    const swing = Math.sin(p);
    const lift = Math.cos(p);

    // Legs: thighs swing (negative X rotation = forward), knees bend on the forward swing
    this.rotate('LeftUpLeg', AXIS_X, -swing * 0.42 * w);
    this.rotate('RightUpLeg', AXIS_X, swing * 0.42 * w);
    this.rotate('LeftLeg', AXIS_X, (0.08 + Math.max(0, lift) * 0.65) * w);
    this.rotate('RightLeg', AXIS_X, (0.08 + Math.max(0, -lift) * 0.65) * w);
    this.rotate('LeftFoot', AXIS_X, (swing * 0.18 - Math.max(0, lift) * 0.25) * w);
    this.rotate('RightFoot', AXIS_X, (-swing * 0.18 - Math.max(0, -lift) * 0.25) * w);

    // Torso counter-twists the hips; arms swing opposite to the legs
    this.rotate('Hips', AXIS_Y, swing * 0.09 * w);
    this.rotate('Spine1', AXIS_Y, -swing * 0.12 * w);
    this.rotate('Spine', AXIS_X, 0.05 * w);
    this.rotate('LeftArm', AXIS_X, swing * 0.34 * w);
    this.rotate('RightArm', AXIS_X, -swing * 0.34 * w);
    this.rotate('LeftForeArm', AXIS_X, (-0.25 + swing * 0.12) * w);
    this.rotate('RightForeArm', AXIS_X, (-0.25 - swing * 0.12) * w);
  }

  /** Small motions layered on top of the held gesture poses. */
  private applyGestureMotion(time: number) {
    const wave = this.weights.get('wave') ?? 0;
    if (wave > 0.001) {
      // Wave in bursts: 2.4 s of waving, then a short pause with the hand up
      const cycle = time % 4;
      const burst = Math.min(1, Math.min(cycle, 2.4 - cycle) * 4);
      const swing = Math.sin(time * 9) * 0.32 * wave * Math.max(0, burst);
      this.rotate('RightForeArm', AXIS_Z, swing);
      this.rotate('RightHand', AXIS_Z, swing * 0.4);
    }

    const explain = this.weights.get('explain') ?? 0;
    if (explain > 0.001) {
      this.rotate('LeftForeArm', AXIS_X, Math.sin(time * 2.6) * 0.12 * explain);
      this.rotate('RightForeArm', AXIS_X, Math.sin(time * 2.6 + 1.9) * 0.12 * explain);
      this.rotate('LeftHand', AXIS_Z, Math.sin(time * 1.3) * 0.1 * explain);
      this.rotate('RightHand', AXIS_Z, Math.sin(time * 1.3 + 1) * -0.1 * explain);
    }

    const type = this.weights.get('type') ?? 0;
    if (type > 0.001) {
      this.rotate('LeftHand', AXIS_X, Math.sin(time * 11) * 0.07 * type);
      this.rotate('RightHand', AXIS_X, Math.sin(time * 11 + 2.2) * 0.07 * type);
      for (const finger of FINGERS) {
        const phase = FINGERS.indexOf(finger) * 1.4;
        this.rotate(`LeftHand${finger}1`, AXIS_X, Math.max(0, Math.sin(time * 13 + phase)) * 0.18 * type);
        this.rotate(`RightHand${finger}1`, AXIS_X, Math.max(0, Math.sin(time * 12 + phase + 2)) * 0.18 * type);
      }
    }

    const think = this.weights.get('think') ?? 0;
    if (think > 0.001) {
      // Tap the chin now and then
      this.rotate('RightHandIndex1', AXIS_X, Math.max(0, Math.sin(time * 5)) * 0.25 * think * (Math.sin(time * 0.6) > 0.4 ? 1 : 0));
    }
  }

  // ----------------------------------------------------------------- poses

  private buildRelaxedPose() {
    for (const side of ['Left', 'Right'] as Side[]) {
      const s = this.sign(side);
      this.aim(`${side}Arm`, `${side}ForeArm`, _vC.set(s * 0.2, -1, 0.05));
      this.aim(`${side}ForeArm`, `${side}Hand`, _vC.set(s * 0.1, -1, 0.38));
      this.curlFingers(side, { fingers: [1, 1, 1, 1], thumb: 1 });
    }
    for (const bone of this.bones.values()) this.relaxed.set(bone, bone.quaternion.clone());
  }

  private buildGestures() {
    const L: Side = 'Left';
    const R: Side = 'Right';
    const sL = this.sign(L);
    const sR = this.sign(R);
    const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

    this.capture('wave', () => {
      this.aim(`${R}Arm`, `${R}ForeArm`, v(sR * 0.85, -0.42, 0.25));
      this.aim(`${R}ForeArm`, `${R}Hand`, v(sR * 0.12, 1, 0.18));
      this.turnPalm(R, AXIS_Z);
      this.setFingers(R, { fingers: [0.2, 0.2, 0.25, 0.3], thumb: 0.3 });
    });

    this.capture('think', () => {
      // Right hand under the chin, left forearm across the body supporting the elbow
      this.aim(`${R}Arm`, `${R}ForeArm`, v(sR * 0.12, -0.8, 0.6));
      const chin = this.framePosition(this.bone('Head')!, new THREE.Vector3()).add(v(sR * 0.01, -0.07, 0.1));
      this.aimAt(`${R}ForeArm`, `${R}Hand`, chin);
      this.turnPalm(R, v(0, 0.2, -1));
      this.setFingers(R, { fingers: [1.3, 1.5, 1.6, 1.6], thumb: 0.9 });

      this.aim(`${L}Arm`, `${L}ForeArm`, v(sL * 0.14, -1, 0.3));
      const elbow = this.framePosition(this.bone(`${R}ForeArm`)!, new THREE.Vector3()).add(v(0, -0.03, 0.06));
      this.aimAt(`${L}ForeArm`, `${L}Hand`, elbow);
      this.turnPalm(L, AXIS_Y);
      this.setFingers(L, { fingers: [0.6, 0.7, 0.8, 0.8], thumb: 0.6 });
    });

    this.capture('proud', () => {
      // Hands on hips
      const hips = this.framePosition(this.bone('Hips')!, new THREE.Vector3());
      for (const side of [L, R]) {
        const s = this.sign(side);
        this.aim(`${side}Arm`, `${side}ForeArm`, v(s * 0.62, -0.75, -0.2));
        this.aimAt(`${side}ForeArm`, `${side}Hand`, hips.clone().add(v(s * 0.2, 0.1, 0.02)));
        this.turnPalm(side, v(-s, 0, 0));
        this.setFingers(side, { fingers: [0.5, 0.55, 0.6, 0.6], thumb: 0.2 });
      }
    });

    this.capture('point', () => {
      // Left arm points toward the text on the viewer's right
      this.aim(`${L}Arm`, `${L}ForeArm`, v(sL * 0.95, 0.1, 0.32));
      this.aim(`${L}ForeArm`, `${L}Hand`, v(sL * 0.95, 0.16, 0.36));
      this.turnPalm(L, v(0, -1, 0.2));
      this.setFingers(L, { fingers: [0, 1.4, 1.5, 1.5], thumb: 1.1 });
    });

    this.capture('present', () => {
      // Open palm, offering the chapter text
      this.aim(`${L}Arm`, `${L}ForeArm`, v(sL * 0.5, -0.72, 0.5));
      this.aim(`${L}ForeArm`, `${L}Hand`, v(sL * 0.6, 0.02, 0.85));
      this.turnPalm(L, v(0.1 * sL, 1, 0.25));
      this.setFingers(L, { fingers: [0.15, 0.2, 0.25, 0.3], thumb: 0.2 });
    });

    this.capture('explain', () => {
      for (const side of [L, R]) {
        const s = this.sign(side);
        this.aim(`${side}Arm`, `${side}ForeArm`, v(s * 0.28, -0.86, 0.42));
        this.aim(`${side}ForeArm`, `${side}Hand`, v(s * 0.22, 0.12, 1));
        this.turnPalm(side, v(-s * 0.6, 0.8, 0));
        this.setFingers(side, { fingers: [0.3, 0.35, 0.4, 0.45], thumb: 0.3 });
      }
    });

    this.capture('type', () => {
      // Forearms level, hands over an invisible keyboard
      for (const side of [L, R]) {
        const s = this.sign(side);
        this.aim(`${side}Arm`, `${side}ForeArm`, v(s * 0.2, -0.95, 0.28));
        this.aim(`${side}ForeArm`, `${side}Hand`, v(-s * 0.22, -0.08, 1));
        this.turnPalm(side, v(0, -1, 0));
        this.setFingers(side, { fingers: [0.45, 0.45, 0.5, 0.5], thumb: 0.3 });
      }
    });
  }

  /** Run a pose builder from the relaxed pose and record the arm chains. */
  private capture(name: AvatarPose, build: () => void) {
    this.restore(this.relaxed);
    build();
    const pose: BonePose = new Map();
    for (const bone of this.armChain) pose.set(bone, bone.quaternion.clone());
    this.poses.set(name, pose);
  }

  private blendTo(pose: BonePose, weight: number) {
    for (const [bone, q] of pose) bone.quaternion.slerp(q, weight);
  }

  private restore(pose: BonePose) {
    for (const [bone, q] of pose) bone.quaternion.copy(q);
  }

  // --------------------------------------------------------------- helpers

  private sign(side: Side) {
    return side === 'Left' ? this.leftSign : -this.leftSign;
  }

  /** Straighten the fingers back to the bind pose, then curl them by `curl`. */
  private setFingers(side: Side, curl: FingerCurl) {
    for (const [name, bone] of this.bones) {
      if (name.startsWith(`${side}Hand`) && name !== `${side}Hand`) {
        bone.quaternion.copy(this.tPose.get(bone)!);
      }
    }
    this.curlFingers(side, curl);
  }

  private curlFingers(side: Side, { fingers, thumb }: FingerCurl) {
    if (!this.hasPalm(side)) return;
    // Fingers curl toward the palm; the thumb folds in alongside them
    const palm = this.palmNormal(side, new THREE.Vector3());
    FINGERS.forEach((finger, f) => {
      FINGER_CURL.forEach((angle, i) => this.bend(`${side}Hand${finger}${i + 1}`, palm, angle * fingers[f]));
    });
    const along = this.handDirection(side);
    THUMB_TUCK.forEach((angle, i) => this.bend(`${side}HandThumb${i + 1}`, along, angle * thumb));
  }

  /** Twist the forearm about its own axis so the palm faces `target`. */
  private turnPalm(side: Side, target: THREE.Vector3) {
    const forearm = this.bone(`${side}ForeArm`);
    const hand = this.bone(`${side}Hand`);
    if (!forearm || !hand || !this.hasPalm(side)) return;

    const palm = this.palmNormal(side, new THREE.Vector3());
    const axis = this.framePosition(hand, new THREE.Vector3())
      .sub(this.framePosition(forearm, new THREE.Vector3()))
      .normalize();
    const goal = target.clone().normalize();
    goal.addScaledVector(axis, -goal.dot(axis));
    palm.addScaledVector(axis, -palm.dot(axis));
    if (goal.lengthSq() < 1e-6 || palm.lengthSq() < 1e-6) return;
    goal.normalize();
    palm.normalize();
    const angle = Math.atan2(new THREE.Vector3().crossVectors(palm, goal).dot(axis), palm.dot(goal));
    this.rotate(`${side}ForeArm`, axis, angle);
  }

  /** Palm normal in the character frame (points out of the palm). */
  private palmNormal(side: Side, out: THREE.Vector3) {
    const handPos = this.framePosition(this.bone(`${side}Hand`)!, new THREE.Vector3());
    const along = this.framePosition(this.bone(`${side}HandMiddle1`)!, new THREE.Vector3()).sub(handPos);
    const across = this.framePosition(this.bone(`${side}HandPinky1`)!, new THREE.Vector3()).sub(
      this.framePosition(this.bone(`${side}HandIndex1`)!, new THREE.Vector3())
    );
    out.crossVectors(along, across).normalize();
    // along × across points out of the back of the left hand; mirror per side
    return side === 'Left' ? out.negate() : out;
  }

  private handDirection(side: Side) {
    return this.framePosition(this.bone(`${side}HandMiddle1`)!, new THREE.Vector3())
      .sub(this.framePosition(this.bone(`${side}Hand`)!, new THREE.Vector3()))
      .normalize();
  }

  private hasPalm(side: Side) {
    return ['Hand', 'HandIndex1', 'HandMiddle1', 'HandPinky1'].every((b) => this.bone(`${side}${b}`));
  }

  /** Rotate a bone so the direction to its child moves toward `toward`. */
  private bend(name: string, toward: THREE.Vector3, angle: number) {
    const bone = this.bone(name);
    const child = bone?.children.find((c) => (c as THREE.Bone).isBone);
    if (!bone || !child || angle === 0) return;
    const dir = this.framePosition(child, _vA).sub(this.framePosition(bone, _vB)).normalize();
    const axis = _vC.crossVectors(dir, toward);
    if (axis.lengthSq() < 1e-6) return;
    this.rotate(name, axis.normalize(), angle);
  }

  /** Rotate a bone so the direction to `childName` points along `target`. */
  private aim(name: string, childName: string, target: THREE.Vector3) {
    const bone = this.bone(name);
    const child = this.bone(childName);
    if (!bone || !child) return;
    const current = this.framePosition(child, _vA).sub(this.framePosition(bone, _vB)).normalize();
    _qDelta.setFromUnitVectors(current, target.clone().normalize());
    this.applyFrameRotation(bone, _qDelta);
  }

  /** Rotate a bone so its child points at a character-frame position. */
  private aimAt(name: string, childName: string, point: THREE.Vector3) {
    const bone = this.bone(name);
    if (!bone) return;
    this.aim(name, childName, point.clone().sub(this.framePosition(bone, new THREE.Vector3())));
  }

  private rotate(name: string, axis: THREE.Vector3, angle: number) {
    const bone = this.bone(name);
    if (!bone || angle === 0) return;
    this.applyFrameRotation(bone, _qDelta.setFromAxisAngle(axis, angle));
  }

  /** Apply a character-frame rotation to a bone: local' = P⁻¹ · delta · P · local */
  private applyFrameRotation(bone: THREE.Bone, delta: THREE.Quaternion) {
    this.root.getWorldQuaternion(_qRoot).invert();
    if (bone.parent) {
      bone.parent.getWorldQuaternion(_qParent).premultiply(_qRoot);
    } else {
      _qParent.identity();
    }
    _qInv.copy(_qParent).invert();
    bone.quaternion.premultiply(_qParent).premultiply(delta).premultiply(_qInv);
  }

  private framePosition(obj: THREE.Object3D, out: THREE.Vector3) {
    obj.getWorldPosition(out);
    return this.root.worldToLocal(out);
  }

  private setMorph(name: string, value: number) {
    const targets = this.morphs.get(name);
    if (!targets) return;
    for (const { influences, index } of targets) influences[index] = value;
  }

  private bone(name: string) {
    return this.bones.get(name);
  }
}
