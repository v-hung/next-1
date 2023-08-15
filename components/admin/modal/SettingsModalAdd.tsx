import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Fade, Menu, Modal } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react'
import { v4 } from 'uuid';
import AdminAddField from '../add-form-field/AdminAddField';
import { SampleFieldAndDetailsType } from '@/lib/server/sample';
import { DATA_FIELDS } from '@/lib/server/fields';

const SettingsModalAdd = ({
  open, setOpen
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  const router = useRouter()
  
  const onCloseModal = () => {
    if (data.length > 0) {
      setHasCloseModal(true)
    }
    else {
      setOpen(false)
    }
  }

  const [hasCloseModal, setHasCloseModal] = useState(false)

  const changeHasCloseModal = () => {
    setHasCloseModal(false)
    setOpen(false)
    setData([])
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openFileds = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const [widthFileds, setWidthFileds] = useState(0)
  useEffect(() => {
    if (anchorEl) {
      setWidthFileds(anchorEl.offsetWidth)
    }
  }, [anchorEl])

  const [data, setData] = useState<{id: string, type: SampleFieldAndDetailsType['type'], name: string, }[]>([])

  const addField = (fieldName: SampleFieldAndDetailsType['type']) => {
    setData(state => [...state, {
      id: v4(),
      name: "field",
      type: fieldName,
    }])
    handleCloseMenu()
  }

  const onDeleteField = (id: string) => {
    setData(state => state.filter(v => v.id != id))
  }

  const onChangeField = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setData(state => state.map(v => {
      if (v.id == id) {
        v.name = e.target.value
      }

      return v
    }))
  }

  // create collection
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      if (loading) return
      setLoading(true)

      const { name } = Object.fromEntries(
        new FormData(e.target as HTMLFormElement),
      );

      const res = await fetch('/api/admin/database/create', {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          fields: data
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })

      if (!res.ok) throw "Error"

      const body = await res.json()

      router.refresh()
      setOpen(false)
      setData([])
      
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        onClose={onCloseModal}
      >
        <form className='w-[700px] max-w-[100vw] flex flex-col h-full' onSubmit={submit}>
          <div className="flex-none bg-gray-100 py-6 px-8">
            <h3 className='text-xl'>Thêm cài đặt mới</h3>
          </div>
          <div className="flex-grow min-h-0 overflow-y-auto py-6 px-8 flex flex-col space-y-4">
            {data.map(v => 
              <AdminAddField key={v.id} type={v.type} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
            )}
            <Button className='w-full' variant="outlined" startIcon={(
              <span className="icon">add</span>
            )} onClick={handleClick}>
              New Fields
            </Button>
            <Menu
              MenuListProps={{
                // "aria-labelledby": "basic-button",
                sx: { width: widthFileds }
              }}
              anchorEl={anchorEl}
              open={openFileds}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div className="w-full grid grid-cols-4 px-2 text-sm">
                {Object.keys(DATA_FIELDS).map(v => {

                  const fieldType = v as SampleFieldAndDetailsType['type'];
                  const fieldInfo = DATA_FIELDS[fieldType]

                  return (
                    <div key={v} className="px-2 py-2 rounded flex items-center space-x-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => addField(fieldType)}
                    >
                      <span className="icon">{fieldInfo.icon}</span>
                      <span>{fieldInfo.fieldName}</span>
                    </div>
                  )
                })}
              </div>
            </Menu>
          </div>
          <div className="flex-none py-6 px-8 flex justify-end space-x-4 border-t">
            <Button variant="text" color='black' onClick={onCloseModal}>Cancel</Button>
            <Button variant="contained" type='submit'>Create</Button>
          </div>
        </form>
      </Drawer>
      <Dialog
        open={hasCloseModal}
        keepMounted
        onClose={() => setHasCloseModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Close the panel</DialogTitle>
        <DialogContent>
          You have unsaved changes. Do you really want to close the panel?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHasCloseModal(false)}>No</Button>
          <Button variant='contained' color='error' onClick={changeHasCloseModal}>Yes</Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: '#fff', zIndex: 99999 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default SettingsModalAdd