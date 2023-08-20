import { Divider } from '@mui/material'
import { Button, Menu, MenuItem } from '@mui/material'
import React from 'react'

const AdminSceneControl = () => {
  // list hotspot in scene
  const [anchorElHotspot, setAnchorElHotspot] = React.useState<null | HTMLElement>(null)
  const openHotspot = Boolean(anchorElHotspot)
  const handleShowHotspots = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElHotspot(event.currentTarget);
  }
  const handleCloseHotspot = () => {
    setAnchorElHotspot(null)
  }

  return (
    <>
      <div className="absolute top-0 right-0 p-4">
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
          <span className="icon w-10 h-10 p-2 bg-sky-600 cursor-pointer">
            <span className="material-symbols-outlined">edit</span>
          </span> 
          <span className="icon w-10 h-10 p-2 bg-red-600 cursor-pointer">
            <span className="material-symbols-outlined">delete</span>
          </span>
        </div> 
        <div className="text-center p-2">Toàn cảnh Bắc Hà</div> 
          <div className="absolute right-0 top-0 flex-none flex divide-x divide-transparent">
            <form method="post">
              <button type="submit" className="icon w-10 h-10 p-2 bg-blue-500 hover:bg-blue-400 cursor-pointer">
                <span className="material-symbols-outlined">save</span>
              </button>
            </form> 
        </div>
      </div>
    </>
  )
}

export default AdminSceneControl