import SceneContentAdmin from '@/components/admin/content/SceneContentAdmin'
import db from '@/lib/admin/prismadb'
import { File, GroupScene, InfoHotspot, LinkHotspot, Scene } from '@prisma/client'
import React from 'react'

export type LevelsState = {
  tileSize: number,
  size: number,
  fallbackOnly?: boolean
}[]

export type InitialViewParametersState = {
  pitch: number,
  yaw: number,
  zoom: number
}

export type SceneDataState =  (Omit<Scene, 'levels' | 'initialViewParameters'> & {
  levels: LevelsState;
  initialViewParameters: InitialViewParametersState;
  infoHotspots: InfoHotspot[];
  linkHotspots: LinkHotspot[];
  audio: File | null,
  group: GroupScene | null
})

const getData = async () => {
  const scenes = await db.scene.findMany({
    include: {
      infoHotspots: true,
      linkHotspots: true,
      audio: true,
      group: true
    },
    orderBy: {
      sort: 'asc'
    }
  })

  let scenesData: SceneDataState[] = scenes.map(v => {
    return {
      ...v,
      levels: JSON.parse(v.levels) as LevelsState,
      initialViewParameters: JSON.parse(v.initialViewParameters) as InitialViewParametersState,
    }
  })

  return { scenes: scenesData }
}

const page = async () => {

  const { scenes } = await getData()

  return (
    <SceneContentAdmin scenes={scenes} />
  )
}

export default page