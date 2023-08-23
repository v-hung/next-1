"use client"

import { promiseFunction } from "@/lib/admin/promise";
import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, IconButton, Menu, Switch } from "@mui/material";
import { File, GroupScene, Scene } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminFormFieldText from "../form-field/AdminFormFieldText";
import slugify from "slugify";
import AdminFormFieldSelect from "../form-field/AdminFormFieldSelect";
import AdminFormFieldFile from "../form-field/AdminFormFieldFile";
import AdminFormFieldRichText from "../form-field/AdminFormFieldRichText";
import AdminFormFieldRelation from "../form-field/AdminFormFieldRelation";
import { addEditScene } from "@/lib/admin/scene";
import { SceneDataState } from "@/app/admin/(admin)/scenes/page";
import AdminFormFieldBool from "../form-field/AdminFormFieldBool";

const SceneAddModal = ({
  scene, open, setOpen
}: {
  scene?: SceneDataState,
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter()
  
  // modal
  const onCloseModal = () => {
    if (scene && (scene.name != name || scene.slug != slugName
      || scene.audio?.id != audio?.id
      || scene.group?.id != group?.id
      || scene.description != description
    )) {
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
    setDefaultData(scene)
  }

  const [name, setName] = useState('')
  const [slugName, setSlugName] = useState('')
  const [audio, setAudio] = useState<File>()
  const [group, setGroup] = useState<GroupScene | null>(null)
  const [description, setDescription] = useState<string>()
  const [publish, setPublish] = useState(true)

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

  const setDefaultData = (scene?: SceneDataState) => {
    if (scene) {
      setName(scene.name)
      setSlugName(scene.slug)
      setAudio(scene.audio || undefined)
      setGroup(scene.group)
      setDescription(scene.description || '')
      setPublish(scene.publish == "publish")
    }
    else {
      setName('')
      setSlugName('')
      setAudio(undefined)
      setGroup(null)
      setDescription('')
      setPublish(true)
    }
  }

  useEffect(() => {
    setDefaultData(scene)
  },[scene])

  // create collection
  const [loading, setLoading] = useState(false)

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    await promiseFunction({
      loading: loading,
      setLoading: setLoading,
      callback: async () => {

        var formData = new FormData(e.target as HTMLFormElement)

        await addEditScene(formData)

        router.refresh()
        setOpen(false)
      }
    })
  }

  return (
    <>
      <Drawer
        anchor='right'
        keepMounted={true}
        open={open}
        onClose={onCloseModal}
      >
        <form className='w-[700px] max-w-[100vw] flex flex-col h-full' id="addScene" onSubmit={handelSubmit}>
          <input type="hidden" name="id" value={scene?.id || ''} />
          <div className="flex-none bg-gray-100 py-4 px-8">
            <div className="flex items-center justify-between">
              <h3 className='text-xl'>{!scene ? 'Thêm' : 'Sửa'} điểm chụp <span className="text-blue-600">{scene?.name}</span></h3>
              <IconButton color="black" sx={{borderRadius: '4px'}}><span className="icon">close</span></IconButton>
            </div>
          </div>
          <div className="flex-grow min-h-0 overflow-x-hidden">
            <div className="overflow-y-auto py-6 px-8 flex flex-wrap -mx-4">
              <div className="w-full px-4 mb-4">
                <AdminFormFieldText label="Tiêu đề" name="name" value={name} onChange={handelChangeName} placeholder="Vd: bán đảo Bắc Hà" required={true} />
              </div>
              <div className="w-full px-4 mb-4">
                <AdminFormFieldText label="Slug" name="slug" value={slugName} onChange={handelChangeSlugName} required={true} />
              </div>
              
              { !scene
                ? <div className="w-full md:w-1/2 px-4 mb-4">
                  <AdminFormFieldFile label="Ảnh" name="image" details={{tableName: 'scene'}} />
                </div>
                : null
              }
              
              <div className="w-full md:w-1/2 px-4 mb-4">
                <AdminFormFieldFile label="Âm thanh" value={audio} onChange={(v) => setAudio(v)} name="audio" details={{tableName: 'scene', fileTypes: ['audio']}} />
              </div>
              <div className="w-full px-4 mb-4">
                <AdminFormFieldRelation label="Danh mục" name="group" value={group || null} onChange={(v) => setGroup(v)} details={{tableNameRelation: 'groupScene', titleRelation: 'name', typeRelation: 'many-to-one'}} />
              </div>
              <div className="w-full px-4 mb-4">
                <AdminFormFieldRichText label="Nội dung" value={description} onChange={v => setDescription(v)} name="description" />
              </div>
              <div className="w-full px-4 mb-4">
                <AdminFormFieldBool label="Xuất bản" value={publish} onChange={(e,v) => setPublish(v)} name="publish" />
              </div>
            </div>
          </div>
          <div className="flex-none py-6 px-8 flex justify-end space-x-4 border-t">
            <Button variant="text" color='black' onClick={onCloseModal}>Hủy</Button>
            <Button variant="contained" type='submit' form="addScene">Tiếp tục</Button>
          </div>
        </form>
      </Drawer>
      <Dialog
        open={hasCloseModal}
        keepMounted
        onClose={() => setHasCloseModal(false)}
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