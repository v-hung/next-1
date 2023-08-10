"use client"
import React from 'react'

type State = {
  title: string,
  name: string
  required?: boolean,
  defaultValue?: string,
  number?: boolean
}

const AdminFormFieldText: React.FC<State> = ({
  title,
  name,
  required = false,
  defaultValue,
  number = false
}) => {
  return (
    <div>
      <p className="text-sm font-semibold mb-1">{title} { required && <span className="text-red-500">*</span> }</p>
      <div className="border rounded focus-within:ring-2 ring-blue-600 bg-white">
        <input type={number ? 'number' : 'text'} name={name} defaultValue={defaultValue} className="w-full px-4 py-2" required={required} />
      </div>
    </div>
  )
}

export default AdminFormFieldText