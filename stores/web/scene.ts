import { SceneDataState } from "@/app/admin/(admin)/scenes/page"
import { Viewer } from "@photo-sphere-viewer/core"
import { GroupScene } from "@prisma/client"
import { create } from "zustand"

type State = {
  start: boolean,
  viewer?: Viewer,
  scenes: SceneDataState[],
  groups: GroupScene[]
  videoShow?: string,
  showListScene: boolean,
  allowedPlayAudio: boolean,
}

type Actions = {
  setStart: (data: boolean) => void
  setViewer: (data: Viewer) => void,
  setScenes:( data: SceneDataState[]) => void,
  setGroups:( data: GroupScene[]) => void,
  setVideoShow: (data: string | undefined) => void
  setShowListScene: (data?: boolean) => void,
  setAllowedPlayAudio: (data: boolean) => void
}

const useScene = create<State & Actions>((set, get) => ({
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
  }),

  groups: [],
  setGroups: (data) => set({
    groups: data
  }),

  showListScene: true,
  setShowListScene: (data) => ({
    showListScene: data ? data : !get().showListScene
  }),

  allowedPlayAudio: false,
  setAllowedPlayAudio: (data) => ({
    allowedPlayAudio: data
  }),
})
)

export default useScene