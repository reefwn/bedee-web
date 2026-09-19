import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })
const ASSET_DIR = '/Users/yossapol.wi/Downloads/Asset TP Page'

async function findMedia(filename: string) {
  const doc = (await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })).docs[0]
  if (!doc) throw new Error(`media not found: ${filename}`)
  return doc
}

async function uploadImage(path: string, alt: string, filename: string) {
  const data = readFileSync(path)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/png', name: filename, size: data.length },
    overrideAccess: true,
  })
}

const [iconSubmitInfo, iconPharmacistReview, iconMedComplete] = await Promise.all([
  findMedia('icon-tp-submit-info.png'),
  findMedia('icon-tp-pharmacist-review.png'),
  findMedia('icon-tp-med-complete.png'),
])

const sectionPhoto = await uploadImage(
  `${ASSET_DIR}/ภาพประกอบ/คลังยา-Pic-Web-03.png`,
  'คลังยาและเวชภัณฑ์พร้อมจัดส่ง',
  'tp-med-refill-pharmacy-stock.png',
)

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

const medicationRefill = {
  blockType: 'trustChecklist' as const,
  kicker: 'MEDICATION REFILL',
  heading: 'ยาใกล้หมด ไม่ต้องให้ทุกเดือน กลายเป็นเรื่องยุ่ง',
  body: 'ขอรับยาหรือเติมยาเดิมจากข้อมูลยาที่ใช้อยู่ ใบสั่งยา หรือรูปฉลากยา เภสัชกรจะช่วยตรวจสอบรายการยา วิธีใช้ และความเหมาะสมก่อนจัดส่ง',
  image: sectionPhoto.id,
  items: [
    { icon: iconSubmitInfo.id, title: 'ส่งข้อมูลยาเดิม', description: 'แนบใบสั่งยา รูปฉลาก หรือชื่อยาที่ใช้อยู่' },
    { icon: iconPharmacistReview.id, title: 'เภสัชกรตรวจสอบ', description: 'ทบทวนวิธีใช้ ขนาดยา และประวัติแพ้ยา' },
    { icon: iconMedComplete.id, title: 'ยาครบ จบในครั้งเดียว', description: 'ยืนยันรายการ ชำระเงิน และเลือกวิธีรับยา' },
  ],
  ctaVariant: 'solid' as const,
  ctaLabel: 'ปรึกษาเรื่องเติมยา',
  ctaUrl: 'https://bit.ly/bedeetelepharmacist',
  disclaimer:
    'การจ่ายยาเป็นไปตามดุลยพินิจของเภสัชกรและข้อกำหนดของยาแต่ละประเภท บางกรณีอาจต้องมีใบสั่งแพทย์หรือเข้ารับการตรวจเพิ่มเติม',
}

const index = layout.findIndex((b) => b.blockType === 'featureSteps')
if (index === -1) throw new Error('featureSteps block not found — aborting')
const newLayout = [...layout.slice(0, index), medicationRefill, ...layout.slice(index + 1)]

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
