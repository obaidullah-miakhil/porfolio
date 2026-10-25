import * as THREE from 'three';

// Procedural animation rig for a Mixamo / Ready Player Me style skeleton
// (Hips, Spine, Spine1, Spine2, Neck, Head, LeftArm, LeftForeArm, ...).
// The source model ships in T-pose with no animation clips, so every motion
// here is computed in code: relaxed standing pose, breathing, weight shift,
// pointer gaze, eye blinks and a wave gesture.
//
// All rotations are expressed in the "character frame" (the model root's
// space: +Y up, +Z facing the camera) and converted into each bone's local
// space, so the rig does not depend on per-bone axis conventions.

const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);

const FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'] as const;
const FINGER_CURL = [0.18, 0.3, 0.22];
const THUMB_TUCK = [0.45, 0.22, 0.12];

const WAVE_DURATION = 2.9;
const WAVE_RAISE = 0.55;
const WAVE_LOWER = 0.7;

const _qRoot = new THREE.Quaternion();
const _qParent = new THREE.Quaternion();
const _qDelta = new THREE.Quaternion();
const _qInv = new THREE.Quaternion();
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _vC = new THREE.Vector3();

type Side = 'Left' | 'Right';

interface MorphTarget {
  influences: number[];
  index: number;
}

function smoothstep(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

export class AvatarRig {
  private root: THREE.Object3D;
  private bones = new Map<string, THREE.Bone>();
  private relaxed = new Map<THREE.Bone, THREE.Quaternion>();
  private wavePose = new Map<THREE.Bone, THREE.Quaternion>();
  private morphs = new Map<string, MorphTarget[]>();
  private leftSign = 1;

  private waveStart = -Infinity;
  private nextBlink = 1.2;
  private blinkStart = -Infinity;
  private gazeX = 0;
  private gazeY = 0;
  private smile = 0;

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

    this.buildRelaxedPose();
    this.buildWavePose();
    this.resetToRelaxed();
  }

  /** True when the model has the bones this rig drives. */
  get isSupported() {
    return Boolean(this.bone('LeftArm') && this.bone('RightArm') && this.bone('Head'));
  }

  wave(time: number) {
    if (time - this.waveStart > WAVE_DURATION) this.waveStart = time;
  }

  update(time: number, delta: number, pointer: { x: number; y: number }) {
    this.resetToRelaxed();

    // Wave envelope: raise, wave, lower
    const waveT = time - this.waveStart;
    let waveWeight = 0;
    if (waveT >= 0 && waveT <= WAVE_DURATION) {
      waveWeight =
        smoothstep(waveT / WAVE_RAISE) *
        (1 - smoothstep((waveT - (WAVE_DURATION - WAVE_LOWER)) / WAVE_LOWER));
    }

    // Lower body: slow weight shift, legs counter-rotated to keep feet planted
    const shift = Math.sin(time * 0.45) * 0.022;
    this.rotate('Hips', AXIS_Z, shift);
    this.rotate('Hips', AXIS_Y, Math.sin(time * 0.3) * 0.03);
    this.rotate('LeftUpLeg', AXIS_Z, -shift);
    this.rotate('RightUpLeg', AXIS_Z, -shift);

    // Upper body: counter the hip tilt and breathe
    const breath = Math.sin(time * 1.7);
    this.rotate('Spine', AXIS_Z, -shift * 0.6);
    this.rotate('Spine1', AXIS_X, breath * -0.012);
    this.rotate('Spine2', AXIS_X, breath * -0.014);
    this.rotate('LeftShoulder', AXIS_Z, breath * 0.012 * this.leftSign);
    this.rotate('RightShoulder', AXIS_Z, breath * -0.012 * this.leftSign);

    // Arms hang with a slight pendulum drift
    this.rotate('LeftArm', AXIS_X, Math.sin(time * 0.9) * 0.025);
    this.applyWave('Right', waveWeight, waveT);
    if (waveWeight < 1) {
      this.rotate('RightArm', AXIS_X, Math.sin(time * 0.9 + 1.3) * 0.025 * (1 - waveWeight));
    }

    // Gaze: follow the pointer, with a slow idle look-around layered on top
    const idleYaw = Math.sin(time * 0.37) * 0.1 + Math.sin(time * 0.83) * 0.04;
    const idlePitch = Math.sin(time * 0.52) * 0.035;
    const targetX = THREE.MathUtils.clamp(pointer.x * 0.55 + idleYaw, -0.7, 0.7);
    const targetY = THREE.MathUtils.clamp(pointer.y * 0.3 + idlePitch, -0.35, 0.35);
    this.gazeX = THREE.MathUtils.damp(this.gazeX, targetX, 4, delta);
    this.gazeY = THREE.MathUtils.damp(this.gazeY, targetY, 4, delta);

    const headTilt = waveWeight * 0.08 * -this.leftSign;
    this.rotate('Neck', AXIS_Y, this.gazeX * 0.4);
    this.rotate('Neck', AXIS_X, this.gazeY * 0.4);
    this.rotate('Head', AXIS_Y, this.gazeX * 0.6);
    this.rotate('Head', AXIS_X, this.gazeY * 0.6);
    this.rotate('Head', AXIS_Z, headTilt);
    this.rotate('LeftEye', AXIS_Y, this.gazeX * 0.35);
    this.rotate('LeftEye', AXIS_X, this.gazeY * 0.3);
    this.rotate('RightEye', AXIS_Y, this.gazeX * 0.35);
    this.rotate('RightEye', AXIS_X, this.gazeY * 0.3);

    // Face: periodic blinks and a smile that widens while waving
    if (time >= this.nextBlink) {
      this.blinkStart = time;
      // Occasional double blink
      this.nextBlink = time + (Math.random() < 0.2 ? 0.28 : 2.2 + Math.random() * 3.2);
    }
    const blinkT = (time - this.blinkStart) / 0.16;
    const blink = blinkT >= 0 && blinkT <= 1 ? Math.sin(blinkT * Math.PI) : 0;
    this.setMorph('eyeBlinkLeft', blink);
    this.setMorph('eyeBlinkRight', blink);

    this.smile = THREE.MathUtils.damp(this.smile, 0.22 + waveWeight * 0.4, 3, delta);
    this.setMorph('mouthSmileLeft', this.smile);
    this.setMorph('mouthSmileRight', this.smile);
    this.setMorph('cheekSquintLeft', this.smile * 0.35);
    this.setMorph('cheekSquintRight', this.smile * 0.35);
  }

  private applyWave(side: Side, weight: number, waveT: number) {
    if (weight <= 0) return;
    for (const [bone, target] of this.wavePose) {
      if (!bone.name.includes(side)) continue;
      bone.quaternion.slerp(target, weight);
    }
    const swing = Math.sin(waveT * 9) * 0.32 * weight;
    this.rotate(`${side}ForeArm`, AXIS_Z, swing);
    this.rotate(`${side}Hand`, AXIS_Z, swing * 0.4);
  }

  private buildRelaxedPose() {
    for (const side of ['Left', 'Right'] as Side[]) {
      const s = side === 'Left' ? this.leftSign : -this.leftSign;
      this.aim(`${side}Arm`, `${side}ForeArm`, _vC.set(s * 0.2, -1, 0.05));
      this.aim(`${side}ForeArm`, `${side}Hand`, _vC.set(s * 0.1, -1, 0.38));
      this.curlFingers(side, s, 1);
    }
    for (const bone of this.bones.values()) {
      this.relaxed.set(bone, bone.quaternion.clone());
    }
  }

  private buildWavePose() {
    const side: Side = 'Right';
    const s = -this.leftSign;
    const chain = this.chainBones(side);
    const saved = chain.map((bone) => bone.quaternion.clone());

    this.aim(`${side}Arm`, `${side}ForeArm`, _vC.set(s * 0.85, -0.42, 0.25));
    this.aim(`${side}ForeArm`, `${side}Hand`, _vC.set(s * 0.12, 1, 0.18));
    this.turnPalmForward(side);
    this.curlFingers(side, s, 0.25);

    for (const bone of chain) this.wavePose.set(bone, bone.quaternion.clone());
    chain.forEach((bone, i) => bone.quaternion.copy(saved[i]));
  }

  /** Twist the forearm about its own axis so the palm faces the camera. */
  private turnPalmForward(side: Side) {
    const forearm = this.bone(`${side}ForeArm`);
    const hand = this.bone(`${side}Hand`);
    if (!forearm || !hand || !this.hasPalm(side)) return;

    const palm = this.palmNormal(side, _vA);
    const axis = this.framePosition(hand, _vB).sub(this.framePosition(forearm, _vC)).normalize();
    const forward = AXIS_Z.clone().addScaledVector(axis, -axis.dot(AXIS_Z)).normalize();
    palm.addScaledVector(axis, -palm.dot(axis)).normalize();
    const angle = Math.atan2(_vC.crossVectors(palm, forward).dot(axis), palm.dot(forward));
    this.rotate(`${side}ForeArm`, axis, angle);
  }

  /** Palm normal in the character frame (points out of the palm). */
  private palmNormal(side: Side, out: THREE.Vector3) {
    const hand = this.bone(`${side}Hand`)!;
    const index = this.bone(`${side}HandIndex1`)!;
    const pinky = this.bone(`${side}HandPinky1`)!;
    const middle = this.bone(`${side}HandMiddle1`)!;
    const handPos = this.framePosition(hand, new THREE.Vector3());
    const along = this.framePosition(middle, new THREE.Vector3()).sub(handPos);
    const across = this.framePosition(pinky, new THREE.Vector3()).sub(
      this.framePosition(index, new THREE.Vector3())
    );
    out.crossVectors(along, across).normalize();
    // along × across points out of the back of the left hand; mirror per side
    return side === 'Left' ? out.negate() : out;
  }

  private handDirection(side: Side) {
    const hand = this.bone(`${side}Hand`);
    const middle = this.bone(`${side}HandMiddle1`);
    if (!hand || !middle) return null;
    return this.framePosition(middle, new THREE.Vector3())
      .sub(this.framePosition(hand, new THREE.Vector3()))
      .normalize();
  }

  private hasPalm(side: Side) {
    return ['Hand', 'HandIndex1', 'HandMiddle1', 'HandPinky1'].every((b) => this.bone(`${side}${b}`));
  }

  private curlFingers(side: Side, sideSign: number, amount: number) {
    // Fingers curl toward the palm; the palm faces the body when the arm hangs
    const palm = this.hasPalm(side) ? this.palmNormal(side, new THREE.Vector3()) : null;
    const toward = palm ?? new THREE.Vector3(-sideSign, 0, 0);
    for (const finger of FINGERS) {
      FINGER_CURL.forEach((angle, i) => this.bend(`${side}Hand${finger}${i + 1}`, toward, angle * amount));
    }
    // The thumb folds in alongside the fingers rather than toward the palm
    const along = this.handDirection(side);
    if (along) {
      THUMB_TUCK.forEach((angle, i) => this.bend(`${side}HandThumb${i + 1}`, along, angle * amount));
    }
  }

  /** Rotate a bone so the direction to its child moves toward `toward`. */
  private bend(name: string, toward: THREE.Vector3, angle: number) {
    const bone = this.bone(name);
    const child = bone?.children.find((c) => (c as THREE.Bone).isBone);
    if (!bone || !child) return;
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

  private chainBones(side: Side) {
    return [...this.bones.values()].filter(
      (bone) => bone.name.includes(`${side}Arm`) || bone.name.includes(`${side}ForeArm`) || bone.name.includes(`${side}Hand`)
    );
  }

  private resetToRelaxed() {
    for (const [bone, q] of this.relaxed) bone.quaternion.copy(q);
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
