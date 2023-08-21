"use client"
import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Fade, Menu, Modal, Tab, Tabs, TextField, } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react'
import { GroupSetting, InfoHotspot, LinkHotspot } from '@prisma/client';
import { promiseFunction } from '@/lib/admin/promise';
import AdminFormFieldRelation from '../form-field/AdminFormFieldRelation';
import AdminFormFieldSelect from '../form-field/AdminFormFieldSelect';
import AdminFormFieldText from '../form-field/AdminFormFieldText';
import AdminFormFieldRichText from '../form-field/AdminFormFieldRichText';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
};

const HotspotAddModal = ({
  coordinates, data, open, setOpen
}: {
  coordinates: {
    yaw: number;
    pitch: number;
  },
  data?: InfoHotspot | LinkHotspot,
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const handleClose = () => setOpen(false)

  const [tabCurrent, setTabcurrent] = useState('link');

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTabcurrent(newValue)
  };

  const [infoType, setInfoType] = useState('1')

  const handelSubmit = async () => {
    await promiseFunction({
      loading: loading,
      setLoading: setLoading,
      callback: async () => {
        // await createEditGroup({
        //   id: data?.id,
        //   name: name
        // })

        // router.refresh()
        // handleClose()
      }
    })
  }

  return (
    <>
      <Modal
        open={open}
        keepMounted={true}
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
            <div className="px-6 pt-4 flex items-center justify-between">
              <span className='text-xl font-semibold'>{data ? 'Sửa' : 'Thêm'} điểm nóng mới</span>
              <span 
                className="w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer flex items-center justify-center"
                onClick={() => setOpen(false)}
              >
                <span className="icon">close</span>
              </span>
            </div>

            <div className="px-6">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={tabCurrent}
                  onChange={handleChangeTab}
                >
                  <Tab value="link" label="Liên kết" icon={(<span className='icon'>my_location</span>)} iconPosition="start" />
                  <Tab value="info" label="Thông tin" icon={(<span className='icon'>info</span>)} iconPosition="start" />
                </Tabs>
              </Box>
            </div>
            <div className="px-6 border-y max-h-[calc(100vh-220px)] overflow-y-auto">
              <div className={`mt-4 rounded bg-gray-50 p-4 flex flex-col space-y-4 ${tabCurrent == 'link' ? '' : '!hidden'}`}>
                <TextField variant="standard" disabled label="Tọa độ" value={JSON.stringify(data ? {yaw: data.yaw, pitch: data.pitch} : coordinates)} />
                <AdminFormFieldRelation label='Chọn điểm chụp' name='scene' details={{tableNameRelation: 'scene', titleRelation: 'name', typeRelation: 'many-to-one'}} required={true} />
                <AdminFormFieldSelect label='loại' name='type' details={{list: [
                  {title: 'Cơ bản', value: '1'},
                  {title: 'Mặt đất', value: '2'},
                  {title: 'Trên cao', value: '3'},
                  {title: 'Thông tin', value: '4'}
                ]}} required={true} defaultValue="1" />
              </div>

              <div className={`mt-4 rounded bg-gray-50 p-4 flex flex-col space-y-4 ${tabCurrent == 'info' ? '' : '!hidden'}`}>
                <TextField variant="standard" disabled label="Tọa độ" value={JSON.stringify(data ? {yaw: data.yaw, pitch: data.pitch} : coordinates)} />
                <AdminFormFieldText label='Tiêu đề' name='name' required={true} />
                <AdminFormFieldSelect label='loại' name='type' details={{list: [
                  {title: 'Cơ bản', value: '1'},
                  {title: 'Video', value: '2'},
                ]}} required={true} value={infoType} onChange={v => setInfoType(v.target.value)} />
                {
                  infoType == "2" 
                  ? <AdminFormFieldText label='Video' name='video' required={true} />
                  : <AdminFormFieldRichText label='Nội dung' name='description' required={true} />
                }
                
              </div>
            </div>

            <div className="p-6 bg-gray-100 flex items-center">
              <Button variant="outlined" size='small' color='inherit' onClick={() => setOpen(false)}>
                Hủy bỏ
              </Button>

              <Button className='!ml-auto' variant="contained" size='small' color='primary'
                onClick={handelSubmit}
              >
                Tiếp tục
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

export default HotspotAddModal