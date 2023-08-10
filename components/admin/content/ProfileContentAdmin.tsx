"use client"

import useAdminUser from '@/stores/admin/adminUser'
import Button from '@mui/material/Button';
import React from 'react'
import AdminFormFieldText from '../form-field/AdminFormFieldText';
import { TextField } from '@mui/material';
import AdminFormFieldImage from '../form-field/AdminFormFieldImage';

const ProfileContentAdmin = () => {
  const adminUser = useAdminUser(state => state.user)

  if (adminUser == null) return null

  return (
    <div className='-mx-8 -my-4 bg-white' style={{minHeight: 'calc(100vh - 64px)'}}>
      <div className="w-full h-36 bg-gray-200 relative bg-[url('/bg-profile.png')] overflow-hidden"></div>
      <div className="px-8">
        <div className="-translate-y-8 flex items-center space-x-4">
          <div className="w-28 h-28 rounded-full border-4 border-white bg-blue-500 overflow-hidden">
            <img src={adminUser.image || ''} alt="" className='w-full h-full object-contain' />
          </div>
          <div className="flex flex-col pt-6">
            <h3 className="text-2xl font-semibold">{adminUser.name}</h3>
            <h5 className="text-gray-600">{adminUser.email}</h5>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-y-6">
          <div className='col-span-2 flex justify-between items-center border-b pb-6'>
            <div>
              <div className="text-lg font-semibold">Hồ sơ cá nhân</div>
              <p className='text-gray-600'>Cập nhập ảnh và thông tin cá nhân của bạn ở đây</p>
            </div>
            <div className='flex space-x-4'>
              <Button variant='contained' color='inherit'>Hủy bỏ</Button>
              <Button variant='contained'>Lưu thay đổi</Button>
            </div>
          </div>

          <div className='border-b pb-6 pr-8'>
            <div className="font-semibold">Thông tin công khai</div>
            <p className='text-gray-600'>Mọi người có thể thấy được thông tin này</p>
          </div>
          <div className='flex flex-col space-y-4 border-b pb-6'>
            <TextField name='name' className='w-96' label="Tên" variant="outlined" size='small' />
            <TextField name='gmail' className='w-96' label="Gmail" variant="outlined" size='small' />
          </div>

          <div className='border-b pb-6 pr-8'>
            <div className="font-semibold">Ảnh cá nhân</div>
            <p className='text-gray-600'>Cập nhập ảnh của bạn bằng cách chọn tùy chọn thêm ảnh bên cạnh</p>
          </div>
          <div className="border-b pb-6 flex space-x-4 items-center">
            <div className="w-24 h-24 rounded-full border-2 border-white bg-blue-500 overflow-hidden shadow">
              <img src={adminUser.image || ''} alt="" className='w-full h-full object-contain' />
            </div>
            <div className='w-96 h-40 border rounded bg-white'>
              <input type="hidden" className='sr-only' />
              <div className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
            
              >
                <span className="icon w-10 h-10 text-orange-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"></path><path d="m8 11-3 4h11l-4-6-3 4z"></path><path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>
                </span>
                <span className="mt-2 text-xs font-semibold">Bấm để thêm một tài sản</span>
              </div>
            </div>
          </div>

          <div className='col-span-2 flex justify-end space-x-4'>
            <Button variant='contained' color='inherit'>Hủy bỏ</Button>
            <Button variant='contained'>Lưu thay đổi</Button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfileContentAdmin