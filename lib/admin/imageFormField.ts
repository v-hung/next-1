"use server"

import { FolderImage, Image } from "@prisma/client"
import { useCurrentUserAdmin } from "./helperServer"
import db from "./prismadb"
import { existsSync, mkdirSync } from "fs"
import fsPromise from "fs/promises"
import sharp from "sharp"
import { v4 } from "uuid"
import path from "path"
import { imageSize } from "image-size";

const getParentString = (depth = 1) => {

  let includeObject: any = {
    include: {parent: true}
  }
  let pointer = includeObject.include;
  for (let i = 0; i < depth - 1; i++) {
    pointer.parent = {include: {parent: true}};
    pointer = pointer.parent.include;
  }

  return includeObject
}

const mapFolderRecursiveToArray = (folderParent: any | null, arr: FolderImage[]) => {
  if (folderParent && folderParent.parent) {
    arr.push({...folderParent.parent, parent: undefined})
    mapFolderRecursiveToArray(folderParent.parent, arr)
  }
}

export const getListFolderImage = async ({
  tableName, parentId, myself
}: {tableName?: string, parentId?: string, myself?: boolean}) => {
  try {
    const user = await useCurrentUserAdmin()

    if (!user) throw "Authorization"

    const [folderParent, folders, images] = await db.$transaction([
      db.folderImage.findUnique({
        where: {
          id: parentId || ''
        },
        include: getParentString(4).include
      }),
      db.folderImage.findMany({
        where: {
          tableName,
          parentId: parentId ? parentId : null,
          adminId: myself ? user.id : undefined
        },
      }),
      db.image.findMany({
        where: {
          tableName,
          folderImageId: parentId,
          adminId: myself ? user.id : undefined
        },
      }),
    ])

    let folderParents: any[] = []
    mapFolderRecursiveToArray({parent: folderParent}, folderParents)

    return {folderParents, folders, images}

  } catch (error) {
    console.log(error)
    throw (typeof error === "string" && error) ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

type CreateEditFolderType = {
  folderId?: string,
  name: string, 
  tableName: string, 
  parentId?: string | null
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
    throw (typeof error === "string" && error) ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

type UploadImagesType = {
  formData: FormData,
  tableName: string, 
  folderImageId?: string | null
} 

export const uploadImages = async ({
  formData, tableName, folderImageId
}: UploadImagesType) => {
  try {
    const user = await useCurrentUserAdmin()

    if (!user) throw "Unauthorized"
        
    if (!existsSync(`./storage/${tableName}`)){
      mkdirSync(`./storage/${tableName}`, { recursive: true });
    }

    const compress = {
      'png': {compressionLevel: 8, quality: 60},
      'jpeg': { quality: 60 },
      'webp': { quality: 60 },
      'gif': { }
    }

    const files = formData.getAll('images[]') as File[]

    let res: any[] = []
    for (let file of files) {
      const extension = path.extname(file.name)

      if (Object.keys(compress).findIndex(v => `.${v}` == extension) < 0) {
        let name = v4() + extension
        let fileUrl = `./storage/${tableName}/${name}`

        const fileBuffer = Buffer.from(await file.arrayBuffer())

        const {width, height} = imageSize(fileBuffer)

        await fsPromise.writeFile(fileUrl, fileBuffer)

        res.push({
          name: file.name,
          naturalWidth: width,
          naturalHeight: height,
          size: file.size,
          type: file.type,
          url: fileUrl.slice(1)
        })
      }
      else {
        let fileData = sharp(await file.arrayBuffer(), { animated: true })
        
        let metadata = await fileData.metadata()
        
        let name = v4() + "." + metadata.format
        let fileUrl = `./storage/${tableName}/${name}`
    
        if (Object.keys(compress).findIndex(v => v == metadata.format) < 0) {
          throw "Không phải định dạng ảnh"
        }
    
        //@ts-ignore
        let fileSave = await fileData[metadata.format || "png"](compress[metadata.format || "png"]).toFile(fileUrl)
          .then((data: any) => {
            return data
          })
    
        let { format, size, width, height } = fileSave
    
        res.push({
          name: file.name,
          naturalWidth: width,
          naturalHeight: height,
          size: size,
          type: file.type,
          url: fileUrl.slice(1)
        })
      }

    }

    let images: Image[] = await db.$transaction(
      res.map(v => db.image.create({
        data: {
          ...v,
          tableName,
          folderImageId,
          adminId: user.id
        }
      }))
    )

    return {images}
  } catch (error) {
    console.log(error)
    throw (typeof error === "string" && error) ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}