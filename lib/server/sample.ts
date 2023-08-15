'use server'

import { useCurrentUserAdmin } from "./helperServer";
import db from "./prismadb"

export type SampleColumnsType = {
  name: string,
  label: string,
  show: boolean,
  required?: boolean,
  col?: number
} & SampleFieldAndDetailsType

export type SampleFieldAndDetailsType = (
  SampleColumnSelectType | 
  SampleColumnReactionType |
  SampleColumnImageType |
  SampleColumnPermissionsType |
  {
    type: 'string' | 'date' | 'publish' | 'int' | 'bool' | 'text',
    details?: undefined
  }
)

export type SampleColumnSelectType = {
  type: 'select',
  details: {
    list: { title: string, value: string}[]
  }
}

export type SampleColumnImageType = {
  type: 'image',
  details: {
    multiple: boolean,
    onlyTable?: boolean,
    myself?: boolean
  }
}

export type SampleColumnReactionType = {
  type: 'relation',
  details: {
    type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many',
    tableNameRelation: string,
    titleRelation: string
  }
}

export type SampleColumnPermissionsType = {
  type: 'permissions',
  details?: {}
}

export type GetDataSampleState = {
  page: number, 
  per_page: number,
  columns: SampleColumnsType[]
}

export const getDataSample = async ({
  page, 
  per_page,
  table,
  columns
}: GetDataSampleState & { table: string }) => {
  if (page < 1) page = 1

  const start = (page - 1) * per_page

  const include = columns.reduce((pre, cur) => {
    if (cur.type == "image" || cur.type == "relation") {
      return {...pre, [cur.name]: true}
    }
    else {
      return pre
    }
  }, {})

  try {
    const [data, count] = await db.$transaction([
      (db as any)[table].findMany({
        take: per_page,
        skip: start,
        include: include
      }),
      (db as any)[table].count(),
    ])
  
    if (!data) {
      throw ""
    }
  
    return { data, count }
  } catch (error) {
    console.log({error})
    return { data: [], count: 0 }
  }
}

export type GetItemDataSampleState = {
  id: string,
  columns: SampleColumnsType[]
}

export const getItemDataSample = async ({
  id,
  table, columns
}: GetItemDataSampleState & { table: string }) => {

  const include = columns.reduce((pre, cur) => {
    if (cur.type == "image" || cur.type == "relation" || cur.type == "permissions") {
      return {...pre, [cur.name]: true}
    }
    else {
      return pre
    }
  }, {})

  const data = await (db as any)[table].findUnique({
    where: {
      id: columns.find(v => v.name == "id")?.type == "int" ? (+id || 0) : id,
    },
    include: include
  })

  return data
}

export type DeleteDataSampleState = {
  ids: any[],
}

export const deleteDataSample = async ({
  ids,
  table
}: DeleteDataSampleState & { table: string }) => {
  await (db as any)[table].deleteMany({
    where: {
      id: {
        in: ids
      }
    },
  })
}

export type AddEditDataSampleState = {
  data: any,
  edit: boolean,
  columns: SampleColumnsType[],
}

export const addEditDataSample = async ({
  data, edit = false, columns, table
}: AddEditDataSampleState & { table: string }) => {
  try {
    const dataCreate: any = columns.filter(v => !['id', 'createdAt', 'updatedAt', 'publish']
      .includes(v.name)).reduce((cur, pre) => {
        if (pre.type == "date") {
          return { ...cur, [pre.name]: new Date(data[pre.name]) }
        }
        else if (pre.type == "int") {
          return { ...cur, [pre.name]: +(data[pre.name]) }
        }
        else if (pre.type == "image") {
          if (data[pre.name]) {
            let tempConnect = { id: data[pre.name] }
            if (pre.details.multiple) {
              tempConnect = JSON.parse(data[pre.name]).map((v: string) => ({
                id: v
              }))
            }
            return { ...cur, [pre.name]: { connect: tempConnect } }
          }
          else
            return cur
        }
        else if (pre.type == "relation") {
          if (data[pre.name]) {
            let tempConnect = { id: data[pre.name] }
            if (pre.details.type == 'one-to-many' || pre.details.type == 'many-to-many') {
              tempConnect = JSON.parse(data[pre.name]).map((v: string) => ({
                id: v
              }))
            }
            return { ...cur, [pre.name]: { connect: tempConnect } }
          }
          else
            return cur
        }
        else if (pre.type == "permissions") {
          if (data[pre.name]) {
            let tempCreate = {}

            if (!edit) {
              tempCreate = {
                create: JSON.parse(data[pre.name]).map((v: any) =>
                  ({
                    permission: {
                      connectOrCreate: {
                        where: {
                          key_tableName: {
                            key: v.name,
                            tableName: v.tableName
                          }
                        },
                        create: {
                          key: v.name,
                          tableName: v.tableName
                        }
                      }
                    }
                  })
                )
              }
            }
            else {
              tempCreate = {
                connectOrCreate: JSON.parse(data[pre.name]).map((v: any) =>
                  ({
                    where: {
                      roleId_permissionKey_permissionTableName: {
                        permissionKey: v.name,
                        permissionTableName: v.tableName,
                        roleId: data.id
                      }
                    },
                    create: {
                      permissionKey: v.name,
                      permissionTableName: v.tableName
                    }
                  })
                )
              }
            }

            return { ...cur, [pre.name]: tempCreate }
          }
          else
            return cur
        }
        else {
          return { ...cur, [pre.name]: data[pre.name] }
        }
      }, {})

    if (edit) {
      await (db as any)[table].update({
        where: {
          id: data.id
        },
        data: dataCreate
      })
    }
    else {
      await (db as any)[table].create({
        data: dataCreate
      })
    }
  }
  catch (error) {
    console.log({error})
    throw (typeof error === "string") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

export const getListDataOfRelation = async ({
  tableName
}: { tableName: string }) => {
  try {
    const user = await useCurrentUserAdmin()

    if (!user) throw "Unauthorized"

    const data = await (db as any)[tableName].findMany()

    return {data}
  }
  catch (error) {
    console.log(error)
    throw (typeof error === "string") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}