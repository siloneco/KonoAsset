import assert from 'node:assert/strict'
import { inflateRawSync } from 'node:zlib'

// Deterministic, uncompressed fixture ZIPs; no OS archiver or extra dependency.
export function zip(entries: Record<string, string | Buffer>) {
  const local: Buffer[] = []
  const central: Buffer[] = []
  let offset = 0
  for (const [name, value] of Object.entries(entries)) {
    const filename = Buffer.from(name)
    const data = Buffer.isBuffer(value) ? value : Buffer.from(value)
    let crc = 0xffffffff
    for (const byte of data) {
      crc ^= byte
      for (let bit = 0; bit < 8; bit++)
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
    crc = (crc ^ 0xffffffff) >>> 0
    const header = Buffer.alloc(30)
    header.writeUInt32LE(0x04034b50)
    header.writeUInt16LE(20, 4)
    header.writeUInt16LE(0x800, 6)
    header.writeUInt32LE(crc, 14)
    header.writeUInt32LE(data.length, 18)
    header.writeUInt32LE(data.length, 22)
    header.writeUInt16LE(filename.length, 26)
    const directory = Buffer.alloc(46)
    directory.writeUInt32LE(0x02014b50)
    directory.writeUInt16LE(20, 4)
    header.copy(directory, 6, 4, 30)
    directory.writeUInt32LE(offset, 42)
    local.push(header, filename, data)
    central.push(directory, filename)
    offset += header.length + filename.length + data.length
  }
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50)
  end.writeUInt16LE(central.length / 2, 8)
  end.writeUInt16LE(central.length / 2, 10)
  end.writeUInt32LE(Buffer.concat(central).length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...local, ...central, end])
}

export function unzip(data: Buffer): Map<string, Buffer> {
  const end = data.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
  assert.ok(end >= 0, 'Output must be a complete ZIP')
  let cursor = data.readUInt32LE(end + 16)
  const files = new Map<string, Buffer>()
  for (let i = 0; i < data.readUInt16LE(end + 10); i++) {
    assert.equal(data.readUInt32LE(cursor), 0x02014b50)
    const method = data.readUInt16LE(cursor + 10)
    const size = data.readUInt32LE(cursor + 20)
    const nameLength = data.readUInt16LE(cursor + 28)
    const extraLength = data.readUInt16LE(cursor + 30)
    const commentLength = data.readUInt16LE(cursor + 32)
    const local = data.readUInt32LE(cursor + 42)
    const name = data
      .subarray(cursor + 46, cursor + 46 + nameLength)
      .toString('utf8')
    const start =
      local + 30 + data.readUInt16LE(local + 26) + data.readUInt16LE(local + 28)
    const compressed = data.subarray(start, start + size)
    assert.ok(
      method === 0 || method === 8,
      `Unsupported ZIP compression: ${method}`,
    )
    files.set(name, method === 8 ? inflateRawSync(compressed) : compressed)
    cursor += 46 + nameLength + extraLength + commentLength
  }
  return files
}
