"use client"
import {FormEvent, useEffect, useRef, useState} from 'react'
import { useClickOutside } from '@/lib/clickOutside';
import { Backdrop, Box, Button, Zoom } from '@mui/material';
import { FolderFile } from '@prisma/client';
import AdminFormFieldText from '../AdminFormFieldText';
import moment from 'moment';
import { createEditFolder } from '@/lib/admin/filesUpload';
import { VariantType, enqueueSnackbar } from 'notistack';
import { promiseFunction } from '@/lib/admin/promise';
import { Modal } from '@mui/material';
import { CircularProgress } from '@mui/material';

type AddModalType = {
  show: boolean,
  setShow: (data: boolean) => void,
  data: FolderFile | null
  setData: (data: FolderFile) => void,
  parentId?: string,
  tableName: string
}

const AdminFileModalAddFolder: React.FC<AddModalType> = ({show, setShow, data, setData, tableName, parentId}) => {
  const rechargeRef = useRef<HTMLDivElement>(null)

  useClickOutside(rechargeRef, () => {
    setShow(false)
  })

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    setName(data?.name || '')
  }, [data])

  const handelSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()

    await promiseFunction({
      loading,
      setLoading,
      callback: async () => {
        const { folder } = await createEditFolder({
          folderId: data?.id,
          name: name,
          tableName: tableName,
          parentId: data ? data.parentId : parentId
        })
  
        setShow(false)
        setData(folder)
      }
    })
  }

  return (
    <>
      <Modal
        open={show}
        // keepMounted={true}
        onClose={() => setShow(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Zoom in={show} unmountOnExit>
          <Box className='w-[42rem] max-w-[100vw] absolute left-1/2 top-1/2 
            !-translate-x-1/2 !-translate-y-1/2 rounded shadow bg-white outline-none'
          >
            <div className="p-6 flex items-center justify-between">
              <span className='text-xl font-semibold'>{data ? 'Sửa' : 'Thêm'} thư mục mới</span>
              <span 
                className="w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer flex items-center justify-center"
                onClick={() => setShow(false)}
              >
                <span className="icon">close</span>
              </span>
            </div>

            <div className="p-6 border-y">
              { data
                ? <div className="p-4 rounded bg-gray-50 flex space-x-4 text-xs text-gray-800 mb-4">
                  <div className='w-1/2'>
                    <p className="uppercase">Creation Date</p>
                    <p>{moment(data.createdAt).format('DD/MM/YYYY')}</p>
                  </div>
                  <div className='w-1/2'>
                    <p className="uppercase">Update Date</p>
                    <p>{moment(data.updatedAt).format('DD/MM/YYYY')}</p>
                  </div>
                </div>
                : null
              }

              <AdminFormFieldText label='Tên' name='name' value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="p-6 bg-gray-100 flex items-center">
              <Button variant="outlined" size='small' color='inherit' onClick={() => setShow(false)}>
                Hủy bỏ
              </Button>

              <Button className='!ml-auto' variant="contained" size='small' color='primary'
                onClick={handelSubmit}
              >
                Tạo mới
              </Button>
            </div>
          </Box>
        </Zoom>
      </Modal>

      <Backdrop
        sx={{ color: '#fff', zIndex: 99999 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default AdminFileModalAddFolder