"use client"
import React from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabPanel, TabsContext, TabsList } from '@mui/base';
import { Button } from '@mui/material';
import AdminFormFieldText from '../form-field/AdminFormFieldText';

const SettingContentAdmin = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="-my-4 flex flex-col" style={{minHeight: 'calc(100vh - 64px)'}}>
        <div className="-mx-8 px-8 border-b bg-white pt-6 flex space-x-4 justify-between items-start">
          <div>
            <h5 className="text-3xl font-semibold">Cấu hình</h5>
            <div className="flex mt-4 space-x-6 items-center">
              <div className="py-2 border-b-2 capitalize hover:text-blue-500 border-blue-500 text-blue-500 cursor-pointer">fasd f</div>
              <div className="py-2 capitalize hover:text-blue-500 cursor-pointer">fasd f</div>
              <Button variant='contained' size='small' startIcon={<span className="icon">add</span>}>
                Nhóm mới
              </Button>
            </div>
          </div>
          <Button variant='contained' startIcon={<span className="icon">add</span>}>
            Cấu hình mới
          </Button>
        </div>
        <div className="flex-grow min-h-0 -mx-8 p-8">
          <div className="grid grid-cols-12 bg-white rounded-lg p-8">
            <div style={{gridColumn: 'span 6 / span 6'}}>
              <AdminFormFieldText label='fda d' name='fds a' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingContentAdmin