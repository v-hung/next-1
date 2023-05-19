import AdminContentCategories from "@/components/admin/content/AdminContentCategories"
import db from "@/lib/server/prismadb";

const getData = async () => {
  const categories = await db.category.findMany()

  return categories;
}

const a = 1

export default async () => {
  const data = await getData()

  return (
    <AdminContentCategories data={data} />
  )
}