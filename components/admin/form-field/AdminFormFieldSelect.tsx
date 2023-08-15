"use client"
import { FormControl, FormHelperText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'

type State = {
  label: string,
  name: string
  required?: boolean,
  defaultValue?: any,
  value?: string,
  onChange?: (data: any) => void
  className?: string,
  details: {
    list: Item[]
  }
}

type Item = {
  value: string,
  title: string
}

const AdminFormFieldSelect: React.FC<State> = ({
  label,
  defaultValue,
  className,
  name,
  required = false,
  details: { list }
}) => {

  const [value, setValue] = useState<string>(defaultValue || '')

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  }

  return (
    <div className={className}>
      <p className="text-sm font-semibold mb-1 capitalize">{label} { required && <span className="text-red-500">*</span> }</p>
      <FormControl className='w-full'>
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          size='small'
          name={name}
          required={required}
        >
          { !required && <MenuItem value="">
            <em>Không chọn</em>
          </MenuItem> }
          { list.map((v,i) =>
            <MenuItem key={i} value={v.value}>{v.title}</MenuItem> 
          )}
        </Select>
      </FormControl>
    </div>
  )
}

export default AdminFormFieldSelect