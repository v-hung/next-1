import AdminContentSample, { SampleColumnsType } from "@/components/admin/sample/AdminContentSample";
import db from "@/lib/server/prismadb";

const COLUMNS: SampleColumnsType[] = [
  { key: 'id', label: 'ID', type: 'string', show: true},

  { key: 'title', label: 'Tên', type: 'string', show: true},
  { key: 'image', label: 'Ảnh', type: 'image', show: true},
  { key: 'type', label: 'Loại', type: 'select', details: {
    list: [
      { title: 'Game liên quân', value: "lien-quan"},
      { title: 'Game tốc chiến', value: "toc-chien"},
      { title: 'Game FREE FIRE', value: "free-fire"},
      { title: 'Vòng quay may mắn', value: "vong-quay"}
    ]
  }, show: true},

  { key: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
  { key: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
  { key: 'status', label: 'Xuất bản', type: 'status', show: true},
]

const ROWS_PER_PAGES = [10, 20, 50]

const getData = async (page: number, per_page: number) => {
  if (page < 1) page = 1

  const start = (page - 1) * per_page

  const [data, count] = await db.$transaction([
    db.category.findMany({
      take: per_page,
      skip: start,
    }),
    db.category.count(),
  ])

  if (!data) {
    return { data: [], count: 0 }
  }

  return { data, count }
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

export default async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const page = +(searchParams['page'] || 1)
  const per_page = +(searchParams['per_page'] || ROWS_PER_PAGES[0])
 
  const { data, count } = await getData(page, per_page)

  return (
    <AdminContentSample name="Danh mục" data={data} count={count} ROWS_PER_PAGES={ROWS_PER_PAGES} columns={COLUMNS}
      deleteData={deleteData} 
    />
  )
}