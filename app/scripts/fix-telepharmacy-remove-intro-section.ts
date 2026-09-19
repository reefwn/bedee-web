import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

// Remove the "ปรึกษา สะดวก ประหยัด" intro richTextContent block right after the hero
const newLayout = layout.filter((b) => b.id !== '6a7a95573f24f12897b83079')

if (newLayout.length === layout.length) {
  throw new Error('Target block not found — aborting to avoid a no-op write')
}

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
