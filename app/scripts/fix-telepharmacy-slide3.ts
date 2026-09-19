import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const ASSET_DIR = '/Users/yossapol.wi/Downloads/Asset TP Page'

async function uploadImage(path: string, alt: string, filename: string) {
  const data = readFileSync(path)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/png', name: filename, size: data.length },
    overrideAccess: true,
  })
}

// New assets from Revise Website.pptx slide 3
const heroPhoto = await uploadImage(
  `${ASSET_DIR}/ภาพประกอบ/VDO Call TP Pic-Web-01.png`,
  'ผู้ใช้วิดีโอคอลปรึกษาเภสัชกรผ่านแอป BeDee',
  'tp-hero-video-call.png',
)
const iconFastDelivery = await uploadImage(`${ASSET_DIR}/Icon/Pic-Web-04.png`, 'ไอคอนส่งด่วน', 'icon-tp-fast-delivery.png')
const iconPrivacy = await uploadImage(`${ASSET_DIR}/Icon/Pic-Web-08.png`, 'ไอคอนข้อมูลเป็นส่วนตัว', 'icon-tp-privacy.png')
const iconEasyAccess = await uploadImage(`${ASSET_DIR}/Icon/Pic-Web-09.png`, 'ไอคอนเข้าถึงง่าย', 'icon-tp-easy-access.png')
const iconSubmitInfo = await uploadImage(`${ASSET_DIR}/Icon/Pic-Web-05.png`, 'ไอคอนส่งข้อมูลยาเดิม', 'icon-tp-submit-info.png')
const iconPharmacistReview = await uploadImage(`${ASSET_DIR}/Icon/Pic-Web-06.png`, 'ไอคอนเภสัชกรตรวจสอบ', 'icon-tp-pharmacist-review.png')
const iconMedComplete = await uploadImage(`${ASSET_DIR}/Icon/Pic-Web-07.png`, 'ไอคอนยาครบจบในครั้งเดียว', 'icon-tp-med-complete.png')

// Existing certificate icon already used elsewhere on the site — reused for "มาตรฐาน BDMS"
const existingCertificate = (
  await payload.find({ collection: 'media', where: { filename: { equals: 'tc-icon-certificate.png' } }, limit: 1 })
).docs[0]

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

const heroCarousel = layout.find((b) => b.blockType === 'heroCarousel')
heroCarousel.slides[0].headline = 'ยกร้านยามาไว้ในมือ ปรึกษาเภสัชกรฟรี ยาส่งถึงบ้าน'
heroCarousel.slides[0].body =
  'สุขภาพดี ทุกที่ ทุกเวลา ด้วยร้านขายยาออนไลน์ที่ช่วยให้คุณรับคำแนะนำเรื่องยา เติมยาเดิม และสั่งยาคุณภาพในราคาที่เข้าถึงได้ พร้อมจัดส่งทั่วประเทศไทย'
heroCarousel.slides[0].ctaLabel = 'เริ่มปรึกษาเภสัชกร'
heroCarousel.slides[0].image = heroPhoto.id

const benefitIconGrid = layout.filter((b) => b.blockType === 'iconGrid')[0]
benefitIconGrid.items = [
  { icon: existingCertificate.id, label: 'มาตรฐาน BDMS' },
  { icon: iconEasyAccess.id, label: 'เข้าถึงง่าย' },
  { icon: iconFastDelivery.id, label: 'ส่งด่วน 90 นาที*' },
  { icon: iconPrivacy.id, label: 'ข้อมูลเป็นส่วนตัว' },
]

const medicationRefill = {
  blockType: 'featureSteps' as const,
  variant: 'light' as const,
  kicker: 'MEDICATION REFILL',
  heading: 'ยาใกล้หมด ไม่ต้องให้ทุกเดือน กลายเป็นเรื่องยุ่ง',
  description:
    'ขอรับยาหรือเติมยาเดิมจากข้อมูลยาที่ใช้อยู่ ใบสั่งยา หรือรูปฉลากยา เภสัชกรจะช่วยตรวจสอบรายการยา วิธีใช้ และความเหมาะสมก่อนจัดส่ง',
  items: [
    { icon: iconSubmitInfo.id, title: 'ส่งข้อมูลยาเดิม', description: 'แนบใบสั่งยา รูปฉลาก หรือชื่อยาที่ใช้อยู่' },
    { icon: iconPharmacistReview.id, title: 'เภสัชกรตรวจสอบ', description: 'ทบทวนวิธีใช้ ขนาดยา และประวัติแพ้ยา' },
    { icon: iconMedComplete.id, title: 'ยาครบ จบในครั้งเดียว', description: 'ยืนยันรายการ ชำระเงิน และเลือกวิธีรับยา' },
  ],
}

const benefitIndex = layout.indexOf(benefitIconGrid)
const newLayout = [...layout.slice(0, benefitIndex + 1), medicationRefill, ...layout.slice(benefitIndex + 1)]

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
