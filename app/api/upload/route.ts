import db from "@/lib/prismadb";
import { existsSync, mkdirSync } from "fs";
import * as fs from 'fs/promises';
import { read } from "jimp";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.formData()
  const file = data.get('image') as File
  let name = crypto.randomUUID() + "." + file.name.split('.')[1]
      
  if (!existsSync('./storage')){
    mkdirSync('./storage', { recursive: true });
  }

  let fileData = await read(Buffer.from(await file.arrayBuffer()))

  let type = file.name.split('.')[1]

  let fileUrl = `./storage/images/${name}.${type}`

  await fileData.writeAsync(fileUrl)

  let img = await db.image.create({
    data: {
      name: file.name,
      naturalWidth: fileData.bitmap.width,
      naturalHeight: fileData.bitmap.height,
      size: file.size,
      type: file.type,
      url: fileUrl
    }
  })

  return NextResponse.json({img})
}
