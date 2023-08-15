import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Fade, Menu, Modal } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react'
import { v4 } from 'uuid';
import AdminAddField from '../add-form-field/AdminAddField';
import moment from 'moment';
import { GroupSetting } from '@prisma/client';
import AdminFormFieldText from '../form-field/AdminFormFieldText';
import { promiseFunction } from '@/lib/server/promise';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
};

const SettingsModalAddGroup = ({
  data, open, setOpen,
  createEditGroup
}: {
  data?: GroupSetting
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createEditGroup: (data: {id?: string,name: string}) => Promise<GroupSetting>
}) => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const handleClose = () => setOpen(false)

  const [name, setName] = useState(data?.name || '')

  const handelSubmit = async () => {
    await promiseFunction({
      loading: loading,
      setLoading: setLoading,
      callback: async () => {
        await createEditGroup({
          id: data?.id,
          name: name
        })

        router.refresh()
        handleClose()
      }
    })
  }

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} className='w-[600px] max-w-[100vw] rounded shadow bg-white'>
          <div className="p-6 flex items-center justify-between">
              <span className='text-xl font-semibold'>{data ? 'Sửa' : 'Thêm'} thư mục mới</span>
              <span 
                className="w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer flex items-center justify-center"
                onClick={() => setOpen(false)}
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
              <Button variant="outlined" size='small' color='inherit' onClick={() => setOpen(false)}>
                Hủy bỏ
              </Button>

              <Button className='!ml-auto' variant="contained" size='small' color='primary'
                onClick={handelSubmit}
              >
                Tạo mới
              </Button>
            </div>
          </Box>
        </Fade>
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

export default SettingsModalAddGroup