import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

const credentialIndex = layout.findIndex((b) => b.blockType === 'credentialStrip')
if (credentialIndex === -1) throw new Error('credentialStrip block not found — aborting')
const [credentialStrip] = layout.splice(credentialIndex, 1)

const insuranceIndex = layout.findIndex((b) => b.blockType === 'promoStrip' && b.kicker === 'INSURANCE MADE EASIER')
if (insuranceIndex === -1) throw new Error('insurance promoStrip block not found — aborting')
layout.splice(insuranceIndex + 1, 0, credentialStrip)

await payload.update({ collection: 'pages', id: page.id, data: { layout }, overrideAccess: true })
console.log('done')
process.exit(0)
