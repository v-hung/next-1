"use client"
import { FormControl, FormHelperText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'

type State = {
  label?: boolean,
  title: string,
  name: string
  required?: boolean,
  list: Item[]
}

type Item = {
  value: string,
  title: string
}

const AdminFormFieldSelect: React.FC<State> = ({
  label,
  title,
  name,
  required = false,
  list
}) => {

  const [value, setValue] = useState("")

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    // <div>AdminFormFieldSelect</div>
    <div>
      <p className="text-sm font-semibold mb-1">{title} { required && <span className="text-red-500">*</span> }</p>
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