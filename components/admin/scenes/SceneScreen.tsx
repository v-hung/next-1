"use client"
import { MouseEvent, useState } from 'react'
import HotspotAddModal from './HotspotAddModal'

const AdminSceneScreen = () => {
  const [openHotspotModal, setOpenHotspotModal] = useState(false)

  const getPitchYaw = (e: MouseEvent<HTMLDivElement>) => {
    // if (!viewer) return

    // var rect = (e.target as HTMLElement).getBoundingClientRect()
    // let coordinates = (viewer.view() as any).screenToCoordinates({x : e.clientX - rect.left, y: e.clientY - rect.top})

    // coordinatesAdd = {
    //   yaw: coordinates.yaw,
    //   pitch: coordinates.pitch
    // }

    setOpenHotspotModal(true)
  }

  return (
    <>
      <div className='w-full h-full' onDoubleClick={getPitchYaw}>
        HotspotAddModal
      </div>
      <HotspotAddModal open={openHotspotModal} setOpen={setOpenHotspotModal} />
    </>
  )
}

export default AdminSceneScreen