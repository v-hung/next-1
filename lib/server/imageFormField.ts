"use server"

import { useCurrentUserAdmin } from "./helperServer"
import db from "./prismadb"

export const getListFolderImage = async ({
  tableName, parentId
}: {tableName?: string, parentId?: string}) => {
  try {
    const user = await useCurrentUserAdmin()

    if (!user) throw "Authorization"

    const [folders, images] = await db.$transaction([
      db.folderImage.findMany({
        where: {
          tableName,
          parentId
        },
      }),
      db.image.findMany({
        where: {
          tableName,
          folderImageId: parentId
        },
      }),
    ])

    return {folders, images}

  } catch (error) {
    throw (typeof error === "string") ? error : 'Server Error'
  }
}

type CreateEditFolderType = {
  folderId?: string,
  name: string, 
  tableName: string, 
  parentId?: string
} 

export const createEditFolder = async ({
  folderId, name, tableName, parentId
}: CreateEditFolderType) => {
  try {
    const user = await useCurrentUserAdmin()

    if (!user) throw "Authorization"

    let dataCreate = {
      name,
      adminId: user.id,
      tableName,
      parentId
    }

    const folder = folderId ? await db.folderImage.update({
      where: {
        id: folderId
      },
      data: dataCreate
    })
    : await db.folderImage.create({
      data: dataCreate
    })

    return {folder}

  } catch (error) {
    throw (typeof error === "string") ? error : 'Server Error'
  }
}