import { SceneDataState } from "@/app/admin/(admin)/scenes/page"
import { Viewer } from "@photo-sphere-viewer/core"
import { create } from "zustand"

type State = {
  start: boolean,
  viewer?: Viewer,
  scenes: SceneDataState[],
  videoShow?: string
}

type Actions = {
  setStart: (data: boolean) => void
  setViewer: (data: Viewer) => void,
  setScenes:( data: SceneDataState[]) => void,
  setVideoShow: (data: string | undefined) => void
}

const useScene = create<State & Actions>(set => ({
  start: false,
  setStart: (data) => set({
    start: data
  }),

  videoShow: undefined,
  setVideoShow: (data) => set({
    videoShow: data
  }),

  viewer: undefined,
  setViewer: (data) => set({
    viewer: data
  }),
  
  scenes: [],
  setScenes: (data) => set({
    scenes: data
  })
})
)

export default useScene