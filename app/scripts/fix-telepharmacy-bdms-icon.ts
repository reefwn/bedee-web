import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const newIcon = await payload.create({
  collection: 'media',
  data: { alt: 'ไอคอนมาตรฐาน BDMS' },
  file: {
    data: readFileSync(
      '/private/tmp/claude-501/-Volumes-Seagate-Personal-bedee-com-cloned/aa4a97b3-ba19-422b-a247-dd82cdcf1b6e/scratchpad/icon-bdms-standard-round.png',
    ),
    mimetype: 'image/png',
    name: 'icon-tp-bdms-standard.png',
    size: readFileSync(
      '/private/tmp/claude-501/-Volumes-Seagate-Personal-bedee-com-cloned/aa4a97b3-ba19-422b-a247-dd82cdcf1b6e/scratchpad/icon-bdms-standard-round.png',
    ).length,
  },
  overrideAccess: true,
})

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]
const trustBarGrid = layout.filter((b) => b.blockType === 'iconGrid')[0]
const item = trustBarGrid.items.find((i: any) => i.label === 'มาตรฐาน BDMS')
item.icon = newIcon.id

await payload.update({ collection: 'pages', id: page.id, data: { layout }, overrideAccess: true })
console.log('done')
process.exit(0)
