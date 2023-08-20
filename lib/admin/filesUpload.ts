"use server"

import { FolderFile, File as FileDB } from "@prisma/client"
import { useCurrentUserAdmin } from "./helperServer"
import db from "./prismadb"
import { existsSync, mkdirSync } from "fs"
import fsPromise from "fs/promises"
import sharp from "sharp"
import { v4 } from "uuid"
import path from "path"
import { imageSize } from "image-size";
import mime from "mime-types";
import { FileTypeState } from "./sample"

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

const mapFolderRecursiveToArray = (folderParent: any | null, arr: FolderFile[]) => {
  if (folderParent && folderParent.parent) {
    arr.push({...folderParent.parent, parent: undefined})
    mapFolderRecursiveToArray(folderParent.parent, arr)
  }
}

export const getListFolderFile = async ({
  tableName, parentId, myself, fileTypes = ['image']
}: {tableName?: string, parentId?: string, myself?: boolean, fileTypes?: FileTypeState}) => {
  try {
    const user = await useCurrentUserAdmin()

    if (!user) throw "Authorization"

    let queryFile = fileTypes.includes('all') ? {
      mime: undefined
    } : {
      OR: fileTypes.map(v => ({
        mime: {
         startsWith: v
        } 
       }))
    }

    const [folderParent, folders, files] = await db.$transaction([
      db.folderFile.findUnique({
        where: {
          id: parentId || ''
        },
        include: getParentString(4).include
      }),
      db.folderFile.findMany({
        where: {
          tableName,
          parentId: parentId ? parentId : null,
          adminId: myself ? user.id : undefined
        },
      }),
      db.file.findMany({
        where: {
          tableName,
          folderFileId: parentId ? parentId : null,
          adminId: myself ? user.id : undefined,
          ...queryFile
        },
      }),
    ])

    let folderParents: any[] = []
    mapFolderRecursiveToArray({parent: folderParent}, folderParents)

    return {folderParents, folders, files}

  } catch (error) {
    console.log(error)
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
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

    const folder = folderId ? await db.folderFile.update({
      where: {
        id: folderId
      },
      data: dataCreate
    })
    : await db.folderFile.create({
      data: dataCreate
    })

    return {folder}

  } catch (error) {
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

type UploadFilesType = {
  formData: FormData,
  tableName: string, 
  folderFileId?: string | null,
  fileTypes?: FileTypeState
} 

export const uploadFiles = async ({
  formData, tableName, folderFileId, fileTypes = ['image']
}: UploadFilesType) => {
  try {
    const user = await useCurrentUserAdmin()

    if (!user) throw "Unauthorized"
        
    if (!existsSync(`./storage/${tableName}`)){
      mkdirSync(`./storage/${tableName}`, { recursive: true });
    }

    const sharpCompress = {
      'png': {compressionLevel: 8, quality: 60},
      'jpeg': { quality: 60 },
      'webp': { quality: 60 },
      'gif': {},
      'jp2': {},
      'tiff': {},
      'avif': {},
      'heif': {},
      'jxl': {}
    }

    const files = formData.getAll('files[]') as File[]

    let res: any[] = []
    for (let file of files) {
      // check file
      const extension = path.extname(file.name)
      const mimeName = mime.lookup(extension)

      console.log({mimeName}, isFileTypeAllowed(file.type))

      if (!isFileTypeAllowed(file.type) || !mimeName) {
        throw "Tập tin không hợp lệ"
      }

      let checkMimeType = false

      if (fileTypes.includes('all')) {
        checkMimeType = true
      }
      else {
        checkMimeType = fileTypes.some(v => mimeName.startsWith(v))
      }

      if (!checkMimeType) throw "Bạn không được tải lên tệp tin này"

      // upload image
      if (mimeName.startsWith('image/')) {
        if (Object.keys(sharpCompress).findIndex(v => `.${v}` == extension) < 0) {
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
            mime: mimeName,
            url: fileUrl.slice(1)
          })
        }
        else {
          let fileData = sharp(await file.arrayBuffer(), { animated: true })
          
          let metadata = await fileData.metadata()
          
          let name = v4() + "." + metadata.format
          let fileUrl = `./storage/${tableName}/${name}`
      
          //@ts-ignore
          let fileSave = await fileData[metadata.format || "png"](sharpCompress[metadata.format || "png"]).toFile(fileUrl)
            .then((data: any) => {
              return data
            })
      
          let { format, size, width, height } = fileSave
      
          res.push({
            name: file.name,
            naturalWidth: width,
            naturalHeight: height,
            size: size,
            mime: mimeName,
            url: fileUrl.slice(1)
          })
        }
      }
      // upload file
      else {
        let name = v4() + extension
        let fileUrl = `./storage/${tableName}/${name}`

        const fileBuffer = Buffer.from(await file.arrayBuffer())

        await fsPromise.writeFile(fileUrl, fileBuffer)

        res.push({
          name: file.name,
          size: file.size,
          mime: mimeName,
          url: fileUrl.slice(1)
        })
      }
    }

    let filesData: FileDB[] = await db.$transaction(
      res.map(v => db.file.create({
        data: {
          ...v,
          tableName,
          folderFileId,
          adminId: user.id
        }
      }))
    )

    return { files: filesData }
  } catch (error) {
    console.log(error)
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

const dangerousFileTypes = [
  'application/x-msdownload',
  'application/x-dosexec',
  'application/x-executable',
  'application/x-mach-binary',
  'application/x-sh',
  'application/x-shellscript',
  'application/javascript',
  'application/x-javascript',
  'application/x-msdownload',
  'application/x-dosexec',
  'application/x-shockwave-flash',
  'application/javascript',
  'application/x-javascript',
  'text/javascript',
  'text/x-javascript',
  'text/html',
  'text/x-php',
  'application/x-msi',
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/x-gtar',
  'application/x-msdownload',
  'application/x-dosexec',
  'application/x-shockwave-flash',
]

function isFileTypeAllowed(type: string) {
  return !dangerousFileTypes.includes(type.toLowerCase());
}