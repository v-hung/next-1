"use client"
import {useEffect, useRef, useState} from 'react'
import { useClickOutside } from '@/lib/clickOutside';
import { Image } from '@prisma/client';
import { Button, Zoom } from '@mui/material';
import { getScrollbarWidth } from '@/lib/utils/helper';
import AdminFormFieldImageAdd from './ImageModelAdd';
import AdminFormFieldImageEdit from './ImageModelEdit';

type ModalType = {
  show: boolean,
  setShow: (data: boolean) => void,
  multiple?: boolean,
  data: Image[]
  setData: (data: Image[]) => void,
}

const AdminFormFieldImageModel: React.FC<ModalType> = ({show, setShow, multiple, data, setData}) => {
  const rechargeRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<Image[]>([])

  const [selects, setSelects] = useState<Image[]>(data)
  const [checked, setChecked] = useState<string[]>([])

  const [page, setPage] = useState(0)

  const [addModal, setAddModal] = useState(false)
  const [dataUpload, setDataUpload] = useState<Image[]>([])

  const [editModal, setEditModal] = useState(false)
  const [dataEdit, setDataEdit] = useState<Image | null>(null)

  useClickOutside(rechargeRef, () => {
    setShow(false)
  })

  useEffect(() => {
    if (!show) {
      document.body.style.overflow = null as any
      document.body.style.paddingRight = null as any
    }
    else {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = getScrollbarWidth() + "px"
    }
  }, [show]) 

  const fetchImages = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/images')
      if (!res.ok) throw ""
      setImages(((await res.json())?.data as any[]).map(v => ({...v, checked: false})) || [])
    } catch (error) {
      return {data: []}
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  useEffect(() => {
    if (dataUpload.length == 0) return

    fetchImages()
    setSelects(state => [...state, ...dataUpload])

    // checked
    var updatedList: string[] = []
    if (multiple) {
      updatedList = [...checked, ...dataUpload.map(v => v.id)]
    }
    else {
      updatedList = [dataUpload[0].id]
    }

    setChecked(updatedList)
    setPage(1)

  }, [dataUpload])

  const editImage = (image: Image) => {
    setDataEdit(image)
    setEditModal(true)
  }

  // Add/Remove checked item from list
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    var updatedList: string[] = []

    if (multiple) {
      updatedList = [...checked]
      if (event.target.checked) {
        updatedList = [...checked, event.target.value]
      } else {
        updatedList.splice(checked.indexOf(event.target.value), 1)
      }
    }
    else {
      if (event.target.checked) {
        updatedList = [event.target.value]
      } else {
        updatedList = []
      }
    }
    
    var tempImages: Image[] = []

    updatedList.forEach(v => {
      let tmp = images.find(v2 => v2.id == v)
      if (tmp) {
        tempImages.push(tmp)
      }
    })

    setChecked(updatedList)
    setSelects(tempImages)
  }

  const isChecked = (item: string) => checked.includes(item)

  const next = () => {
    setData(selects)
    setShow(false)
  }

  return (
    <div className={`fixed w-full h-full top-0 left-0 px-4 overflow-hidden flex flex-col items-center justify-center z-[200]
      ${!show ? "pointer-events-none" : 'bg-black/40'}`}
      onClick={() => {}}
    >
      {/* <div className="flex-grow"></div> */}
      <div ref={rechargeRef} className='flex-none w-full max-w-3xl mx-auto'>
        <Zoom in={show} unmountOnExit>
          <div className='w-full bg-white rounded'>
            <div className="p-6 flex items-center justify-between">
              <span className='text-xl font-semibold'>Danh sách ảnh</span>
              <span 
                className="icon w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                onClick={() => setShow(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
              </span>
            </div>

            <div className="py-6 pt-0 border-y">
              <div className="px-6 flex items-center border-b">
                <div 
                  className={`p-4 uppercase text-xs font-semibold border-b hover:bg-blue-100 cursor-pointer border-transparent ${page == 0 ? 'text-blue-600 !border-blue-600' : ''}`}
                  onClick={() => setPage(0)}
                >
                  <span>Danh sách</span>
                  <span className="ml-1 px-1 py-0.5 bg-gray-100 rounded">{images.length}</span>
                </div>
                <div 
                  className={`p-4 uppercase text-xs font-semibold border-b hover:bg-blue-100 cursor-pointer border-transparent ${page == 1 ? 'text-blue-600 !border-blue-600' : ''}`}
                  onClick={() => setPage(1)}
                >
                  <span>Đã chọn</span>
                  <span className="ml-1 px-1 py-0.5 bg-gray-100 rounded">{selects.length}</span>
                </div>
                <Button className='!ml-auto' variant="contained" size='small' color='primary'
                  onClick={() => setAddModal(true)}
                >
                  Thêm ảnh
                </Button>
              </div>

              <div hidden={page != 0}>
                { loading
                  ? <div className="w-full p-6 grid place-items-center">
                    <span className="icon w-10 h-10 animate-spin">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="20" r="2"></circle><circle cx="12" cy="4" r="2"></circle><circle cx="6.343" cy="17.657" r="2"></circle><circle cx="17.657" cy="6.343" r="2"></circle><circle cx="4" cy="12" r="2.001"></circle><circle cx="20" cy="12" r="2"></circle><circle cx="6.343" cy="6.344" r="2"></circle><circle cx="17.657" cy="17.658" r="2"></circle></svg>
                    </span>
                  </div>
                  : images.length > 0
                  ? <div className="mt-6 grid gap-4 px-6 overflow-y-auto max-h-[60vh]" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))'}}>
                    { images.map((v,i) =>
                      <div className="rounded border overflow-hidden" key={v.id}>
                        <div className="relative w-full h-24 bg-make-transparent">
                          <img src={v.url} alt="" className="w-full h-full object-contain" />
                          <div className="absolute top-2 left-2">
                            <input type="checkbox" value={v.id} checked={isChecked(v.id)} onChange={(e) => handleCheck(e)} />
                          </div>
                          <span
                            className="absolute top-2 right-2 icon w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                            onClick={() => editImage(v)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.707 19.707 18 10.414 13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586 19.414 9 21 7.414z"></path></svg>
                          </span>
                        </div>
                        <div className="p-4 py-2 flex justify-between items-start border-t">
                          <div className="text-xs">
                            <p className="font-semibold">{v.name}</p>
                            <p className="uppercase">{v.type}</p>
                          </div>
                          <div className="text-[10px] p-1 py-0.5 font-semibold rounded bg-gray-100">IMAGE</div>
                        </div>
                      </div>
                    )}
                  </div>
                  : <div className='px-6 mt-6'>Không có ảnh nào</div>
                }
              </div>
              
              <div hidden={page != 1}>
                <div className="px-6 pt-6 flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold">{selects.length} tài sản đã chọn</h5>
                    <p className="text-sm mt-1 text-gray-600">Quản lý tài sản trước khi thêm chúng vào thư viện phương tiện</p>
                  </div>
                </div>
                { selects.length > 0
                  ? <div className="px-6 mt-6 grid gap-4 overflow-y-auto max-h-[60vh]" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))'}}>
                    { selects.map((v,i) =>
                      <div className="rounded border overflow-hidden" key={v.id}>
                        <div className="relative w-full h-24 bg-make-transparent">
                          <img src={v.url} alt="" className="w-full h-full object-contain" />
                          <div className="absolute top-2 left-2">
                            <input type="checkbox" value={v.id} checked={isChecked(v.id)} onChange={(e) => handleCheck(e)} />
                          </div>
                          <span
                            className="absolute top-2 right-2 icon w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                            onClick={() => editImage(v)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.707 19.707 18 10.414 13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586 19.414 9 21 7.414z"></path></svg>
                          </span>
                        </div>
                        <div className="p-4 py-2 flex justify-between items-start border-t">
                          <div className="text-xs">
                            <p className="font-semibold">{v.name}</p>
                            <p className="uppercase">{v.type}</p>
                          </div>
                          <div className="text-[10px] p-1 py-0.5 font-semibold rounded bg-gray-100">IMAGE</div>
                        </div>
                      </div>
                    )}
                  </div>
                  : <div className='px-6 mt-6'>Không có ảnh nào được chọn</div>
                }
              </div>
            </div>

            <div className="p-6 bg-gray-100 flex items-center">
              <Button variant="outlined" size='small' color='inherit' onClick={() => setShow(false)}>
                Hủy bỏ
              </Button>

              <Button className='!ml-auto' variant="contained" size='small' color='primary'
                onClick={next}
              >
                Tiếp theo
              </Button>
            </div>
          </div>
        </Zoom>
        <AdminFormFieldImageAdd show={addModal} setShow={setAddModal} setData={setDataUpload} />
        <AdminFormFieldImageEdit show={editModal} setShow={setEditModal} data={dataEdit} setData={setDataEdit} />
      </div>
      {/* <div className="flex-grow"></div> */}
    </div>
  )
}

export default AdminFormFieldImageModel