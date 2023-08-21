import { SceneDataState } from '@/app/admin/(admin)/scenes/page'
import { promiseFunction } from '@/lib/admin/promise'
import { deleteScene } from '@/lib/admin/scene'
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material'
import { Button, Menu, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'

const AdminSceneControl = ({
  scenes, sceneId, setOpenModalAdd
}: {
  scenes: SceneDataState[],
  setOpenModalAdd: (data?: SceneDataState) => void,
  sceneId?: string, 
}) => {
  // list hotspot in scene
  const [anchorElHotspot, setAnchorElHotspot] = React.useState<null | HTMLElement>(null)
  const openHotspot = Boolean(anchorElHotspot)
  const handleShowHotspots = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElHotspot(event.currentTarget);
  }
  const handleCloseHotspot = () => {
    setAnchorElHotspot(null)
  }

  const [currentScene, setCurrentScene] = useState<SceneDataState | undefined>(scenes.find(v => v.id == sceneId))

  useEffect(() => {
    setCurrentScene(scenes.find(v => v.id == sceneId))
  })

  // delete
  const [loading, setLoading] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const handelCloseModal = (data: boolean) => {
    if (loading) return
    setOpenDeleteModal(data)
  }

  const handelDeleteScene = async () => {
    if (!currentScene) return
    await promiseFunction({
      loading,
      setLoading,
      callback: async () => {
        await deleteScene({id: currentScene.id})
      }
    })
  }

  return (
    <>
      <div className="absolute top-0 right-0 p-4 z-10">
        <Button variant='contained' onClick={handleShowHotspots}>Danh sách điểm nóng (8)</Button>
        <Menu
          anchorEl={anchorElHotspot}
          open={openHotspot}
          onClose={handleCloseHotspot}
          MenuListProps={{
            sx: { width: '300px' }
          }}
        >
          {new Array(5).fill(0).map((v,i)=>
            <MenuItem key={i} onClick={handleCloseHotspot}>
              <div className="hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left flex items-center text-base font-semibold gap-2 cursor-auto">
                <span className="flex-none icon">my_location</span>
                <span className="flex-grow min-w-0">Sân đua ngựa</span> 
                <span className="flex-none icon p-1 hover:text-sky-600 cursor-pointer">edit</span>
                <span className="flex-none icon p-1 hover:text-red-600 cursor-pointer">delete</span>
              </div>
            </MenuItem>
          )}
          <Divider />
          {new Array(5).fill(0).map((v,i)=>
            <MenuItem key={i} onClick={handleCloseHotspot}>
              <div className="hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left flex items-center text-base font-semibold gap-2 cursor-auto">
                <span className="flex-none icon">info</span>
                <span className="flex-grow min-w-0">Sân đua ngựa</span> 
                <span className="flex-none icon p-1 hover:text-sky-600 cursor-pointer">edit</span>
                <span className="flex-none icon p-1 hover:text-red-600 cursor-pointer">delete</span>
              </div>
            </MenuItem>
          )}
        </Menu>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white select-none z-10">
        <div className="absolute left-0 top-0 flex-none flex divide-x divide-transparent">
          <span className="icon w-10 h-10 p-2 bg-sky-600 cursor-pointer"
            onClick={() => setOpenModalAdd(currentScene)}
          >
            <span className="material-symbols-outlined">edit</span>
          </span> 
          <span className="icon w-10 h-10 p-2 bg-red-600 cursor-pointer"
            onClick={() => setOpenDeleteModal(true)}
          >
            <span className="material-symbols-outlined">delete</span>
          </span>
        </div> 
        <div className="text-center p-2">{currentScene?.name}</div> 
          <div className="absolute right-0 top-0 flex-none flex divide-x divide-transparent">
            <form method="post">
              <button type="submit" className="icon w-10 h-10 p-2 bg-blue-500 hover:bg-blue-400 cursor-pointer">
                <span className="material-symbols-outlined">save</span>
              </button>
            </form> 
        </div>
      </div>

      {/* dialog delete scene */}
      <Dialog
        open={openDeleteModal}
        keepMounted
        onClose={() => handelCloseModal(false)}
      >
        <DialogTitle>Xóa điểm chụp</DialogTitle>
        <DialogContent>
          Bạn có thực sự muốn xóa điểm chụp <span className="text-red-500">{currentScene?.name}</span>?
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={() => handelCloseModal(false)}>Hủy</Button>
          <Button disabled={loading} variant='contained' color='error' onClick={handelDeleteScene} startIcon={loading ? (
            <span className='icon animate-spin'>progress_activity</span>
          ) : null} >Tiếp tục</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AdminSceneControl