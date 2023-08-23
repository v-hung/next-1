import db from "@/lib/admin/prismadb"
import { InitialViewParametersState, LevelsState, SceneDataState } from "../admin/(admin)/scenes/layout"
import SceneContent from "@/components/web/content/SceneContent"

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
  groups.forEach(v => {
    scenesGroup.push(...scenesData.filter(v2 => v2.groupId == v.id))
  })

  return { scenes: scenesGroup, groups }
}

const layout = async () => {

  const {scenes, groups} = await getData()

  return (
    <SceneContent defaultScenes={scenes} defaultGroups={groups} />
  )
}

export default layout