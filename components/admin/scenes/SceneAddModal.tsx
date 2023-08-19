"use client"

import { promiseFunction } from "@/lib/admin/promise";
import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, IconButton, Menu } from "@mui/material";
import { Scene } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminFormFieldText from "../form-field/AdminFormFieldText";
import slugify from "slugify";
import AdminFormFieldSelect from "../form-field/AdminFormFieldSelect";
import AdminFormFieldFile from "../form-field/AdminFormFieldFile";

const SceneAddModal = ({
  scene, open, setOpen
}: {
  scene?: Scene,
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter()
  
  // modal
  const onCloseModal = () => {
    if (JSON.stringify(scene) != JSON.stringify(data)) {
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
    setData(scene)
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openFields = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  // data
  const [data, setData] = useState<Scene>()

  const [name, setName] = useState('')
  const [slugName, setSlugName] = useState('')

  const handelChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    setName(value)
    setSlugName(slugify(value, {
      replacement: '_',  // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true,      // convert to lower case, defaults to `false`
      strict: false,     // strip special characters except replacement, defaults to `false`
      locale: 'vi',      // language code of the locale to use
      trim: true         // trim leading and trailing replacement chars, defaults to `true`
    }))
  }

  const handelChangeSlugName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugName(slugify(e.target.value, {
      replacement: '_',  // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true,      // convert to lower case, defaults to `false`
      strict: false,     // strip special characters except replacement, defaults to `false`
      locale: 'vi',      // language code of the locale to use
      trim: true         // trim leading and trailing replacement chars, defaults to `true`
    }))
  }

  useEffect(() => {
    if (!scene) return

    setData(scene)
  },[scene])

  // create collection
  const [loading, setLoading] = useState(false)

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await promiseFunction({
      loading: loading,
      setLoading: setLoading,
      callback: async () => {

        // await createEditSetting({
        //   groupId: group.id,
        //   settings: data
        // })

        // router.refresh()
        // setOpen(false)
      }
    })
  }

  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        onClose={onCloseModal}
      >
        <form className='w-[700px] max-w-[100vw] flex flex-col h-full' onSubmit={handelSubmit}>
          <div className="flex-none bg-gray-100 py-6 px-8">
            <div className="flex items-center justify-between">
              <h3 className='text-xl'>Thêm điểm chụp mới <span className="text-blue-600">{scene?.name}</span></h3>
              <IconButton color="black" sx={{borderRadius: '4px'}}><span className="icon">close</span></IconButton>
            </div>
          </div>
          <div className="flex-grow min-h-0 overflow-y-auto py-6 px-8 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <AdminFormFieldText label="Tiêu đề" name="name" value={name} onChange={handelChangeName} placeholder="Vd: bán đảo Bắc Hà" required={true} />
            </div>
            <div className="w-full px-4 mb-4">
              <AdminFormFieldText label="Slug" name="slug" value={slugName} onChange={handelChangeSlugName} required={true} />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <AdminFormFieldFile label="Slug" name="slug" details={{tableName: 'scene'}} />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <AdminFormFieldFile label="Slug" name="slug" details={{tableName: 'scene'}} />
            </div>
            <div className="w-full px-4 mb-4">
              <AdminFormFieldSelect label="Slug" name="slug" details={{list: []}} />
            </div>
            <div className="w-full px-4 mb-4">
              <AdminFormFieldSelect label="Slug" name="slug" details={{list: []}} />
            </div>
          </div>
          <div className="flex-none py-6 px-8 flex justify-end space-x-4 border-t">
            <Button variant="text" color='black' onClick={onCloseModal}>Hủy</Button>
            <Button variant="contained" type='submit'>Cập nhập</Button>
          </div>
        </form>
      </Drawer>
      <Dialog
        open={hasCloseModal}
        keepMounted
        onClose={() => setHasCloseModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Đóng bảng điều khiển</DialogTitle>
        <DialogContent>
          Bạn có các thay đổi chưa lưu. Bạn có thực sự muốn đóng bảng điều khiển không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHasCloseModal(false)}>Hủy</Button>
          <Button variant='contained' color='error' onClick={changeHasCloseModal}>Đóng</Button>
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

export default SceneAddModal