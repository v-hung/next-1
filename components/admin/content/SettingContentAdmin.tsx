"use client"
import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabPanel, TabsContext, TabsList } from '@mui/base';
import { Button } from '@mui/material';
import AdminFormFieldText from '../form-field/AdminFormFieldText';
import { GroupSetting, Setting } from '@prisma/client';
import SettingsModalAddGroup from '../modal/SettingsAddModalGroup';
import SettingsModalAdd from '../modal/SettingsModalAdd';
import { GroupSettingType } from '@/app/admin/(admin)/settings/page';
import { DATA_FIELDS } from '@/lib/server/fields';

type State = {
  groupSettings: GroupSettingType[],
  createEditGroup: (data: {id?: string,name: string}) => Promise<GroupSetting>
}

const SettingContentAdmin: React.FC<State> = ({groupSettings, createEditGroup}) => {
  const [indexGroupActive, setIndexGroupActive] = React.useState(groupSettings.length > 0 ? 0 : null);

  const settings = indexGroupActive != null ? groupSettings[indexGroupActive].settings : []

  const [openAddModal, setOpenAddModal] = useState(false)

  const handelOpenAddModal = () => {
    setOpenAddModal(true)
  }

  const [openAddModalGroup, setOpenAddModalGroup] = useState(false)

  const handelOpenAddModalGroup = () => {
    setOpenAddModalGroup(true)
  }

  return (
    <>
      <div className="-my-4 flex flex-col" style={{minHeight: 'calc(100vh - 64px)'}}>
        <div className="-mx-8 px-8 border-b bg-white pt-6 flex space-x-4 items-start">
          <div>
            <h5 className="text-3xl font-semibold">Cấu hình</h5>
            <div className="flex mt-4 space-x-6 items-center">
              { groupSettings.map((v,i) =>
                <div key={v.id} 
                  className={`py-2 capitalize hover:text-blue-500 cursor-pointer 
                    ${indexGroupActive == i ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
                  onClick={() => setIndexGroupActive(i)}
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
          { groupSettings[indexGroupActive || 0]?.canDelete
            ? <>
              <Button variant='outlined' color='error' startIcon={<span className="icon">delete</span>}
                onClick={() => handelOpenAddModal()}
              >
                Xóa nhóm hiện tại
              </Button>
              <Button variant='outlined' startIcon={<span className="icon">edit</span>}
                onClick={() => handelOpenAddModal()}
              >
                Sửa nhóm hiện tại
              </Button>
            </>
            : null
          }
          <Button variant='contained' startIcon={<span className="icon">add</span>}
            onClick={() => handelOpenAddModal()}
          >
            Cấu hình mới
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
      <SettingsModalAdd open={openAddModal} setOpen={setOpenAddModal} />
      <SettingsModalAddGroup open={openAddModalGroup} setOpen={setOpenAddModalGroup} createEditGroup={createEditGroup} />
    </>
  )
}

export default SettingContentAdmin