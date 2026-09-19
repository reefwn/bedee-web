import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

const trustBarGrid = layout
  .filter((b) => b.blockType === 'iconGrid')
  .find((b) => b.items?.some((i: any) => i.label === 'มาตรฐาน BDMS'))
if (!trustBarGrid) throw new Error('trust bar icon grid not found — aborting')
trustBarGrid.variant = 'plain'

await payload.update({ collection: 'pages', id: page.id, data: { layout }, overrideAccess: true })
console.log('done')
process.exit(0)
