"use server"
import { existsSync, mkdirSync } from "fs"
import sharp from "sharp"
import db from "./prismadb"
import fsPromise from "fs/promises";
import path from 'path'
import { v4 } from 'uuid';
import { equirectangularToFisheye, renderFacePromise } from "./convertCubeMap";
import PQueue from "p-queue";

const facePositions = {
  pz: {x: 1, y: 1, name: 'b'},
  nz: {x: 3, y: 1, name: 'f'},
  px: {x: 2, y: 1, name: 'l'},
  nx: {x: 0, y: 1, name: 'r'},
  py: {x: 1, y: 0, name: 'u'},
  ny: {x: 1, y: 2, name: 'd'}
}

export const addScene = async (data: FormData) => {
  try {
    let name = data.get('name') as string,
      slug = data.get('slug') as string,
      image = data.get('image') as string,
      audio = data.get('audio') as string,
      group = data.get('group') as string,
      description = data.get('description') as string

    const sceneBySlug = await db.scene.findMany({
      where: {
        slug
      }
    })

    const imageUrl = (await db.file.findUnique({
      where: {
        id: image,
        mime: {
          startsWith: 'image'
        }
      }
    }))?.url

    if (sceneBySlug.length > 0 || !imageUrl) {
      throw { errorText: "Slug đã tồn tại"}
    }

    const imageSharp = sharp(`.${imageUrl}`, { limitInputPixels: false })
    
    let { width: w = 0, height: h = 0} = await imageSharp.metadata()

    imageSharp.resize({ width: 8192, height: 4096, fit: 'fill' })
    h = 4096
    w = 8192

    let uuid = v4()

    if (!existsSync(`./storage/tiles/${uuid}`)) {
      mkdirSync(`./storage/tiles/${uuid}`, { recursive: true })
    }

    await splitImage({
      imageSharp,
      width: w,
      height: h,
      numCols: 16,
      numRows: 8,
      outputDirectory: `./storage/tiles/${uuid}`
    })
  
    // save image low
    await imageSharp.clone().resize({ width: 2000 }).jpeg({ quality: 60, force: true, mozjpeg: true }).toFile(`./storage/tiles/${uuid}/low.jpg`)
      .then((data: any) => {
        return data
      })

    // create face front image
    const f = await renderFacePromise({
      data: imageSharp,
      width: w,
      height: h,
      face: 'nz',
      interpolation: "linear"
    })

    await sharp(f).resize({width: 1024}).jpeg({ quality: 60, force: true, mozjpeg: true })
      .toFile(`./storage/tiles/${uuid}/front.jpg`)
      .then((data: any) => {
        return data
      })

    // create fisheye image
    await new Promise(res => res(equirectangularToFisheye(imageSharp.clone(), 512, `./storage/tiles/${uuid}/fisheye.png`)))

    const scene = await db.scene.create({
      data: {
        id: uuid,
        name: name,
        slug: slug,
        faceSize: w,
        initialViewParameters: `{
          "pitch": 0,
          "yaw": 0,
          "zoom": 50
        }`,
        url: `/storage/tiles/${uuid}`,
        levels: `[]`,
        description: description,
        audioId: audio,
        groupId: group != "null" ? group : null
      }
    })

    return { success: true, scene }
  }
  catch(error) {
    console.log({error})
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

const deleteScene = async (data: FormData) => {
  try {
    let id = data.get('id') as string

    const deleteInfoHotspots = db.infoHotspot.deleteMany({
      where: {
        sceneId: id
      }
    })

    const deleteLinkHotspots = db.linkHotspot.deleteMany({
      where: {
        sceneId: id
      }
    })

    const deletescene = db.scene.delete({
      where: {
        id: id
      }
    })

    const transaction = await db.$transaction([deleteInfoHotspots, deleteLinkHotspots, deletescene])

    // await rmSync(`./storage/tiles/${id}`, { recursive: true })
    await fsPromise.rm(`./storage/tiles/${id}`, { recursive: true })

    return { success: true }
  } 
  catch (error) {
    console.log({error})
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

const updateScene = async (data: FormData) => {
  try {
    let name = data.get('name') as string,
      slug = data.get('slug') as string,
      audio = data.get('audio') as File,
      oldAduio = data.get('oldAduio') as string,
      id = data.get('id') as string,
      groupId = data.get('groupId') as string,
      description = data.get('description') as string

    // save audio file
    let audioUrl = null
    if (audio && audio.size > 0) {
      let typeAduio = path.extname(audio.name)
      await fsPromise.writeFile(`./storage/tiles/${id}/audio.${typeAduio}`, audio.stream() as any)
      audioUrl = `./storage/tiles/${id}/audio.${typeAduio}`
    }
    
    let dataUpdate: any = {
      name: name,
      description: description,
      slug: slug,
      groupId: groupId != "null" ? groupId : null
    }

    if (!oldAduio) {
      dataUpdate = {...dataUpdate, audio: audioUrl}
    }

    const scene = await db.scene.update({
      where: {
        id: id,
      },
      data: dataUpdate
    })

    return { success: true, scene }
  }
  catch(error) {
    console.log({error})
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

const updateInitialViewParametersScene = async (data: FormData) => {
  try {
    let initialViewParameters = data.get('initialViewParameters') as string,
      id = data.get('id') as string

    const scene = await db.scene.update({
      where: {
        id: id,
      },
      data: {
        initialViewParameters: initialViewParameters
      }
    })

    return { success: true, scene }
  }
  catch(error) {
    console.log({error})
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

const sortScene = async (data: FormData) => {
  try {
    let list = JSON.parse(data.get('list') as string) as string[]

    let scenesUpdate = list.map((v,i) => {
      return db.scene.update({
        where: {
          id: v
        },
        data: {
          sort: i
        }
      })
    })

    const transaction = await db.$transaction(scenesUpdate)

    return { success: true }
  } 
  catch(error) {
    console.log({error})
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

const createHotspot = async (data: FormData) => {
  try {
    let sceneId = data.get('sceneId') as string,
        target = data.get('target') as string,
        yaw = data.get('yaw') as string,
        pitch = data.get('pitch') as string,
        direction = data.get('direction') as string,
        hotspotType = data.get('hotspotType') as string,
        type = data.get('type') as string,
        video = data.get('video') as string,
        title = data.get('title') as string,
        description = data.get('description') as string

    if (hotspotType == "link") {
      const linkHotspot = await db.linkHotspot.create({
        data: {
          sceneId: sceneId,
          yaw: +yaw,
          pitch: +pitch,
          direction: direction,
          target: target,
          type: type
        }
      })
    }
    else if (hotspotType == "info") {

      let imageUrl: sharp.OutputInfo | null = null
      let videoUrl: string | null = null
      let uuid = v4()

      const infoHotspot = await db.infoHotspot.create({
        data: {
          sceneId: sceneId,
          yaw: +yaw,
          pitch: +pitch,
          direction: direction,
          type: type,
          title: title,
          description: description,
          // image: imageUrl ? `/storage/info-hotspots/${uuid}.${imageUrl.format}` : null,
          video: video
        }
      })
    }
    else throw ""
    return { success: true }
  } 
  catch(error) {
    console.log({error})
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

const deleteHotspot = async (data: FormData) => {
  try {
    let id = data.get('id') as string,
        type = data.get('type') as string

    if (type == "link") {
      const linkHotspot = await db.linkHotspot.delete({
        where: {
          id: id
        }
      })
    }
    else if (type == "info") {
      const infoHotspot = await db.infoHotspot.delete({
        where: {
          id: id
        }
      })
    } else {
      throw ""
    }

    return { success: true }
  } 
  catch(error) {
    console.log({error})
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

const editHotspot = async (data: FormData) => {
  try {
    let id = data.get('id') as string,
        target = data.get('target') as string,
        direction = data.get('direction') as string,
        hotspotType = data.get('hotspotType') as string,
        type = data.get('type') as string,
        image = data.get('image') as File | null | undefined,
        video = data.get('video') as string,
        title = data.get('title') as string,
        description = data.get('description') as string

    if (hotspotType == "link") {
      const linkHotspot = await db.linkHotspot.update({
        where: {
          id: id
        },
        data: {
          direction: direction,
          target: target,
          type: type
        }
      })
    }
    else if (hotspotType == "info") {

      let imageUrl: sharp.OutputInfo | null = null
      let uuid = v4()
      if (image && image?.size > 0) {

        if (!existsSync(`./storage/info-hotspots`)) {
          mkdirSync(`./storage/info-hotspots`, { recursive: true })
        }

        let imageFile = sharp(await image.arrayBuffer())
        let { format } = await imageFile.metadata()
        
        imageUrl = await imageFile
          .toFile(`./storage/info-hotspots/${uuid}.${format}`)
          .then((data) => {
            return data
          })
      }

      const infoHotspot = await db.infoHotspot.update({
        where: {
          id: id,
        },
        data: {
          direction: direction,
          type: type,
          title: title,
          description: description,
          image: imageUrl ? `/storage/info-hotspots/${uuid}.${imageUrl.format}` : null,
          video: video
        }
      })
    }
    else throw ""
    return { success: true }
  } 
  catch(error) {
    console.log({error})
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}

async function splitImage({
  imageSharp, numRows, numCols, outputDirectory, width, height
}:{
  imageSharp: sharp.Sharp, numRows: number, numCols: number, outputDirectory: string,
  width: number, height: number
}) {
  const queue = new PQueue({ concurrency: 4 })

  const chunkWidth = Math.floor(width / numCols);
  const chunkHeight = Math.floor(height / numRows);

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const x = col * chunkWidth;
      const y = row * chunkHeight;
      const outputImagePath = `${outputDirectory}/${row}_${col}.jpg`;

      queue.add(async () => {
        await imageSharp.clone()
          .extract({ left: x, top: y, width: chunkWidth, height: chunkHeight })
          .jpeg({ quality: 80, force: true, mozjpeg: true })
          .toFile(outputImagePath);
      });
    }
  }

  await queue.onIdle(); // Đảm bảo tất cả công việc đã hoàn thành
  console.log('Cắt ảnh thành công.');
}

const slipImageFace = async (
  file: Buffer, faceName: string, name: string, zoom: number, uuid: string,
  maxZoom: number
  ) => {
  const image = sharp(file)

  if (["d", "u"].findIndex(v => v == faceName) >= 0) {
    image.rotate(180)
  }

  let metadata = await image.metadata()
  let [width, height] = [Math.floor(metadata.width || 0), Math.floor(metadata.height || 0)]

  if (zoom < maxZoom) {
    image.resize(Math.floor(width/Math.pow(2,maxZoom - zoom)), Math.floor(height/Math.pow(2,maxZoom - zoom)))
  }

  let length = Math.pow(2,(zoom - 1)) 

  let distance = Math.floor(width / length)

  if (zoom < maxZoom) {
    distance = Math.floor((width/Math.pow(2,maxZoom - zoom)) / length)
  }

  for(let i = 0; i < length; i++) {
    for(let j = 0; j < length; j++) {

      if (!existsSync(`./storage/tiles/${uuid}/${zoom}/${faceName}/${i}`)) {
        mkdirSync(`./storage/tiles/${uuid}/${zoom}/${faceName}/${i}`, { recursive: true })
      }
      
      let temp = image.clone()

      await temp.extract({left: j * distance, top: i * distance, width: distance, height: distance })
        .jpeg({ quality: 80, force: true, mozjpeg: true })
        .toFile(`./storage/tiles/${uuid}/${zoom}/${faceName}/${i}/${j}.jpg`)
        .then((data: any) => {
          return data
        })
    }
  }
}

const mergeImagePreview = async(
  b: Buffer, d: Buffer, f: Buffer, l: Buffer, r: Buffer, u: Buffer, 
  name: string, uuid: string, maxZoom: number
) => {
  const imageB = sharp(b)
  const imageD = sharp(d)
  const imageF = sharp(f)
  const imageL = sharp(l)
  const imageR = sharp(r)
  const imageU = sharp(u)

  let metadata = await imageB.metadata()

  let width = Math.round(metadata.width || 0)

  let imagePreview = imageB.clone()
  imagePreview.resize(width, width*6)

  // let imagePreview = sharp({
  //   create: {
  //     width: width,
  //     height: width * 6,
  //     channels: 4,
  //     background: { r: 255, g: 255, b: 255, alpha: 1 }
  //   }
  // })

  let imagePreviewBuffer = await imagePreview.composite([
    { input: await imageB.toBuffer(), left: 0, top: 0 },
    { input: await imageD.rotate(180).toBuffer(), left: 0, top: width },
    { input: await imageF.toBuffer(), left: 0, top: width * 2 },
    { input: await imageL.toBuffer(), left: 0, top: width * 3 },
    { input: await imageR.toBuffer(), left: 0, top: width * 4 },
    { input: await imageU.rotate(180).toBuffer(), left: 0, top: width * 5 },

  ]).toBuffer()

  let imagePreviewSave = sharp(imagePreviewBuffer).resize(Math.round(width/Math.pow(2, maxZoom)), Math.round(width*6 / Math.pow(2, maxZoom)))

  if (!existsSync(`./storage/tiles/${uuid}`)) {
    mkdirSync(`./storage/tiles/${uuid}`, { recursive: true })
  }

  await imagePreviewSave.jpeg({ quality: 80, force: true, mozjpeg: true }).toFile(`./storage/tiles/${uuid}/preview.jpg`)
    .then((data: any) => {
      return data
    })
}

const saveImageMobile = async(
  b: Buffer, d: Buffer, f: Buffer, l: Buffer, r: Buffer, u: Buffer, 
  uuid: string
) => {
  const imageB = sharp(b)
  const imageD = sharp(d)
  const imageF = sharp(f)
  const imageL = sharp(l)
  const imageR = sharp(r)
  const imageU = sharp(u)

  let metadata = await imageB.metadata()

  let width = Math.round(metadata.width || 0)

  if (!existsSync(`./storage/tiles/${uuid}/mobile`)) {
    mkdirSync(`./storage/tiles/${uuid}/mobile`, { recursive: true })
  }

  let w = Math.round(width / 2)

  await Promise.all([
    imageB.resize(w, w).jpeg({ quality: 80, force: true, mozjpeg: true }).toFile(`./storage/tiles/${uuid}/mobile/b.jpg`).then((data: any) => { return data }),
    imageD.rotate(180).resize(w, w).jpeg({ quality: 80, force: true, mozjpeg: true }).toFile(`./storage/tiles/${uuid}/mobile/d.jpg`).then((data: any) => { return data }),
    imageF.resize(w, w).jpeg({ quality: 80, force: true, mozjpeg: true }).toFile(`./storage/tiles/${uuid}/mobile/f.jpg`).then((data: any) => { return data }),
    imageL.resize(w, w).jpeg({ quality: 80, force: true, mozjpeg: true }).toFile(`./storage/tiles/${uuid}/mobile/l.jpg`).then((data: any) => { return data }),
    imageR.resize(w, w).jpeg({ quality: 80, force: true, mozjpeg: true }).toFile(`./storage/tiles/${uuid}/mobile/r.jpg`).then((data: any) => { return data }),
    imageU.rotate(180).resize(w, w).jpeg({ quality: 80, force: true, mozjpeg: true }).toFile(`./storage/tiles/${uuid}/mobile/u.jpg`).then((data: any) => { return data }),
  ])
}