import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

function text(t: string) {
  return { type: 'text', mode: 'normal', text: t, style: '', detail: 0, format: 0, version: 1 }
}
function paragraph(children: any[]) {
  return { type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children }
}

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

// SEO audit fix #1-3: title/meta were stale (didn't mention refill,
// insurance, or BDMS certs from the redesign), 89 chars (Google truncates
// past ~60), and had a typo ("มาตราฐาน" -> "มาตรฐาน").
const newTitle = 'ปรึกษาเภสัชกรออนไลน์ฟรี เติมยาเดิม ส่งถึงบ้าน | BeDee'
const newDescription =
  'บริการปรึกษาเภสัชกรออนไลน์ฟรี ผ่านการรับรองมาตรฐานจาก อย. และเครือ BDMS เติมยาเดิม สั่งยาคุณภาพ พร้อมจัดส่งทั่วไทย เร็วสุด 90 นาทีในกรุงเทพฯ'

// SEO audit fix #4: no definition of "เภสัชกรรมทางไกล (Telepharmacy)" itself
// appeared in the first ~100 words — added as its own short block right
// after the hero, before any other content.
const definitionBlock = {
  blockType: 'richTextContent' as const,
  content: {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        paragraph([
          text(
            'เภสัชกรรมทางไกล (Telepharmacy) คือบริการให้คำปรึกษาและจ่ายยาโดยเภสัชกรผ่านช่องทางออนไลน์ เช่น วิดีโอคอลหรือแชท แทนการเดินทางไปร้านยาด้วยตนเอง BeDee ให้บริการนี้ภายใต้การรับรองจากสำนักงานคณะกรรมการอาหารและยา (อย.)',
          ),
        ]),
      ],
    },
  },
}

const heroIndex = layout.findIndex((b) => b.blockType === 'heroCarousel')
if (heroIndex === -1) throw new Error('heroCarousel block not found — aborting')
layout.splice(heroIndex + 1, 0, definitionBlock)

await payload.update({
  collection: 'pages',
  id: page.id,
  data: {
    title: newTitle,
    seo: { metaTitle: newTitle, metaDescription: newDescription },
    layout,
  },
  overrideAccess: true,
})
console.log('done')
process.exit(0)
