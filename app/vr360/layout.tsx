import db from "@/lib/admin/prismadb"
import SceneContent from "@/components/web/content/SceneContent"
import { ReactNode } from "react"
import { InitialViewParametersState, LevelsState, SceneDataState } from "../admin/(admin)/scenes/page"

const getData = async () => {
  const [scenes, groups] = await Promise.all([
    db.scene.findMany({
      where: {
        publish: 'publish',
        groupId: {
          not: null
        }
      },
      include: {
        infoHotspots: true,
        linkHotspots: true,
        audio: true,
        group: true
      },
      orderBy: {
        sort: 'asc'
      }
    }),
    db.groupScene.findMany({
      where: {
        publish: 'publish'
      },
      orderBy: {
        sort: 'asc'
      }
    })
  ])

  let scenesData: SceneDataState[] = scenes.map(v => {
    return {
      ...v,
      levels: JSON.parse(v.levels) as LevelsState,
      initialViewParameters: JSON.parse(v.initialViewParameters) as InitialViewParametersState,
    }
  })

  let scenesGroup: SceneDataState[] = []
  let groupsData = groups.filter(v => {
    let scenesInGroup = scenesData.filter(v2 => v2.groupId == v.id)

    if (scenesInGroup.length > 0) {
      scenesGroup.push(...scenesData.filter(v2 => v2.groupId == v.id))
      return true
    }
    else {
      return false
    }
  })

  return { scenes: scenesGroup, groups: groupsData }
}

const layout = async ({children}: {children: ReactNode}) => {

  const {scenes, groups} = await getData()

  return (
    <SceneContent defaultScenes={scenes} defaultGroups={groups} children={children} />
  )
}

export default layout