"use client"
import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabPanel, TabsContext, TabsList } from '@mui/base';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AdminFormFieldText from '../form-field/AdminFormFieldText';
import { GroupSetting, Setting } from '@prisma/client';
import SettingsModalAddGroup from '../modal/SettingsAddModalGroup';
import SettingsModalAdd from '../modal/SettingsModalAdd';
import { GroupSettingType } from '@/app/admin/(admin)/settings/page';
import { DATA_FIELDS } from '@/lib/server/fields';
import { promiseFunction } from '@/lib/server/promise';
import { useRouter } from 'next/navigation';

type State = {
  groupSettings: GroupSettingType[],
  createEditGroup: (data: {id?: string,name: string}) => Promise<GroupSetting>
  deleteGroup: (data: {id: string}) => Promise<void>
  createEditSetting: (data: {groupId: string}) => Promise<void>
}

const SettingContentAdmin: React.FC<State> = ({groupSettings, createEditGroup, deleteGroup, createEditSetting}) => {
  const [groupActive, setGroupActive] = React.useState(groupSettings.length > 0 ? groupSettings[0] : undefined);

  const settings = groupActive != undefined ? groupActive.settings : []

  const [openAddModal, setOpenAddModal] = useState(false)

  const handelOpenAddModal = () => {
    setOpenAddModal(true)
  }

  // group settings
  const [groupDataEdit, setGroupDataEdit] = useState<GroupSettingType>()
  const [openAddModalGroup, setOpenAddModalGroup] = useState(false)
  const [openDeleteModalGroup, setOpenDeleteModalGroup] = useState(false)

  const handelOpenAddModalGroup = (data?: GroupSettingType) => {
    setGroupDataEdit(data)
    setOpenAddModalGroup(true)
  }

  const handelOpenDeleteModalGroup = () => {
    setOpenDeleteModalGroup(true)
  }

  return (
    <>
      <div className="-my-4 flex flex-col" style={{minHeight: 'calc(100vh - 64px)'}}>
        <div className="-mx-8 px-8 border-b bg-white pt-6 flex space-x-4 items-start">
          <div>
            <h5 className="text-3xl font-semibold">Cài đặt</h5>
            <div className="flex mt-4 space-x-6 items-center">
              { groupSettings.map(v =>
                <div key={v.id} 
                  className={`py-2 capitalize hover:text-blue-500 cursor-pointer 
                    ${v.id == groupActive?.id ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
                  onClick={() => setGroupActive(v)}
                >{v.name}</div>
              )}
              <Button variant='contained' size='small' startIcon={<span className="icon">add</span>}
                onClick={() => handelOpenAddModalGroup()}
              >
                Nhóm mới
              </Button>
            </div>
          </div>
          <div className="!ml-auto"></div>
          { groupActive?.canDelete
            ? <>
              <Button variant='outlined' color='error' startIcon={<span className="icon">delete</span>}
                onClick={handelOpenDeleteModalGroup}
              >
                Xóa nhóm hiện tại
              </Button>
              <Button variant='outlined' startIcon={<span className="icon">edit</span>}
                onClick={() => handelOpenAddModalGroup(groupActive)}
              >
                Sửa nhóm hiện tại
              </Button>
            </>
            : null
          }
          <Button variant='contained' startIcon={<span className="icon">add</span>}
            onClick={() => handelOpenAddModal()}
          >
            Cập nhập cài đặt
          </Button>
        </div>
        <div className="flex-grow min-h-0 -mx-8 p-8">
          <div className="grid grid-cols-12 bg-white rounded-lg p-8 gap-6">
            { settings.length > 0 ? settings.map(v => {
                const Component = DATA_FIELDS[v.type] ? DATA_FIELDS[v.type].Component : null
                return Component ? <div key={v.id} style={{gridColumn: 'span 6 / span 6'}}>
                  <Component
                    label={v.name} name={v.name}
                    required={v.required} defaultValue={v.value}
                    details={{...v.details, tablesName: 'setting'}}
                  />
                </div> : null
              })
              : <p className='col-span-12'>Không có cài đặt nào</p>
            }
          </div>
        </div>
      </div>
      { groupActive != undefined
        ? <SettingsModalAdd 
          group={groupActive} 
          open={openAddModal} 
          setOpen={setOpenAddModal} 
          createEditSetting={createEditSetting}
        />
        : null
      }
      
      <SettingsModalAddGroup 
        open={openAddModalGroup} 
        data={groupDataEdit} 
        setOpen={setOpenAddModalGroup} 
        createEditGroup={createEditGroup} 
      />
      <DeleteGroupPopup 
        data={groupActive} 
        open={openDeleteModalGroup} 
        setOpen={setOpenDeleteModalGroup} 
        deleteGroup={deleteGroup} 
        groupSettings={groupSettings}
        setGroupActive={setGroupActive}
      />
    </>
  )
}

const DeleteGroupPopup = ({
  data, open, setOpen, deleteGroup, groupSettings, setGroupActive
}: {
  data?: GroupSettingType,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  deleteGroup: (data: {id: string}) => Promise<void>
  groupSettings: GroupSettingType[], 
  setGroupActive: React.Dispatch<React.SetStateAction<GroupSettingType | undefined>>
}) => {

  const router = useRouter()

  const handelDelete = async () => {
    if (!data) return

    await promiseFunction({
      callback: async () => {
        await deleteGroup({id: data?.id})

        if (groupSettings.length > 0) {
          setGroupActive(state => state ? groupSettings[0] : state )
        }
        else {
          setGroupActive(undefined)
        }
        router.refresh()
        setOpen(false)
      }
    })
  }

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={() => setOpen(false)}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Xóa nhóm cài đặt</DialogTitle>
      <DialogContent>
        Bạn có chắc chắn muốn xóa nhóm <span className="text-red-500">{data?.name}</span> không ?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Không</Button>
        <Button variant='contained' color='error' onClick={handelDelete}>Xóa</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingContentAdmin