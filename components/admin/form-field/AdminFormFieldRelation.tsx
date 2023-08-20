"use client"
import { getListDataOfRelation } from '@/lib/admin/sample'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { VariantType, enqueueSnackbar } from 'notistack'
import React, { useEffect, useState, useRef } from 'react'

type State = {
  label?: string,
  name?: string
  required?: boolean,
  defaultValue?: any,
  value?: string,
  onChange?: (data: any) => void
  className?: string,
  details: {
    typeRelation: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many',
    titleRelation: string,
    tableNameRelation: string
  }
}

const AdminFormFieldRelation: React.FC<State> = ({
  label,
  name,
  required = false,
  className,
  defaultValue,
  details: {
    typeRelation,
    titleRelation,
    tableNameRelation
  }
}) => {
  const [value, setValue] = useState<string>(defaultValue ? defaultValue.id : '')

  const handelChangeValue = (data: any) => {
    if (data && data.id)
      setValue(data.id)
    else 
      setValue('')
  }

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)

        const body = await getListDataOfRelation({tableName: tableNameRelation})

        setOptions([...body.data])
        
      } catch (error) {
        console.log({error})
        let variant: VariantType = "error"
        enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại sau', { variant })
      } 
      finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className={className}>
      { label
        ? <p className="text-sm font-medium mb-1 capitalize">{label} { required && <span className="text-red-500">*</span> }</p>
        : null
      }
      <input type="hidden" name={name} value={value} />
      <Autocomplete
        multiple={["one-to-many", "many-to-many"].includes(typeRelation)}
        open={open}
        onOpen={() => {
          setOpen(true)
        }}
        onClose={() => {
          setOpen(false)
        }}
        isOptionEqualToValue={(option, value) => option[titleRelation] === value[titleRelation]}
        getOptionLabel={(option) => option[titleRelation]}
        options={options}
        loading={loading}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option[titleRelation]}
            </li>
          );
        }}
        defaultValue={defaultValue}
        onChange={(e,v) => handelChangeValue(v)}
        className='bg-white'
        renderInput={(params) => (
          <TextField
            {...params}
            size='small'
            required={required}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  )
}

export default AdminFormFieldRelation