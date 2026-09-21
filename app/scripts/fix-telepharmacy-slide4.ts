import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

async function mediaId(filename: string) {
  const doc = (await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })).docs[0]
  if (!doc) throw new Error(`media not found: ${filename}`)
  return doc.id
}

const [iconClock, iconSubmitInfo, iconPharmacistReview, iconMedComplete, iconPrivacy, iconEasyAccess, pharmacyPhoto] =
  await Promise.all([
    mediaId('icon-tp-fast-delivery.png'),
    mediaId('icon-tp-submit-info.png'),
    mediaId('icon-tp-pharmacist-review.png'),
    mediaId('icon-tp-med-complete.png'),
    mediaId('icon-tp-privacy.png'),
    mediaId('icon-tp-easy-access.png'),
    mediaId('tp-med-refill-pharmacy-stock.png'),
  ])

function text(t: string) {
  return { type: 'text', mode: 'normal', text: t, style: '', detail: 0, format: 0, version: 1 }
}
function paragraph(children: any[]) {
  return { type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children }
}
function heading(t: string) {
  return { tag: 'h2', type: 'heading', format: '', indent: 0, version: 1, direction: 'ltr', children: [text(t)] }
}
function link(t: string, url: string) {
  return {
    type: 'link',
    version: 3,
    format: '',
    indent: 0,
    direction: 'ltr',
    fields: { url, newTab: true, linkType: 'custom' },
    children: [text(t)],
  }
}

// D1 — "WHY BEDEE TELEPHARMACY" (Revise Website.pptx slide 4, image9.png):
// exact fit for the existing dark FeatureSteps variant, no schema change.
const whyBedee = {
  blockType: 'featureSteps' as const,
  variant: 'dark' as const,
  kicker: 'WHY BEDEE TELEPHARMACY',
  heading: 'ร้านยาออนไลน์ที่ดูแลมากกว่าการส่งยา',
  description: 'ครบตั้งแต่ประเมินความต้องการ ให้คำแนะนำ ไปจนถึงจัดส่งยาและบันทึกข้อมูลสุขภาพ',
  items: [
    { icon: iconClock, title: 'สะดวกและรวดเร็ว', description: 'สั่งยาออนไลน์ได้จากทุกที่ ไม่ต้องเสียเวลาเดินทางหรือรอคิวหน้าร้าน' },
    { icon: iconSubmitInfo, title: 'รับยาได้หลายรูปแบบ', description: 'ส่งด่วน ส่งมาตรฐาน หรือเลือกรับที่ร้านยาพาร์ทเนอร์ที่ร่วมรายการ' },
    { icon: iconPharmacistReview, title: 'เภสัชกรให้คำปรึกษา', description: 'แนะนำวิธีใช้ยา ข้อควรระวัง และตอบคำถามตามข้อมูลสุขภาพของแต่ละคน' },
    { icon: iconMedComplete, title: 'ผลิตภัณฑ์หลากหลาย', description: 'ครอบคลุมยา วิตามิน ผลิตภัณฑ์เสริมอาหาร และอุปกรณ์ดูแลสุขภาพ' },
    { icon: iconPrivacy, title: 'บริการอย่างมีมาตรฐาน', description: 'ยาได้รับการจัดจากร้านยาที่ผ่านการคัดกรอง พร้อมกระบวนการที่ตรวจสอบได้' },
    { icon: iconEasyAccess, title: 'ดูแลครบในที่เดียว', description: 'ปรึกษา สั่งซื้อ ชำระเงิน ติดตามการจัดส่ง และดูประวัติสุขภาพในแพลตฟอร์มเดียว' },
  ],
}

// D2 — "TELEPHARMACY STANDARD" intro (image11.png) + the real BeDee/BDMS
// certification badges (image12.png) — the exact same credentialStrip
// already live on the homepage (page id 11, real certs/identifiers/links),
// reused here rather than re-entering the same real-world facts twice.
const standardIntro = {
  blockType: 'richTextContent' as const,
  content: {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        heading('บริการเภสัชกรรมทางไกลที่มีมาตรฐานและตรวจสอบได้'),
        paragraph([
          text(
            'สำนักงานคณะกรรมการอาหารและยา (อย.) ประกาศรับรองโปรแกรมประยุกต์สำหรับให้บริการ Telepharmacy โดยพิจารณาทั้งด้านกฎหมาย ความมั่นคงปลอดภัยสารสนเทศ และการคุ้มครองข้อมูลส่วนบุคคล',
          ),
        ]),
        paragraph([
          text(
            'BeDee ให้บริการผ่านระบบ PharmCare Telepharmacy หนึ่งในแพลตฟอร์มที่ อย. ประกาศรับรอง สำหรับการให้บริการเภสัชกรรมทางไกลของร้านขายยาแผนปัจจุบัน (ขย.1) ',
          ),
          link('อ่านประกาศจาก อย. →', 'https://drug.fda.moph.go.th/press-release/telepharmacy_application_list_no02'),
        ]),
      ],
    },
  },
}

const homepageCredentialStripFound = (
  (await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })).docs[0]?.layout ?? []
).find((b: any) => b.blockType === 'credentialStrip')
if (!homepageCredentialStripFound) throw new Error('homepage credentialStrip not found — aborting')
const homepageCredentialStrip = homepageCredentialStripFound as any
// Array-row ids (block.id, each items[].id) are global primary keys in
// Postgres, not scoped per page — copying the homepage's exact ids onto a
// second page's copy of this block collides. Strip only those, not the
// nested image relation objects (whose own `id` is the real media reference).
const { id: _omitBlockId, items, ...credentialStripRest } = homepageCredentialStrip
const standardBadges = {
  ...credentialStripRest,
  blockType: 'credentialStrip' as const,
  items: items.map((item: any) => {
    const { id: _omitItemId, ...rest } = item
    return rest
  }),
}

// D3 — "MEDICINE & HEALTH PRODUCTS" (image10.png): replaces the older
// meds-intro + medIconGrid + medList trio with one trustChecklist section
// (checklist + real pharmacy-stock photo, per the slide's own annotation
// "ภาพ คลังยาเยอะๆ แบบห้องยาในโรงพยาบาล" — reusing the photo freed up when
// the medication-refill section's image was swapped to the app screenshot).
const medicineProducts = {
  blockType: 'trustChecklist' as const,
  kicker: 'MEDICINE & HEALTH PRODUCTS',
  heading: 'ยาคุณภาพ ครอบคลุมความต้องการด้านสุขภาพ',
  body: 'ให้บริการทั้งยาสามัญประจำบ้าน ยาที่จำหน่ายในร้านยาโดยเภสัชกร ยาตามใบสั่งแพทย์ วิตามิน และผลิตภัณฑ์เสริมอาหาร โดยเภสัชกรจะพิจารณาความเหมาะสมก่อนจัดยา',
  image: pharmacyPhoto,
  items: [
    { title: 'ยาแก้ปวด ลดไข้ และยาสำหรับอาการทั่วไป' },
    { title: 'ยาระบบทางเดินหายใจและทางเดินอาหาร' },
    { title: 'ยาสำหรับโรคเรื้อรัง เช่น ความดันและเบาหวาน*' },
    { title: 'วิตามิน ผลิตภัณฑ์เสริมอาหาร และอุปกรณ์สุขภาพ' },
  ],
  disclaimer: '*ขึ้นอยู่กับใบสั่งแพทย์ ประวัติการรักษา และการประเมินของเภสัชกร',
}

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

const oldMedsIntroId = '6a7a95573f24f12897b83084'
const oldMedIconGridId = '6a7a95573f24f12897b83089'
const oldMedListId = '6a7a95573f24f12897b8308a'
const oldTrioIndex = layout.findIndex((b) => b.id === oldMedsIntroId)
if (
  oldTrioIndex === -1 ||
  layout[oldTrioIndex + 1]?.id !== oldMedIconGridId ||
  layout[oldTrioIndex + 2]?.id !== oldMedListId
) {
  throw new Error('old meds trio not found in expected shape — aborting')
}
layout.splice(oldTrioIndex, 3, medicineProducts)

const expertTabsIndex = layout.findIndex((b) => b.blockType === 'expertTabs')
if (expertTabsIndex === -1) throw new Error('expertTabs block not found — aborting')
layout.splice(expertTabsIndex + 1, 0, whyBedee)

const faqIndex = layout.findIndex((b) => b.blockType === 'faq')
if (faqIndex === -1) throw new Error('faq block not found — aborting')
layout.splice(faqIndex, 0, standardIntro, standardBadges)

await payload.update({ collection: 'pages', id: page.id, data: { layout }, overrideAccess: true })
console.log('done')
process.exit(0)
