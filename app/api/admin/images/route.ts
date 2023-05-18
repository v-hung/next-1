import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/server/prismadb";
import { existsSync, mkdirSync } from "fs";
import sharp from "sharp";
import { v4 } from "uuid";
// import imagemin from "imagemin"
// import imageminPngQuant from "imagemin-pngquant"
// import imageminJpegtran from "imagemin-jpegtran"
import { useCurrentUserAdmin } from '@/lib/server/helperServer';

export async function GET(request: NextRequest) {
  try {
    const user = await useCurrentUserAdmin(request)

    if (!user) return NextResponse.json("Unauthorized", {status: 401})

    const images = await db.image.findMany({
      orderBy: { id : 'desc' }
    })

    return NextResponse.json({data: images});
  }
  catch (e) {
    console.log(e)
    return NextResponse.json("Error", {status: 400})
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const files = data.getAll('images[]') as File[]
        
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
      
      // const fileMin = await imagemin.buffer(Buffer.from(await file.arrayBuffer()), {
      //   // destination: "compressed-images",
      //   plugins: [
      //     imageminJpegtran(),
      //     imageminPngQuant({
      //       quality: [0.2, 0.5]
      //     })
      //   ]
      // })

      // let fileData = sharp(fileMin)
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
          console.log(data)
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

    // // not support in sqlite
    // let images = await db.image.create({
    //   data: res
    // })


    let images: any[] = []
    for(let img of res) {
      let temp = await db.image.create({
        data: img
      })
      images.push(temp)
    }

    return NextResponse.json({images})
  } catch (e) {
    console.log(e)
    return NextResponse.json("Error", {status: 400})
  }
} 