"use client"
import Container from '@/components/web/Container'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useEffect, useState } from 'react'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { ButtonGroup, FormGroup, Tab, Tabs, TextField } from '@mui/material'
import Button from '@mui/material/Button';
import useModal from '@/stores/web/modal'
import { User } from 'next-auth'
import Table from '../Table'
import useAppConfig from '@/stores/web/appConfig'
import BtnBuyByEWallet from '../BtnBuyByEWallet'
import { formatCurrency } from '@/lib/utils/helper'

const ContentProfile = ({userData}: {userData: User}) => {
  const appConfig = useAppConfig()
  const [edit, setEdit] = useState(false)

  const [tab, setTab] = useState(0)

  const [hostname, setHostname] = useState("")

  useEffect(() => setHostname(window.location.hostname), [])

  const cancel = () => {
    // setdefault value
    setEdit(false)
  }

  return (
    <>
      <div className="relative w-full h-56 bg-red-400"></div>
      <Container className="-mt-10">
        <div className="flex items-end space-x-4 bg-white pb-2 px-4 rounded">
          <div className="relative w-32 h-32 border-4 border-gray-100 rounded-full bg-gray-100 overflow-hidden">
            <img src={userData.image || ''} alt="" className="w-full h-full object-contain" />
          </div>
          <div className='pb-6'>
            <h3 className="text-xl font-semibold">{userData.name}</h3>
            <p className="text-gray-600 mt-1 text-sm">Cập nhập thông tin tài khoản của bạn </p>
          </div>

          <div className="!ml-auto flex space-x-4 pb-6">
            { edit
              ? <>
                <Button color='inherit' variant="outlined" onClick={cancel}>Hủy bỏ</Button>
                <Button variant="contained">Lưu</Button>
              </>
              : <Button color='secondary' variant="outlined" onClick={() => setEdit(true)}>Chỉnh sửa</Button>
            }
          </div>
        </div>

        <form className='w-full rounded bg-white px-4 py-2 mt-6'>
          <div className='table w-full border-collapse'>
            <div className='table-row border-b border-gray-100'>
              <div className='table-cell align-middle font-semibold text-sm'>Tên bạn</div>
              <div className='table-cell align-middle'>
                <TextField name='serial' label="Tên bạn" variant="outlined" size='small' className='w-full max-w-lg !my-5' disabled={!edit}  />
              </div>
            </div>

            <div className='table-row border-b border-gray-100'>
              <div className='table-cell align-middle font-semibold text-sm'>Tài khoản</div>
              <div className='table-cell align-middle'>
                <div className='flex items-center w-full max-w-lg my-5'>
                  <div className='px-4 py-[7px] border border-r-0 bg-gray-200 text-gray-500 rounded-l'>
                    {hostname}/
                  </div>
                  <TextField variant="outlined" placeholder="username" size='small' className='w-full' disabled={!edit} 
                    sx={{fieldset: { borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}} />
                </div>
                {/* <TextField name='serial' label="Tên bạn" variant="outlined" size='small' className='w-full max-w-lg my-4' /> */}
              </div>
            </div>

            <div className='table-row border-b border-gray-100'>
              <div className='table-cell align-middle font-semibold text-sm'>Mật khẩu</div>
              <div className='table-cell align-middle'>
                <TextField name='serial' label="Tên bạn" variant="outlined" size='small' disabled={!edit}  className='w-full max-w-lg !my-5' />
              </div>
            </div>

            <div className='table-row border-b border-gray-100'>
              <div className='table-cell align-middle font-semibold text-sm'>
                <p>Ảnh đại diện</p>
                <p className="text-xs font-normal text-gray-600 mt-1">Đây sẽ là ảnh hiện thị của bạn</p>
              </div>
              <div className='table-cell align-middle'>
                <div className="my-5 flex space-x-4 items-start">
                  <div className="w-16 h-16 rounded-full overflow-hidden relative group cursor-pointer bg-gray-100">
                    <img src={userData.image || ''} alt="" className="w-full h-full object-contain" />
                    <div className="absolute w-full h-full top-0 left-0 bg-black/30 hidden group-hover:grid place-items-center">
                      <span className="icon text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 9c-1.626 0-3 1.374-3 3s1.374 3 3 3 3-1.374 3-3-1.374-3-3-3z"></path><path d="M20 5h-2.586l-2.707-2.707A.996.996 0 0 0 14 2h-4a.996.996 0 0 0-.707.293L6.586 5H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zm-8 12c-2.71 0-5-2.29-5-5s2.29-5 5-5 5 2.29 5 5-2.29 5-5 5z"></path></svg>
                      </span>
                    </div>
                  </div>

                  <p className="!ml-auto text-sm font-semibold">Xóa</p>
                  <p className="text-sm font-semibold">Cập nhập</p>
                </div>
              </div>
            </div>

            <div className='table-row'>
              <div className='table-cell align-middle font-semibold text-sm'>
                <p>Số dư</p>
                <p className="text-xs font-normal text-gray-600 mt-1">Chọn 1 trong 2 cách để nạp tiền vào tài khoản</p>
              </div>
              <div className='table-cell align-middle'>
                <div className="my-5 flex space-x-4 items-center">
                  <p className="font-semibold text-teal-500">{formatCurrency(1000000)}</p>
                  <button className="bg-sky-500 text-white px-6 py-2">Nạp thẻ</button>
                  <BtnBuyByEWallet title='Nạp bằng ví điện tử' />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-6">
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            aria-label="Danh sách"
          >
            <Tab label="Lịch sử nạp" />
            <Tab label="Tài khoản đã mua" />
          </Tabs>
        </div>

        <div className="mt-4">
          <Table className={tab != 0 ? "hidden" : ''}
            data={[
              {name: "Ví Momo", value: "0399633237"},
              {name: "Thesieure", value: "0399633237"},
              {name: "Viettelpay", value: "0399633237"}
            ]}
            titles={{name: "Thẻ", value: "Số tài khoản"}} 
          />

          <Table className={tab != 1 ? "hidden" : ''}
            data={[]}
            titles={{name: "Thẻ", value: "Số tài khoản"}} 
          />
        </div>
      </Container>
      <div className="mt-12"></div>
    </>
  )
}

export default ContentProfile