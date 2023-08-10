import AdminContentSample from "@/components/admin/sample/AdminContentSample";
import { AddEditDataSampleState, DeleteDataSampleState, GetDataSampleState, GetItemDataSampleState, SampleColumnsType, addEditDataSample, deleteDataSample, getDataSample, getItemDataSample } from "@/lib/server/sample";

const NAME = 'Sản phẩm'
const TABLE_NAME = 'product'
const ROWS_PER_PAGES = [10, 20, 50]
const COLUMNS: SampleColumnsType[] = [
  { key: 'id', label: 'ID', type: 'int', show: true},

  { key: 'name', label: 'Tên', type: 'string', show: true, required: true},
  { key: 'price', label: 'Giá', type: 'int', show: true, required: true},
  { key: 'promotionalPrice', label: 'Giá khuyến mãi', type: 'int', show: true},
  { key: 'heros', label: 'Số tướng', type: 'int', show: false, required: true},
  { key: 'skins', label: 'Số skin', type: 'int', show: false, required: true},
  { key: 'rank', label: 'Rank', type: 'string', show: false, required: true},
  { key: 'gem', label: 'Kim cương', type: 'int', show: true, required: true},
  { key: 'category', label: 'Danh mục', type: 'relation', show: true, required: true, details: {
    type: 'many-to-one',
    api: '/api/admin/categories',
    title: 'title'
  }},
  { key: 'images', label: 'Ảnh', type: 'image', show: true, details: { multiple: true }},

  { key: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
  { key: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
  { key: 'publish', label: 'Xuất bản', type: 'publish', show: true},
]

const getData = async (data: Omit<GetDataSampleState, 'columns'>) => getDataSample({...data, table: TABLE_NAME, columns: COLUMNS})

const getItemData = async (data: Omit<GetItemDataSampleState, 'columns'>) => getItemDataSample({...data, table: TABLE_NAME, columns: COLUMNS})

const deleteData = async (data: DeleteDataSampleState) => {
  "use server"
  return await deleteDataSample({...data, table: TABLE_NAME})
}

const addEditData = async (data: Omit<AddEditDataSampleState, 'columns'>) => {
  "use server"
  return await addEditDataSample({...data, table: TABLE_NAME, columns: COLUMNS})
}

export default async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const page = +(searchParams['page'] || 1)
  const per_page = +(searchParams['per_page'] || ROWS_PER_PAGES[0])
 
  const { data, count } = await getData({page, per_page})

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