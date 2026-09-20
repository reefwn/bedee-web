import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

// Remove the "บริการเภสัชกรรมทางไกลที่มีมาตรฐานและตรวจสอบได้" intro — redundant
// with the certificate/credentialStrip section right after it.
const newLayout = layout.filter((b) => b.id !== '6ab05547d2b0b77722f95d91')
if (newLayout.length === layout.length) {
  throw new Error('target block not found — aborting to avoid a no-op write')
}

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
