import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { Permission } from '@prisma/client'
import { VariantType, enqueueSnackbar } from 'notistack'
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'

type State = {
  label: string,
  name: string
  defaultValue?: Permission[],
  tablesName: string[]
}

const AdminFormFieldPermissions: React.FC<State> = ({
  label,
  name,
  defaultValue,
  tablesName
}) => {
  const [value, setValue] = useState<Permission[]>(defaultValue || [])

  console.log(value)
  
  const childs = useRef<any[]>([])

  const setChecked = (e: React.MouseEvent<HTMLButtonElement>, check: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    childs.current.forEach(v => v.forwardSetChecked(check))
  }

  return (
    <div>
      <p className="text-sm font-semibold mb-1">{label}</p>
      {/* <input type="hidden" name={name} value={value} /> */}
      <div className="flex space-x-2 text-sm">
        <button className='text-blue-500' onClick={(e) => setChecked(e, true)}>Chọn tất cả</button>
        <span>/</span>
        <button className='text-blue-500' onClick={(e) => setChecked(e, false)}>Bỏ chọn tất cả</button>
      </div>

      <div className="grid grid-flow-col auto-cols-max gap-4 mt-4">
        {tablesName.map((table_name, index) =>
          <RoleItems 
            key={table_name} 
            ref={child => childs.current[index] = child} 
            table_name={table_name} 
            value={value.filter(v => v.tableName == table_name).map(v => v.key)}
            edit={defaultValue != undefined}
          />
        )}
      </div>
    </div>
  )
}

const RoleItems = forwardRef(({
  table_name, value, edit = false
}: {
  table_name: string, value: string[], edit: boolean
}, ref) => {
  const data = ['browse', 'create', 'edit', 'delete', 'image']
  const [checked, setChecked] = useState(edit ? value: data)

  const handleSelectAll = () => {
    if (checked.length == data.length) {
      setChecked([])
    }
    else {
      setChecked(data.map(v => v))
    }
  }

  const handleSelect = (e: React.FormEvent<HTMLInputElement>) => {
    const { value, checked: isChecked } = e.target as HTMLInputElement

    if (isChecked) {
      setChecked([...checked, value])
    }
    else {
      setChecked(checked.filter(item => item !== value))
    }
  }

  useImperativeHandle(ref, () => ({

    forwardSetChecked(check: boolean) {
      if (check) {
        setChecked(data.map(v => v))
      }
      else {
        setChecked([])
      }
    }

  }))

  return (
    <div className='flex flex-col space-y-2'>
      <input type="hidden" name='permissions[]' value={checked} />
      <label htmlFor={table_name} className="inline-flex items-center space-x-2 select-none cursor-pointer">
        <input type="checkbox" id={table_name} checked={checked.length == data.length} onChange={handleSelectAll} />
        <span>{table_name}</span>
      </label>
      <div className="ml-6 flex flex-col space-y-1">
        {data.map(v =>
          <label htmlFor={`${table_name}-${v}`} key={`${table_name}-${v}`} className="inline-flex items-center space-x-2 select-none cursor-pointer">
            <input type="checkbox" id={`${table_name}-${v}`} value={v} checked={checked.includes(v)} onChange={handleSelect} />
            <span className='capitalize'>{v} {table_name}</span>
          </label>
        )}
      </div>
    </div>
  )
})

export default AdminFormFieldPermissions