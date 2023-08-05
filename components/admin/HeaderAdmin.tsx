"use client"
import React, { useState } from 'react'
import useAdminMenu from 'stores/admin/adminMenu';
import useAdminUser from '@/stores/admin/adminUser';
import Link from 'next/link';
import Collapse from '../Collapse';
import { useStoreCustom } from '@/stores';
import { Avatar, Divider, Menu, MenuItem } from '@mui/material';

const HeaderAdmin = () => {
  const adminUser = useAdminUser()
  // const adminMenu = useAdminMenu()
  const adminMenu = useStoreCustom(useAdminMenu, (state) => state)

  return (
    <div className='sticky top-0 w-full h-16 bg-white border-b z-50'>
      <div className="w-full h-full px-4 flex items-center space-x-4">
        <button 
          className="w-10 h-10 p-2 rounded-full bg-white hover:bg-gray-100"
          onClick={() => adminMenu?.toggle()}
        >
          <span className="material-symbols-outlined">
            menu
          </span>
        </button>

        <span className='rounded-full bg-gray-100 px-4 py-2'>Bảng điều khiển</span>

        <div className="!ml-auto"></div>
        <button className="relative w-10 h-10 p-2 rounded-full hover:bg-gray-100">
          <span className="material-symbols-outlined">
            notifications
          </span>
          <div className="absolute w-2 h-2 rounded-full bg-orange-600 top-2 right-3"></div>
        </button>

        { adminUser.user != null
          ? <AvatarUser user={adminUser.user} />
          : null
        }
      </div>
    </div>
  )
}

const AvatarUser = ({user}: any) => {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  }
  
  return (
    <div>
      <div 
        className="flex items-center space-x-2 rounded-full p-1 pr-2 bg-gray-100 hover:bg-blue-200 cursor-pointer select-none"
        onClick={handleClick}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={user.image || '/storage/images/user/b1.png'} alt={user.name} className="w-full h-full object-contain" />
        </div>
        <div className='font-semibold'>{user.name}</div>
        <span className="material-symbols-outlined icon-fill">
          arrow_drop_down
        </span>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Trang cá nhân
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <span className="material-symbols-outlined icon-fill text-red-600">
            logout
          </span>
          <span className="text-red-600">Logout</span>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default HeaderAdmin