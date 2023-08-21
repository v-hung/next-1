"use client"
import { useState } from 'react'
import ListScene from '../scenes/ListScene'
import SceneAddModal from '../scenes/SceneAddModal'
import AdminSceneControl from '../scenes/SceneControl'
import AdminSceneScreen from '../scenes/SceneScreen'
import { SceneDataState } from '@/app/admin/(admin)/scenes/page'
import { GroupScene, Scene } from '@prisma/client'

const SceneContentAdmin = ({
  scenes
}: {
  scenes: SceneDataState[]
}) => {

  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [sceneId, setSceneId] = useState(scenes[0]?.id)
  const [sceneEdit, setSceneEdit] = useState<SceneDataState>()

  const handelOpenModalAddScene = (data?: SceneDataState) => {
    setSceneEdit(data)
    setOpenModalAdd(true)
  }

  return (
    <div className='-mx-8 -my-4' style={{height: 'calc(100vh - 64px)'}}>
      <div className="w-full h-full flex">
        <div className="flex-none w-80 h-full bg-white">
          <ListScene scenes={scenes} setOpenModalAdd={handelOpenModalAddScene} sceneId={sceneId} setSceneId={setSceneId} />
        </div>
        <div className="flex-grow min-w-0 h-full relative">
          <AdminSceneScreen scenes={scenes} sceneId={sceneId} setSceneId={setSceneId} />
          <AdminSceneControl scenes={scenes} setOpenModalAdd={handelOpenModalAddScene} sceneId={sceneId} />
        </div>
      </div>

      <SceneAddModal scene={sceneEdit} open={openModalAdd} setOpen={setOpenModalAdd} />
    </div>
  )
}

export default SceneContentAdmin