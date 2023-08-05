import AdminContentCategories from "@/components/admin/content/AdminContentCategories"
import db from "@/lib/server/prismadb";

const COLUMNS = [
  { id: 'id', label: 'ID', width: "0px"},
  { id: 'title', label: 'Tên'},
  { id: 'age', label: 'Tuổi'},
  { id: 'gender', label: 'Giới tính'},
]

const getData = async () => {
  const categories = await db.category.findMany()

  return categories;
}

export default async () => {
  const data = await getData()

  return (
    <AdminContentCategories data={data} />
  )
}