import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Fade, Menu, Modal } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react'
import { v4 } from 'uuid';
import AdminAddField from '../add-form-field/AdminAddField';
import { SampleColumnImageType, SampleColumnReactionType, SampleColumnSelectType, SampleFieldAndDetailsType } from '@/lib/server/sample';
import { DATA_FIELDS } from '@/lib/server/fields';
import { GroupSettingType, SettingType } from '@/app/admin/(admin)/settings/page';
import { promiseFunction } from '@/lib/server/promise';
import { createPortal } from 'react-dom';

const SettingsModalAdd = ({
  group, open, setOpen, createEditSetting
}: {
  group: GroupSettingType,
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createEditSetting: (data: any) => Promise<void>
}) => {

  const router = useRouter()
  
  const onCloseModal = () => {
    if (JSON.stringify(mapSettingToData(group.settings)) != JSON.stringify(data)) {
      setHasCloseModal(true)
    }
    else {
      setOpen(false)
    }
  }

  const [hasCloseModal, setHasCloseModal] = useState(false)

  const changeHasCloseModal = () => {
    setHasCloseModal(false)
    setOpen(false)
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openFields = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const [widthFields, setWidthFields] = useState(0)
  useEffect(() => {
    if (anchorEl) {
      setWidthFields(anchorEl.offsetWidth)
    }
  }, [anchorEl])

  // data
  const [data, setData] = useState<({
    id: string, 
    name: string,
  } & SampleFieldAndDetailsType)[]>([])

  const mapSettingToData = (settings: SettingType[]) => {
    return settings.map(v => ({
      id: v.id,
      type: v.type,
      name: v.name,
      details: v.details
    }))
  }

  useEffect(() => {
    if (!group) return

    // setData(mapSettingToData(group.settings))
  },[group])

  const getDetailsDefault = <T extends SampleFieldAndDetailsType['type']>(
    type: T
  ) => {
    switch (type) {
      case "select":
        return {
          list: [],
        } as SampleColumnSelectType['details']
      case "image":
        return {
          multiple: false
        } as SampleColumnImageType['details']
      case "relation":
        return {
          tableNameRelation: '',
          titleRelation: '',
          type: 'one-to-one'
        } as SampleColumnReactionType['details']
      default:
        return undefined
    }
  }

  const addField = (fieldName: SampleFieldAndDetailsType['type']) => {
    setData(state => [...state, {
      id: v4(),
      name: "field",
      type: fieldName,
      details: getDetailsDefault(fieldName) as any
    }])
    handleCloseMenu()
  }

  const onDeleteField = (id: string) => {
    setData(state => state.filter(v => v.id != id))
  }

  const onChangeField = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setData(state => state.map(v => {
      if (v.id == id) {
        v.name = e.target.value
      }

      return v
    }))
  }

  const onChangeDetailField = (details: SampleFieldAndDetailsType['details'], id: string) => {
    setData(state => state.map(v => {
      if (v.id == id) {
        v.details = details
      }

      return v
    }))
  }

  // create collection
  const [loading, setLoading] = useState(false)

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // return 

    // await promiseFunction({
    //   loading: loading,
    //   setLoading: setLoading,
    //   callback: async () => {
    //     router.refresh()
    //     setOpen(false)
    //   }
    // })
  }

  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        onClose={onCloseModal}
      >
        <form id='settingAdd' className='w-[700px] max-w-[100vw] flex flex-col h-full' onSubmit={handelSubmit}>
          <div className="flex-none bg-gray-100 py-6 px-8">
            <h3 className='text-xl'>Cập nhập nhóm <span className="text-blue-600">{group.name}</span></h3>
          </div>
          <div className="flex-grow min-h-0 overflow-y-auto py-6 px-8 flex flex-col space-y-4">
            {data.map(v => 
              // @ts-ignore
              <AdminAddField 
                key={v.id} 
                type={v.type} 
                details={v.details}
                defaultValue={v.name} 
                onChangeDetails={(data) => onChangeDetailField(data, v.id)}
                onChange={(e) => onChangeField(e, v.id)} 
                onDelete={() => onDeleteField(v.id)} 
              />
            )}
            <Button className='w-full' variant="outlined" startIcon={(
              <span className="icon">add</span>
            )} onClick={handleClick}>
              Thêm trường mới
            </Button>
            <Menu
              MenuListProps={{
                // "aria-labelledby": "basic-button",
                sx: { width: widthFields }
              }}
              anchorEl={anchorEl}
              open={openFields}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div className="w-full grid grid-cols-4 px-2 text-sm">
                {Object.keys(DATA_FIELDS).filter(v => !["publish", "permissions"].includes(v)).map(v => {

                  const fieldType = v as SampleFieldAndDetailsType['type'];
                  const fieldInfo = DATA_FIELDS[fieldType]

                  return (
                    <div key={v} className="px-2 py-2 rounded flex items-center space-x-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => addField(fieldType)}
                    >
                      <span className="icon">{fieldInfo.icon}</span>
                      <span>{fieldInfo.fieldName}</span>
                    </div>
                  )
                })}
              </div>
            </Menu>
          </div>
          <div className="flex-none py-6 px-8 flex justify-end space-x-4 border-t">
            <Button variant="text" color='black' onClick={onCloseModal}>Hủy</Button>
            <Button variant="contained" type='submit'>Cập nhập</Button>
          </div>
        </form>
      </Drawer>
      <Dialog
        open={hasCloseModal}
        keepMounted
        onClose={() => setHasCloseModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Đóng bảng điều khiển</DialogTitle>
        <DialogContent>
          Bạn có các thay đổi chưa lưu. Bạn có thực sự muốn đóng bảng điều khiển không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHasCloseModal(false)}>Hủy</Button>
          <Button variant='contained' color='error' onClick={changeHasCloseModal}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: '#fff', zIndex: 99999 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default SettingsModalAdd