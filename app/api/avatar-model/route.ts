import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

function findAvatarGlbPath(): string | null {
  const root = process.cwd();

  const candidatePaths = [
    path.join(root, 'src', 'three', '3d_avatar'),
    path.join(root, 'src', 'three', '3d_avatar.glb'),
    path.join(root, 'public', 'models', '3d_avatar.glb'),
    path.join(root, 'public', '3d_avatar'),
    path.join(root, 'public', 'models'),
  ];

  for (const candidate of candidatePaths) {
    if (!fs.existsSync(candidate)) continue;
    const stat = fs.statSync(candidate);

    if (stat.isFile()) {
      // Check if it's a .glb file or starts with glTF magic bytes (0x46546C67)
      if (candidate.toLowerCase().endsWith('.glb')) {
        return candidate;
      }
      if (stat.size >= 12) {
        const fd = fs.openSync(candidate, 'r');
        const header = Buffer.alloc(4);
        fs.readSync(fd, header, 0, 4, 0);
        fs.closeSync(fd);
        if (header.toString('ascii') === 'glTF') {
          return candidate;
        }
      }
    } else if (stat.isDirectory()) {
      const entries = fs.readdirSync(candidate);
      // Prefer .glb files first
      for (const entry of entries) {
        if (entry.toLowerCase().endsWith('.glb')) {
          const fullPath = path.join(candidate, entry);
          if (fs.statSync(fullPath).isFile()) {
            return fullPath;
          }
        }
      }
      // Also check any binary file in src/three/3d_avatar that has the glTF magic header
      for (const entry of entries) {
        const fullPath = path.join(candidate, entry);
        const entryStat = fs.statSync(fullPath);
        if (entryStat.isFile() && entryStat.size >= 12) {
          const fd = fs.openSync(fullPath, 'r');
          const header = Buffer.alloc(4);
          fs.readSync(fd, header, 0, 4, 0);
          fs.closeSync(fd);
          if (header.toString('ascii') === 'glTF') {
            return fullPath;
          }
        }
      }
    }
  }

  return null;
}

export async function GET() {
  try {
    const glbPath = findAvatarGlbPath();
    if (!glbPath) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }

    const fileBuffer = fs.readFileSync(glbPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Content-Length': String(fileBuffer.byteLength),
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }
}
