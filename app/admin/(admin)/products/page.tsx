import AdminContentSample, { SampleColumnsType } from "@/components/admin/sample/AdminContentSample";
import db from "@/lib/server/prismadb";

const NAME = 'Sản phẩm'
const COLUMNS: SampleColumnsType[] = [
  { key: 'id', label: 'ID', type: 'string', show: true},

  { key: 'name', label: 'Tên', type: 'string', show: true, required: true},
  { key: 'price', label: 'Giá', type: 'int', show: true, required: true},
  { key: 'promotionalPrice', label: 'Giá khuyến mãi', type: 'int', show: true},
  { key: 'heros', label: 'Số tướng', type: 'int', show: false, required: true},
  { key: 'skins', label: 'Số skin', type: 'int', show: false, required: true},
  { key: 'rank', label: 'Rank', type: 'string', show: false, required: true},
  { key: 'gem', label: 'Kim cương', type: 'int', show: true, required: true},
  { key: 'category', label: 'Danh mục', type: 'relation', show: true, required: true, details: {
    type: 'many-to-one',
    api: '/api/admin/categories'
  }},
  { key: 'images', label: 'Ảnh', type: 'image', show: true, details: { multiple: true }},

  { key: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
  { key: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
  { key: 'publish', label: 'Xuất bản', type: 'publish', show: true},
]

const ROWS_PER_PAGES = [10, 20, 50]

const getData = async (page: number, per_page: number) => {
  if (page < 1) page = 1

  const start = (page - 1) * per_page

  const [data, count] = await db.$transaction([
    db.product.findMany({
      take: per_page,
      skip: start,
      include: {
        images: true
      }
    }),
    db.product.count(),
  ])

  if (!data) {
    return { data: [], count: 0 }
  }

  return { data, count }
}

const getItemData = async (id: string) => {
  const data = await db.product.findUnique({
    where: {
      id: id,
    },
    include: {
      images: true,
      category: true
    }
  })

  return data
}

const deleteData = async (ids: string[]) => {
  'use server'
  await db.product.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })
}

const addEditData = async (data: any, edit = false) => {
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
        else if (pre.type == "image") {
          if (data[pre.key]) {
            let tempConnect = { id: data[pre.key] }
            if (pre.details.multiple) {
              tempConnect = JSON.parse(data[pre.key]).map((v: string) => ({
                id: v
              }))
            }
            return { ...cur, [pre.key]: { connect: tempConnect } }
          }
          else
            return cur
        }
        else if (pre.type == "relation") {
          if (data[pre.key]) {
            let tempConnect = { id: data[pre.key] }
            if (pre.details.type == 'one-to-many' || pre.details.type == 'many-to-many') {
              tempConnect = JSON.parse(data[pre.key]).map((v: string) => ({
                id: v
              }))
            }
            return { ...cur, [pre.key]: { connect: tempConnect } }
          }
          else
            return cur
        }
        else {
          return { ...cur, [pre.key]: data[pre.key] }
        }
      }, {})

    if (edit) {
      await db.product.update({
        where: {
          id: data.id
        },
        data: dataCreate
      })
    }
    else {

    }
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