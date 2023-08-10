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
          <div className="w-28 h-28 rounded-full border-4 border-white bg-blue-500 overflow-hidden grid place-items-center">
            { adminUser.image
              ? <img src={adminUser.image.url} alt="" className='w-full h-full object-cover' loading='lazy' />
              : <span className="material-symbols-outlined icon-fill !text-white !text-7xl">
                person
              </span>
            }
          </div>
          <div className="flex flex-col pt-6">
            <h3 className="text-2xl font-semibold">{adminUser.name}</h3>
            <h5 className="text-gray-600">{adminUser.email}</h5>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-y-6 text-sm">
          <div className='col-span-2 flex justify-between items-center border-b pb-6'>
            <div>
              <div className="text-base font-semibold">Hồ sơ cá nhân</div>
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
            <div className="w-24 h-24 rounded-full border-2 border-white bg-blue-500 overflow-hidden shadow grid place-items-center">
              { adminUser.image
                ? <img src={adminUser.image.url} alt="" className='w-full h-full object-cover' loading='lazy' />
                : <span className="material-symbols-outlined icon-fill !text-white !text-6xl">
                  person
                </span>
              }
            </div>
            <AdminFormFieldImage name='name' className='w-96' />
          </div>

          <div className='border-b pb-6 pr-8'>
            <div className="font-semibold">Mật khẩu</div>
            <p className='text-gray-600'>Bạn nên giữ bí mật mật khẩu của mình</p>
          </div>
          <div className='flex flex-col space-y-4 border-b pb-6'>
            <TextField name='name' type='password' className='w-96' label="Mật khẩu" variant="outlined" size='small' />
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