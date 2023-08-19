"use client"
import { FormControl, FormHelperText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'

type State = {
  label?: string,
  name?: string
  required?: boolean,
  defaultValue?: any,
  value?: any,
  onChange?: (event: any) => void
  className?: string,
  details: {
    list: Item[],
    multiple?: boolean
  }
}

type Item = {
  value: string,
  title: string
}

const AdminFormFieldSelect: React.FC<State> = ({
  value,
  label,
  defaultValue,
  className,
  name,
  onChange,
  required = false,
  details: { list, multiple = false }
}) => {

  const handleChange = (event: SelectChangeEvent) => {
    if (typeof onChange == "function")
      onChange(event)
  }

  return (
    <div className={className}>
      { label
        ? <p className="text-sm font-medium mb-1 capitalize">{label} { required && <span className="text-red-500">*</span> }</p>
        : null
      }
      <FormControl className='w-full'>
        <Select
          value={value}
          onChange={handleChange}
          multiple={multiple}
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