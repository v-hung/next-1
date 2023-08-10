import AdminContentSample from "@/components/admin/sample/AdminContentSample";
import { getDataSample } from "@/lib/server/sample";
import { TABLES_SAMPLE } from "./table";

export default async ({
  searchParams,
  params: { slug }
}: {
  searchParams: { [key: string]: string | string[] | undefined },
  params: { slug: string }
}) => {
  const table = TABLES_SAMPLE.find(v => v.slug == slug)

  if (table == undefined)
    return <div>Trang không tồn tại</div>

  const page = +(searchParams['page'] || 1)
  const per_page = +(searchParams['per_page'] || table.rows_per_pages[0])
 
  const { data, count } = await getDataSample({page, per_page, columns: table.columns, table: table.table_name})

  return (
    <AdminContentSample 
      name={table.name} 
      table_name={table.table_name}
      data={data} 
      count={count} 
      ROWS_PER_PAGES={table.rows_per_pages} 
      columns={table.columns}
    />
  )
}