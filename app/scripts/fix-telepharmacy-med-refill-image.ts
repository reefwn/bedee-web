import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })
const ASSET_PATH =
  '/Users/yossapol.wi/Downloads/Asset TP Page/ภาพประกอบ/TP Homepage Pic-Web-02.png'

const data = readFileSync(ASSET_PATH)
const newImage = await payload.create({
  collection: 'media',
  data: { alt: 'แอป BeDee หน้าสั่งยาตามใบสั่งแพทย์' },
  file: { data, mimetype: 'image/png', name: 'tp-med-refill-app-screen.png', size: data.length },
  overrideAccess: true,
})

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]
const medicationRefill = layout.find((b) => b.blockType === 'trustChecklist' && b.kicker === 'MEDICATION REFILL')
if (!medicationRefill) throw new Error('medication refill block not found — aborting')
medicationRefill.image = newImage.id

await payload.update({ collection: 'pages', id: page.id, data: { layout }, overrideAccess: true })
console.log('done')
process.exit(0)
