import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export async function pickers(
  root: string,
  responses: {
    kind: 'open' | 'save'
    directory?: boolean
    multiple?: boolean
    response: string | string[] | null
  }[],
) {
  await writeFile(path.join(root, 'pickers.json'), JSON.stringify(responses))
}

// Small, deliberately overlapping data: every filter has both matches and controls.
export const assets = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    name: 'Aster',
    creator: 'Zebra',
    type: 'avatars',
    tags: ['赤', '共通'],
    category: undefined,
    avatars: [],
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    name: 'Blouse',
    creator: 'Maple-A',
    type: 'avatarWearables',
    tags: ['赤', '青'],
    category: '衣装',
    avatars: ['Aster', 'Birch'],
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    name: 'Coat',
    creator: 'Maple-B',
    type: 'avatarWearables',
    tags: ['青'],
    category: '衣装',
    avatars: ['Aster'],
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    name: 'Desk',
    creator: 'Alpha',
    type: 'worldObjects',
    tags: ['共通'],
    category: '家具',
    avatars: [],
  },
  {
    id: '10000000-0000-4000-8000-000000000005',
    name: 'Effect',
    creator: 'Beta',
    type: 'otherAssets',
    tags: [],
    category: '',
    avatars: [],
  },
] as const

export async function library(root: string) {
  const base = path.join(root, 'assets')
  await mkdir(path.join(base, 'metadata'), { recursive: true })
  for (const type of [
    'avatars',
    'avatarWearables',
    'worldObjects',
    'otherAssets',
  ]) {
    const data = assets
      .filter((a) => a.type === type)
      .map((a) => ({
        id: a.id,
        description: {
          name: a.name,
          creator: a.creator,
          imageFilename: null,
          tags: a.tags,
          memo: `${a.name} のメモ`,
          boothItemId: null,
          dependencies: [],
          createdAt: 1735689600000 + assets.indexOf(a) * 86400000,
          publishedAt: 1735689600000 + (4 - assets.indexOf(a)) * 86400000,
        },
        ...(type !== 'avatars' ? { category: a.category } : {}),
        ...(type === 'avatarWearables' ? { supportedAvatars: a.avatars } : {}),
      }))
    await writeFile(
      path.join(base, 'metadata', `${type}.json`),
      JSON.stringify({ version: 3, data }),
    )
  }
  for (const a of assets) {
    await mkdir(path.join(base, 'data', a.id), { recursive: true })
    await writeFile(
      path.join(base, 'data', a.id, `${a.name}.txt`),
      `${a.name} content`,
    )
  }
}

export async function libraryWithUnlabeledWearable(root: string) {
  await library(root)
  const metadata = path.join(root, 'assets/metadata')
  const other = JSON.parse(
    await readFile(path.join(metadata, 'otherAssets.json'), 'utf8'),
  )
  const wearables = JSON.parse(
    await readFile(path.join(metadata, 'avatarWearables.json'), 'utf8'),
  )
  wearables.data.push({ ...other.data[0], supportedAvatars: [] })
  other.data = []
  await writeFile(
    path.join(metadata, 'otherAssets.json'),
    JSON.stringify(other),
  )
  await writeFile(
    path.join(metadata, 'avatarWearables.json'),
    JSON.stringify(wearables),
  )
}
