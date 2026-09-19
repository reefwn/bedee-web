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

// Reuse the pharmacist-chat icon already uploaded for the medication-refill
// section — same visual (avatar + chat bubble) fits "คุยกับเภสัชกร" here too.
const chatIcon = (
  await payload.find({ collection: 'media', where: { filename: { equals: 'icon-tp-pharmacist-review.png' } }, limit: 1 })
).docs[0]
const packageIcon = await uploadImage(`${ASSET_DIR}/Icon/Pic-Web-05.png`, 'ไอคอนยาจัดส่งถึงบ้าน', 'icon-tp-delivery-package.png')

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]
const heroCarousel = layout.find((b) => b.blockType === 'heroCarousel')
const slide = heroCarousel.slides[0]

slide.badgeLabel = 'Telepharmacy โดย BeDee by BDMS'
slide.secondaryCtaLabel = 'ต้องการเติมยาเดิม'
slide.secondaryCtaUrl = 'https://bit.ly/bedeetelepharmacist'
slide.checklistItems = [{ label: 'ไม่มีค่าปรึกษา' }, { label: 'วิดีโอคอลหรือแชท' }, { label: 'จัดส่งทั่วไทย' }]
slide.floatingCards = [
  { icon: packageIcon.id, label: 'ยาจัดส่งถึงบ้าน', sublabel: 'เลือกวิธีรับยาได้' },
  { icon: chatIcon.id, label: 'คุยกับเภสัชกร', sublabel: 'แบบเป็นส่วนตัว' },
]

await payload.update({ collection: 'pages', id: page.id, data: { layout }, overrideAccess: true })
console.log('done')
process.exit(0)
