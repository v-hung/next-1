import { SampleColumnsType } from "@/lib/server/sample"

type TableType = {
  name: string,
  tableName: string,
  slug: string,
  rowsPerPages: number[],
  columns: SampleColumnsType[]
}

export const TABLES_SAMPLE: TableType[] = [
  {
    name: 'Sản phẩm',
    tableName: 'product',
    slug: 'products',
    rowsPerPages: [10, 20, 50],
    columns: [
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
        tableNameRelation: 'category',
        title: 'title'
      }},
      { key: 'images', label: 'Ảnh', type: 'image', show: true, details: { multiple: true, onlyTable: true }},
    
      { key: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
      { key: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
      { key: 'publish', label: 'Xuất bản', type: 'publish', show: true},
    ]
  },
  {
    name: 'Danh mục',
    tableName: 'category',
    slug: 'categories',
    rowsPerPages: [10, 20, 50],
    columns: [
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
      { key: 'image', label: 'Ảnh', type: 'image', show: true, details: { multiple: false, onlyTable: true }},
    
      { key: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
      { key: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
      { key: 'publish', label: 'Xuất bản', type: 'publish', show: true},
    ]
  },
  {
    name: 'Tài khoản',
    tableName: 'admin',
    slug: 'users',
    rowsPerPages: [10, 20, 50],
    columns: [
      { key: 'id', label: 'ID', type: 'string', show: true},
    
      { key: 'name', label: 'Tên', type: 'string', show: true, required: true},
      { key: 'email', label: 'Email', type: 'string', show: true, required: true},
      { key: 'image', label: 'Ảnh', type: 'image', show: true, details: { multiple: false, onlyTable: true }},
      { key: 'role', label: 'Quyền', type: 'relation', show: true, required: true, details: {
        type: 'many-to-one',
        tableNameRelation: 'role',
        title: 'name'
      }},
    
      { key: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
      { key: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
      { key: 'publish', label: 'Xuất bản', type: 'publish', show: true},
    ]
  },
  {
    name: 'Quyền',
    tableName: 'role',
    slug: 'roles',
    rowsPerPages: [10, 20, 50],
    columns: [
      { key: 'id', label: 'ID', type: 'string', show: true},
    
      { key: 'name', label: 'Tên', type: 'string', show: true, required: true},
      { key: 'permissions', label: 'Quyền', type: 'permissions', show: false, required: true, col: 12},
    
      { key: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
      { key: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
    ]
  }
]