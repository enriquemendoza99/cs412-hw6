function createCube() {
  const positions = new Float32Array([
    -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,   // front
     1, -1, -1,  -1, -1, -1,  -1,  1, -1,   1,  1, -1,   // back
    -1,  1,  1,   1,  1,  1,   1,  1, -1,  -1,  1, -1,   // top
    -1, -1, -1,   1, -1, -1,   1, -1,  1,  -1, -1,  1,   // bottom
     1, -1,  1,   1, -1, -1,   1,  1, -1,   1,  1,  1,   // right
    -1, -1, -1,  -1, -1,  1,  -1,  1,  1,  -1,  1, -1    // left
  ]);
  const faceNormals = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
  const normals = new Float32Array(faceNormals.flatMap(n => [...n, ...n, ...n, ...n]));

  // Tangent; bitangent = cross(N, T)
  const faceTangents = [[1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [0, 0, -1], [0, 0, 1]];
  const tangents = new Float32Array(faceTangents.flatMap(t => [...t, ...t, ...t, ...t]));

  const texCoords = new Float32Array(faceNormals.flatMap(() => [0, 0, 1, 0, 1, 1, 0, 1]));

  const indices = new Uint16Array([
     0,  1,  2,   0,  2,  3,   // front
     4,  5,  6,   4,  6,  7,   // back
     8,  9, 10,   8, 10, 11,   // top
    12, 13, 14,  12, 14, 15,   // bottom
    16, 17, 18,  16, 18, 19,   // right
    20, 21, 22,  20, 22, 23    // left
  ]);
  return { positions, normals, tangents, texCoords, indices };
}

// Cylinder
function createCylinder(segments = 64, uRepeat = 3) {
  const positions = [], normals = [], tangents = [], texCoords = [], indices = [];

  // Side: theta grows with u, so T points along the circle and B = cross(N, T) points up
  for (let i = 0; i <= segments; i++) {
    const u = i / segments, theta = 2 * Math.PI * u;
    const s = Math.sin(theta), c = Math.cos(theta);
    for (const y of [-1, 1]) {
      positions.push(s, y, c);
      normals.push(s, 0, c);
      tangents.push(c, 0, -s);
      texCoords.push(u * uRepeat, (y + 1) / 2);
    }
  }
  for (let i = 0; i < segments; i++) {
    const k = 2 * i;
    indices.push(k, k + 2, k + 3, k, k + 3, k + 1);
  }

  // Caps: planar mapping of x, z into the texture, T = +x on both
  for (const y of [1, -1]) {
    const center = positions.length / 3;
    positions.push(0, y, 0);
    normals.push(0, y, 0);
    tangents.push(1, 0, 0);
    texCoords.push(0.5, 0.5);
    for (let i = 0; i <= segments; i++) {
      const theta = 2 * Math.PI * i / segments;
      const s = Math.sin(theta), c = Math.cos(theta);
      positions.push(s, y, c);
      normals.push(0, y, 0);
      tangents.push(1, 0, 0);
      texCoords.push(0.5 + 0.5 * s, 0.5 - 0.5 * y * c);  // keeps cross(N, T) along +v
    }
    for (let i = 0; i < segments; i++) {
      const a = center + 1 + i, b = a + 1;
      if (y > 0) indices.push(center, a, b);
      else indices.push(center, b, a);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}


// Sphere
function createSphere(uSegments = 64, vSegments = 32) {
  const positions = [], normals = [], tangents = [], texCoords = [], indices = [];
  for (let i = 0; i <= vSegments; i++) {
    const phi = Math.PI * i / vSegments;
    const sinp = Math.sin(phi), cosp = Math.cos(phi);
    for (let j = 0; j <= uSegments; j++) {
      const theta = 2 * Math.PI * j / uSegments;
      const s = Math.sin(theta), c = Math.cos(theta);
      const x = s * sinp, y = cosp, z = c * sinp;
      positions.push(x, y, z);
      normals.push(x, y, z);
      tangents.push(c, 0, -s);
      texCoords.push(j / uSegments, 1 - i / vSegments);
    }
  }
  for (let i = 0; i < vSegments; i++) {
    for (let j = 0; j < uSegments; j++) {
      const k1 = i * (uSegments + 1) + j;
      const k2 = k1 + uSegments + 1;
      indices.push(k1, k2, k1 + 1);
      indices.push(k2, k2 + 1, k1 + 1);
    }
  }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}


// Cone 
function createCone(segments = 64, vSegments = 16) {
  const positions = [], normals = [], tangents = [], texCoords = [], indices = [];
  const r = 1, h = 2, len = Math.sqrt(r * r + h * h);

  // Side
  for (let i = 0; i <= vSegments; i++) {
    const v = i / vSegments;
    const y = -1 + h * v, radius = r * (1 - v);
    for (let j = 0; j <= segments; j++) {
      const u = j / segments, theta = 2 * Math.PI * u;
      const s = Math.sin(theta), c = Math.cos(theta);
      positions.push(radius * s, y, radius * c);
      normals.push(h * s / len, r / len, h * c / len);
      tangents.push(c, 0, -s);
      texCoords.push(u, v);
    }
  }
  for (let i = 0; i < vSegments; i++) {
    for (let j = 0; j < segments; j++) {
      const k1 = i * (segments + 1) + j;
      const k2 = k1 + segments + 1;
      indices.push(k1, k1 + 1, k2 + 1, k1, k2 + 1, k2);
    }
  }

  // Base
  const center = positions.length / 3;
  positions.push(0, -1, 0);
  normals.push(0, -1, 0);
  tangents.push(1, 0, 0);
  texCoords.push(0.5, 0.5);
  for (let j = 0; j <= segments; j++) {
    const theta = 2 * Math.PI * j / segments;
    const s = Math.sin(theta), c = Math.cos(theta);
    positions.push(s, -1, c);
    normals.push(0, -1, 0);
    tangents.push(1, 0, 0);
    texCoords.push(0.5 + 0.5 * s, 0.5 + 0.5 * c);
  }
  for (let j = 0; j < segments; j++) {
    const a = center + 1 + j, b = a + 1;
    indices.push(center, b, a);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}


// Torus 
function createTorus(R = 0.65, r = 0.35, uSegments = 64, vSegments = 32, uRepeat = 2) {
  const positions = [], normals = [], tangents = [], texCoords = [], indices = [];
  for (let i = 0; i <= vSegments; i++) {
    const phi = 2 * Math.PI * i / vSegments;
    const sinp = Math.sin(phi), cosp = Math.cos(phi);
    for (let j = 0; j <= uSegments; j++) {
      const theta = 2 * Math.PI * j / uSegments;
      const s = Math.sin(theta), c = Math.cos(theta);
      positions.push((R + r * cosp) * s, r * sinp, (R + r * cosp) * c);
      normals.push(cosp * s, sinp, cosp * c);
      tangents.push(c, 0, -s);
      texCoords.push(uRepeat * j / uSegments, i / vSegments + 0.5);  // + 0.5: middle of the image on the outside of the ring
    }
  }
  for (let i = 0; i < vSegments; i++) {
    for (let j = 0; j < uSegments; j++) {
      const k1 = i * (uSegments + 1) + j;
      const k2 = k1 + uSegments + 1;
      indices.push(k1, k1 + 1, k2 + 1, k1, k2 + 1, k2);
    }
  }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}
