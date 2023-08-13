import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/server/prismadb";
import { existsSync, mkdirSync } from "fs";
import sharp from "sharp";
import { v4 } from "uuid";
// import imagemin from "imagemin"
// import imageminPngQuant from "imagemin-pngquant"
// import imageminJpegtran from "imagemin-jpegtran"
import { useCurrentUserAdmin } from '@/lib/server/helperServer';
import { Image } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const user = await useCurrentUserAdmin(request)

    if (!user) return NextResponse.json("Unauthorized", {status: 401})

    // const formData = await request.formData()
    // const tableName = formData.get('tableName') as string | undefined,
    //   adminId = formData.get('adminId') as string

    const images = await db.image.findMany({
      where: {

      },
      orderBy: { createdAt : 'desc' }
    })

    return NextResponse.json({data: images});
  }
  catch (e) {
    console.log(e)
    return NextResponse.json("Error", {status: 400})
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await useCurrentUserAdmin(request)

    if (!user) return NextResponse.json("Unauthorized", {status: 401})

    const data = await request.formData()
    const files = data.getAll('images[]') as File[],
      tableName = data.get('tableName') as string,
      folderImageId = data.get('folderImageId') as string | undefined,
      adminId = data.get('adminId') as string
        
    if (!existsSync('./storage')){
      mkdirSync('./storage', { recursive: true });
    }

    const compress = {
      'png': {compressionLevel: 8, quality: 60},
      'jpeg': { quality: 60 },
      'webp': { quality: 60 },
      'gif': { }
    }

    let res: any[] = []
    for (let file of files) {
      
      let fileData = sharp(await file.arrayBuffer(), { animated: true })
      
      let metadata = await fileData.metadata()
      
      let name = v4() + "." + metadata.format
      let fileUrl = `./storage/images/${name}`

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

    return NextResponse.json({images})
  } catch (e) {
    console.log(e)
    return NextResponse.json("Error", {status: 400})
  }
} 