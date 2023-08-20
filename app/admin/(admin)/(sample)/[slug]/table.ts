import { SampleColumnsType } from "@/lib/admin/sample"

type TableType = {
  name: string,
  tableName: string,
  slug: string,
  rowsPerPages: number[],
  columns: SampleColumnsType[]
}

export const TABLES_SAMPLE: TableType[] = [
  {
    name: 'Tài khoản',
    tableName: 'admin',
    slug: 'users',
    rowsPerPages: [10, 20, 50],
    columns: [
      { name: 'id', label: 'ID', type: 'string', show: true},
    
      { name: 'name', label: 'Tên', type: 'string', show: true, required: true},
      { name: 'email', label: 'Email', type: 'string', show: true, required: true},
      { name: 'image', label: 'Ảnh', type: 'file', show: true, details: { multiple: false, onlyTable: true }},
      { name: 'role', label: 'Quyền', type: 'relation', show: true, required: true, details: {
        typeRelation: 'many-to-one',
        tableNameRelation: 'role',
        titleRelation: 'name'
      }},
      { name: 'password', label: 'Password', type: 'password', show: false, required: true},
    
      { name: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
      { name: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
      { name: 'publish', label: 'Xuất bản', type: 'publish', show: true},
    ]
  },
  {
    name: 'Quyền',
    tableName: 'role',
    slug: 'roles',
    rowsPerPages: [10, 20, 50],
    columns: [
      { name: 'id', label: 'ID', type: 'string', show: true},
    
      { name: 'name', label: 'Tên', type: 'string', show: true, required: true},
      { name: 'permissions', label: 'Quyền', type: 'permissions', show: false, required: true, col: 12},
    
      { name: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
      { name: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
    ]
  },
  {
    name: 'Cài đặt',
    tableName: 'setting',
    slug: 'settings',
    rowsPerPages: [10, 20, 50],
    columns: [
      { name: 'id', label: 'ID', type: 'string', show: true},
    
      { name: 'name', label: 'Tên', type: 'string', show: true, required: true},
    
      { name: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
      { name: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
    ]
  },
  // {
  //   name: 'Danh mục sản phẩm',
  //   tableName: 'category',
  //   slug: 'categories',
  //   rowsPerPages: [10, 20, 50],
  //   columns: [
  //     { name: 'id', label: 'ID', type: 'string', show: true},
    
  //     { name: 'title', label: 'Tên', type: 'string', show: true, required: true},
  //     { name: 'type', label: 'Loại', type: 'select', details: {
  //       list: [
  //         { title: 'Game liên quân', value: "lien-quan"},
  //         { title: 'Game tốc chiến', value: "toc-chien"},
  //         { title: 'Game FREE FIRE', value: "free-fire"},
  //         { title: 'Vòng quay may mắn', value: "vong-quay"}
  //       ]
  //     }, show: true, required: true, },
  //     { name: 'image', label: 'Ảnh', type: 'file', show: true, details: { multiple: false, onlyTable: true }},
  //     { name: 'sold', label: 'Đã bán', type: 'int', show: true},
    
  //     { name: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
  //     { name: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
  //     { name: 'publish', label: 'Xuất bản', type: 'publish', show: true},
  //   ]
  // },
  {
    name: 'Danh mục điểm chụp',
    tableName: 'groupScene',
    slug: 'group',
    rowsPerPages: [10, 20, 50],
    columns: [
      { name: 'id', label: 'ID', type: 'string', show: true},
    
      { name: 'name', label: 'Tên', type: 'string', show: true, required: true},
    
      { name: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
      { name: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
      { name: 'publish', label: 'Xuất bản', type: 'publish', show: true},
    ]
  },
  {
    name: 'Sản phẩm',
    tableName: 'product',
    slug: 'products',
    rowsPerPages: [10, 20, 50],
    columns: [
      { name: 'id', label: 'ID', type: 'int', show: true},
    
      { name: 'name', label: 'Tên', type: 'string', show: true, required: true},
      { name: 'price', label: 'Giá', type: 'int', show: true, required: true},
      { name: 'promotionalPrice', label: 'Giá khuyến mãi', type: 'int', show: true},
      { name: 'heros', label: 'Số tướng', type: 'int', show: false, required: true},
      { name: 'skins', label: 'Số skin', type: 'int', show: false, required: true},
      { name: 'rank', label: 'Rank', type: 'string', show: false, required: true},
      { name: 'gem', label: 'Kim cương', type: 'int', show: true, required: true},
      { name: 'category', label: 'Danh mục', type: 'relation', show: true, required: true, details: {
        typeRelation: 'many-to-one',
        tableNameRelation: 'category',
        titleRelation: 'title'
      }},
      { name: 'images', label: 'Ảnh', type: 'file', show: true, details: { multiple: true, onlyTable: true }},
    
      { name: 'createdAt', label: 'Ngày tạo', type: 'date', show: true},
      { name: 'updatedAt', label: 'Ngày cập nhập', type: 'date', show: true},
      { name: 'publish', label: 'Xuất bản', type: 'publish', show: true},
    ]
  },
  
]