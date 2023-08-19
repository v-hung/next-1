"use client"
import { useState } from 'react'
import ListScene from '../scenes/ListScene'
import SceneAddModal from '../scenes/SceneAddModal'

const SceneContentAdmin = () => {

  const [openModalAdd, setOpenModalAdd] = useState(true)

  return (
    <div className='-mx-8 -my-4' style={{height: 'calc(100vh - 64px)'}}>
      <div className="w-full h-full flex">
        <div className="flex-none w-80 h-full bg-white">
          <ListScene scenes={[]} />
        </div>
        <div className="flex-grow min-w-0 h-full">
        </div>
      </div>

      <SceneAddModal open={openModalAdd} setOpen={setOpenModalAdd}/>
    </div>
  )
}

export default SceneContentAdmin