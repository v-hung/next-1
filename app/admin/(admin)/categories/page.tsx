import AdminContentSample, { SampleColumnsType } from "@/components/admin/sample/AdminContentSample";
import db from "@/lib/server/prismadb";

const NAME = 'Danh mục'
const COLUMNS: SampleColumnsType[] = [
  { key: 'id', label: 'ID', type: 'string', show: true},

  { key: 'title', label: 'Tên', type: 'string', show: true, required: true},
  { key: 'type', label: 'Loại', type: 'select', details: {
    list: [
      { title: 'Game liên quân', value: "lien-quan"},
      { title: 'Game tốc chiến', value: "toc-chien"},
      { title: 'Game FREE FIRE', value: "free-fire"},
      { title: 'Vòng quay may mắn', value: "vong-quay"}
    ]
  }, show: true, required: true, },
  { key: 'image', label: 'Ảnh', type: 'image', show: true, details: { multiple: false }},

  { key: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
  { key: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
  { key: 'publish', label: 'Xuất bản', type: 'publish', show: true},
]

const ROWS_PER_PAGES = [10, 20, 50]

const getData = async (page: number, per_page: number) => {
  if (page < 1) page = 1

  const start = (page - 1) * per_page

  const [data, count] = await db.$transaction([
    db.category.findMany({
      take: per_page,
      skip: start,
      include: {
        image: true
      }
    }),
    db.category.count(),
  ])

  if (!data) {
    return { data: [], count: 0 }
  }

  return { data, count }
}

const getItemData = async (id: string) => {
  const data = await db.category.findUnique({
    where: {
      id: id,
    },
    include: {
      image: true
    }
  })

  return data
}

const deleteData = async (ids: string[]) => {
  'use server'
  await db.category.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })
}

const addEditData = async (data: any) => {
  'use server'

  try {
    const dataCreate: any = COLUMNS.filter(v => !['id', 'createdAt', 'updatedAt', 'publish']
      .includes(v.key)).reduce((cur, pre) => {
        if (pre.type == "date") {
          return { ...cur, [pre.key]: new Date(data[pre.key]) }
        }
        else if (pre.type == "int") {
          return { ...cur, [pre.key]: +(data[pre.key]) }
        }
        else if (pre.type == "image" || pre.type == "relation") {
          if (data[pre.key])
            return { ...cur, [pre.key]: { connect: { id: data[pre.key] } } }
          else
            return cur
        }
        else {
          return { ...cur, [pre.key]: data[pre.key] }
        }
      }, {})

    await db.category.create({
      data: dataCreate
    })
  }
  catch (error) {
    console.log({error})
    throw "Server Error"
  }
}

export default async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const page = +(searchParams['page'] || 1)
  const per_page = +(searchParams['per_page'] || ROWS_PER_PAGES[0])
 
  const { data, count } = await getData(page, per_page)

  return (
    <AdminContentSample name={NAME} data={data} count={count} ROWS_PER_PAGES={ROWS_PER_PAGES} columns={COLUMNS}
      deleteData={deleteData} 
    />
  )
}

export {
  COLUMNS,
  addEditData,
  getItemData,
  NAME
}