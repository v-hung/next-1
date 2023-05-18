"use client"
import React from 'react'

type State = {
  label?: boolean,
  title: string,
  name: string
  required?: boolean
}

const AdminFormFieldLongText: React.FC<State> = ({
  label,
  title,
  name,
  required = false
}) => {
  return (
    <div>
      <p className="text-sm font-semibold mb-1">{title} { required && <span className="text-red-500">*</span> }</p>
      <div className="border rounded focus-within:ring-2 ring-blue-600 bg-white">
        <textarea name={name} className="w-full px-4 py-2" rows={4} required={required}></textarea>
      </div>
    </div>
  )
}

export default AdminFormFieldLongText