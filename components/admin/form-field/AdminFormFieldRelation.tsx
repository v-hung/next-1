import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { VariantType, enqueueSnackbar } from 'notistack'
import React, { useEffect, useState, useRef } from 'react'

type State = {
  label?: boolean,
  title: string,
  name: string
  required?: boolean,
  defaultValue?: any,
  api: string
}

const AdminFormFieldRelation: React.FC<State> = ({
  label,
  title,
  name,
  required = false,
  defaultValue,
  api
}) => {
  const [value, setValue] = useState<string>(defaultValue ? defaultValue.id : '')

  const handelChangeValue = (data: any) => {
    if (data && data.id)
      setValue(data.id)
  }

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(api)

        if (!res.ok) throw ""

        const body = await res.json()

        setOptions([...body.data])

        // if (defaultValue) {
        //   setTimeout(() => {
        //     setValue(defaultValue)
        //   }, 300);
        // }
        
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
    <div>
      <p className="text-sm font-semibold mb-1">{title} { required && <span className="text-red-500">*</span> }</p>
      <input type="hidden" name={name} value={value} />
      <Autocomplete
        open={open}
        onOpen={() => {
          setOpen(true)
        }}
        onClose={() => {
          setOpen(false)
        }}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.title}
        options={options}
        loading={loading}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.title}
            </li>
          );
        }}
        defaultValue={defaultValue}
        onChange={(e,v) => handelChangeValue(v)}
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