"use client"
import React from 'react'

type State = {
  label: string,
  name: string
  required?: boolean,
  defaultValue?: string,
  number?: boolean
  value?: string,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const AdminFormFieldText: React.FC<State> = ({
  label,
  name,
  required = false,
  defaultValue,
  number = false,
  value,
  onChange
}) => {

  const changeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onChange == 'function') 
      onChange(e)
  }

  return (
    <div>
      <p className="text-sm font-semibold mb-1">{label} { required && <span className="text-red-500">*</span> }</p>
      <div className="border rounded focus-within:ring-2 ring-blue-600 bg-white">
        { value != undefined
          ? <input type={number ? 'number' : 'text'} name={name} value={value} onChange={(e) => changeEvent(e)} className="w-full px-4 py-2" required={required} />
          : <input type={number ? 'number' : 'text'} name={name} defaultValue={defaultValue} className="w-full px-4 py-2" required={required} />
        }
      </div>
    </div>
  )
}

export default AdminFormFieldText