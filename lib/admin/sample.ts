'use server'

import { Setting } from "@prisma/client";
import { useCurrentUserAdmin } from "./helperServer";
import db from "./prismadb"
import bcrypt from 'bcrypt'

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
  // SampleColumnPermissionsType |
  {
    type: 'string' | 'date' | 'publish' | 'int' | 'bool' | 'text' | 'permissions' | 'password',
    details?: undefined
  }
)

export type SampleColumnSelectType = {
  type: 'select',
  details: {
    list: { title: string, value: string}[]
    multiple?: boolean,
  }
}

export type SampleColumnImageType = {
  type: 'image',
  details: {
    multiple?: boolean,
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

// export type SampleColumnPermissionsType = {
//   type: 'permissions',
//   details?: undefined
// }

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

  try {
    const [data, count] = await db.$transaction([
      (db as any)[table].findMany({
        take: per_page,
        skip: start,
        select: columns.reduce((pre, cur) => {
          if (cur.type != "password") {
            return {...pre, [cur.name]: true}
          }
          else {
            return pre
          }
        }, {})
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

  const data = await (db as any)[table].findUnique({
    where: {
      id: columns.find(v => v.name == "id")?.type == "int" ? (+id || 0) : id,
    },
    select: columns.reduce((pre, cur) => {
      if (cur.type != "password") {
        return {...pre, [cur.name]: true}
      }
      else {
        return pre
      }
    }, {})
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

    const intermediateResults = await Promise.all(columns.filter(v => !['id', 'createdAt', 'updatedAt', 'publish']
      .includes(v.name)).map(async (pre) => {
        if (pre.type == "date") {
          return { [pre.name]: new Date(data[pre.name]) }
        }
        else if (pre.type == "int") {
          return { [pre.name]: +(data[pre.name]) }
        }
        else if (pre.type == "password") {
          return { [pre.name]: await bcrypt.hash("password", 10) }
        }
        else if (pre.type == "image") {
          if (data[pre.name]) {
            let tempConnect = { id: data[pre.name] }
            if (pre.details.multiple) {
              tempConnect = JSON.parse(data[pre.name]).map((v: string) => ({
                id: v
              }))
            }
            return { [pre.name]: { connect: tempConnect } }
          }
          else
            return { [pre.name]: undefined }
        }
        else if (pre.type == "relation") {
          if (data[pre.name]) {
            let tempConnect = { id: data[pre.name] }
            if (pre.details.type == 'one-to-many' || pre.details.type == 'many-to-many') {
              tempConnect = JSON.parse(data[pre.name]).map((v: string) => ({
                id: v
              }))
            }
            return { [pre.name]: { connect: tempConnect } }
          }
          else
            return { [pre.name]: undefined }
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
                            key: v.key,
                            tableName: v.tableName
                          }
                        },
                        create: {
                          key: v.key,
                          tableName: v.tableName
                        }
                      }
                    }
                  })
                )
              }
            }
            else {

              await db.$transaction(JSON.parse(data[pre.name]).map((v: any) => db.permission.upsert({
                where: {
                  key_tableName: {
                    key: v.key,
                    tableName: v.tableName
                  }
                },
                create: {
                  key: v.key,
                  tableName: v.tableName
                },
                update: {}
              })))

              await db.permissionsOnRoles.deleteMany({
                where: {
                  roleId: data.id
                }
              })

              tempCreate = {
                create: JSON.parse(data[pre.name]).map((v: any) =>
                  ({
                    permissionKey: v.key,
                    permissionTableName: v.tableName
                  })
                )
              }
            }

            return { [pre.name]: tempCreate }
          }
          else
            return { [pre.name]: undefined }
        }
        else {
          return { [pre.name]: data[pre.name] }
        }
      }, 
      {}
    ))

    const dataCreate = intermediateResults.reduce((cur, result) => ({ ...cur, ...result }), {});

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
    throw (typeof error === "string" && error) ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
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
    throw (typeof error === "string" && error) ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

export const getValueSettings = async (settings: Setting[]) => {
  return Promise.all(settings.map(async (v2) => {

    if (v2.type == "image" && v2.value) {
      v2.value = await db.image.findUnique({
        where: {
          id: v2.value
        }
      }) as any
    }

    return {
      ...v2,
      details: v2.details ? JSON.parse(v2.details) : {}
    }
  }))
}

export const getSettingsData = async () => {
  const settings = await db.setting.findMany()

  const data = await getValueSettings(settings)
  return data
}