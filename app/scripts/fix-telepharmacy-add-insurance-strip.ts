import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

// Reuse the homepage's real "INSURANCE MADE EASIER" promoStrip content
// verbatim (same real copy/CTA/icon) rather than re-entering it.
const homepagePromoStrip = (await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 }))
  .docs[0].layout.find((b: any) => b.blockType === 'promoStrip' && b.kicker === 'INSURANCE MADE EASIER')
if (!homepagePromoStrip) throw new Error('homepage insurance promoStrip not found — aborting')
const { id: _omitId, ...insuranceStrip } = homepagePromoStrip

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

const whyBedeeIndex = layout.findIndex((b) => b.blockType === 'featureSteps')
if (whyBedeeIndex === -1) throw new Error('featureSteps (WHY BEDEE TELEPHARMACY) block not found — aborting')
layout.splice(whyBedeeIndex + 1, 0, insuranceStrip)

await payload.update({ collection: 'pages', id: page.id, data: { layout }, overrideAccess: true })
console.log('done')
process.exit(0)
