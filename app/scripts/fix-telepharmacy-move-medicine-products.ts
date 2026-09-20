import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

const medProductsIndex = layout.findIndex((b) => b.blockType === 'trustChecklist' && b.kicker === 'MEDICINE & HEALTH PRODUCTS')
if (medProductsIndex === -1) throw new Error('medicine products block not found — aborting')
const [medicineProducts] = layout.splice(medProductsIndex, 1)

const credentialIndex = layout.findIndex((b) => b.blockType === 'credentialStrip')
if (credentialIndex === -1) throw new Error('credentialStrip block not found — aborting')
layout.splice(credentialIndex + 1, 0, medicineProducts)

await payload.update({ collection: 'pages', id: page.id, data: { layout }, overrideAccess: true })
console.log('done')
process.exit(0)
