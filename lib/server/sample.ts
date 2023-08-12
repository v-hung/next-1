'use server'
import db from "./prismadb"

export type SampleColumnsType = {
  key: string,
  label: string,
  show: boolean,
  required?: boolean,
  col?: number
} & (
  SampleColumnSelectType | 
  SampleColumnReactionType |
  SampleColumnImageType |
  SampleColumnPermissionsType |
  {
    type: 'string' | 'date' | 'publish' | 'int',
    details?: undefined;
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
    multiple: boolean
  }
}

export type SampleColumnReactionType = {
  type: 'relation',
  details: {
    type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many',
    api: string,
    title: string
  }
}

export type SampleColumnPermissionsType = {
  type: 'permissions',
}

export type GetDataSampleState = {
  page: number, 
  per_page: number,
  columns: SampleColumnsType[]
}

const getDataSample = async ({
  page, 
  per_page,
  table,
  columns
}: GetDataSampleState & { table: string }) => {
  if (page < 1) page = 1

  const start = (page - 1) * per_page

  const include = columns.reduce((pre, cur) => {
    if (cur.type == "image" || cur.type == "relation") {
      return {...pre, [cur.key]: true}
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

const getItemDataSample = async ({
  id,
  table, columns
}: GetItemDataSampleState & { table: string }) => {

  const include = columns.reduce((pre, cur) => {
    if (cur.type == "image" || cur.type == "relation" || cur.type == "permissions") {
      return {...pre, [cur.key]: true}
    }
    else {
      return pre
    }
  }, {})

  const data = await (db as any)[table].findUnique({
    where: {
      id: columns.find(v => v.key == "id")?.type == "int" ? (+id || 0) : id,
    },
    include: include
  })

  return data
}

export type DeleteDataSampleState = {
  ids: any[],
}

const deleteDataSample = async ({
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

const addEditDataSample = async ({
  data, edit = false, columns, table
}: AddEditDataSampleState & { table: string }) => {
  try {
    const dataCreate: any = columns.filter(v => !['id', 'createdAt', 'updatedAt', 'publish']
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
        else if (pre.type == "permissions") {
          if (data[pre.key]) {
            let tempCreate = {}

            if (!edit) {
              tempCreate = {
                create: JSON.parse(data[pre.key]).map((v: any) =>
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
              tempCreate = {
                connectOrCreate: JSON.parse(data[pre.key]).map((v: any) =>
                  ({
                    where: {
                      roleId_permissionKey_permissionTableName: {
                        permissionKey: v.key,
                        permissionTableName: v.tableName,
                        roleId: data.id
                      }
                    },
                    create: {
                      permissionKey: v.key,
                      permissionTableName: v.tableName
                    }
                  })
                )
              }
            }

            return { ...cur, [pre.key]: tempCreate }
          }
          else
            return cur
        }
        else {
          return { ...cur, [pre.key]: data[pre.key] }
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
    throw "Server Error"
  }
}

export {
  getDataSample,
  getItemDataSample,
  deleteDataSample,
  addEditDataSample
}