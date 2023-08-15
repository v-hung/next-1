"use client"
import FormIOSSwitch from '@/components/FormIOSSwitch'
import React, { useRef, useState } from 'react'

type State = {
  label: string,
  name: string
  required?: boolean,
  className?: string,
  placeholder?: string,
  defaultValue?: any,
  value?: any,
  onChange?: (data: any) => void,
}

const AdminFormFieldBool: React.FC<State> = ({
  label,
  name,
  required = false,
  className = '',
  placeholder,
  defaultValue,
  value,
  onChange
}) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked)
    }
  }

  return (
    <FormIOSSwitch checked={value} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} name={name} label={label} />
  )
}

export default AdminFormFieldBool