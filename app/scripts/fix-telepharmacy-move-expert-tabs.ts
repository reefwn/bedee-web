import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

// "ปรึกษาเภสัชกรคุณภาพจาก BDMS" intro heading + the expertTabs block right
// after it (the แพทย์ในเครือ / ผู้เชี่ยวชาญในเครือ / เภสัชกรในเครือ tabs section) —
// move this pair to right after the medication-refill trustChecklist block.
const introId = '6a7a95573f24f12897b83082'
const introIndex = layout.findIndex((b) => b.id === introId)
const expertTabsIndex = layout.findIndex((b) => b.blockType === 'expertTabs')
if (introIndex === -1 || expertTabsIndex !== introIndex + 1) {
  throw new Error('expected pair not found in expected shape — aborting')
}
const [intro, expertTabs] = layout.splice(introIndex, 2)

const medRefillIndex = layout.findIndex((b) => b.blockType === 'trustChecklist')
if (medRefillIndex === -1) throw new Error('medication refill block not found — aborting')
layout.splice(medRefillIndex + 1, 0, intro, expertTabs)

await payload.update({ collection: 'pages', id: page.id, data: { layout }, overrideAccess: true })
console.log('done')
process.exit(0)
