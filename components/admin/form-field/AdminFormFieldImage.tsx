"use client"
import {useEffect, useRef, useState} from 'react'
import { useClickOutside } from '@/lib/clickOutside';
import { getScrollbarWidth } from '@/lib/utils/helper';
import { Button, Zoom } from '@mui/material';
import db from '@/lib/server/prismadb';
import { Image } from '@prisma/client';

type AdminFormFieldImageType = {
  multiple?: boolean,
  name: string
}

const AdminFormFieldImage: React.FC<AdminFormFieldImageType> = ({
  multiple = false,
  name
}) => {
  const [value, setValue] = useState("")

  const [imageChoose, setImageChoose] = useState(false)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className='h-36 border rounded focus-within:ring-2 ring-orange-600 bg-white'>
        <input type="hidden" name={name} value={value} className='sr-only' />
        <div className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
          onClick={() => setShowModal((state) => state = !state)}
        >
          { !imageChoose 
            ? <>
              <span className="icon w-10 h-10 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"></path><path d="m8 11-3 4h11l-4-6-3 4z"></path><path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>
              </span>
              <span className="mt-2 text-xs font-semibold">Bấm để thêm một tài sản hoặc kéo và thả một trong khu vực này</span>
            </>
            : <div className="w-full h-full p-2 bg-make-transparent">
              <img src="" alt="" />
            </div>
          }
        </div>
      </div>

      <Modal show={showModal} setShow={setShowModal} />
    </>
  )
}

type ModalType = {
  show: boolean,
  setShow: (data: boolean) => void
}

const Modal: React.FC<ModalType> = ({show, setShow}) => {
  const rechargeRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<Image[]>(new Array(20).fill({
    id: "clhhjonkj0008tyfon85hcjkd",
    name: "pz.png",
    type: "image/png",
    caption: null,
    url: "/storage/images/c52be3b5-5427-4cd4-8d32-9e735a34e8d0.png",
    width: null,
    height: null,
    naturalWidth: 2500,
    naturalHeight: 2500,
    size: 1856423
  }))
  const [addModal, setAddModal] = useState(false)
  const [dataUpload, setDataUpload] = useState([])

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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/admin/images')
        if (!res.ok) throw ""
        setImages((await res.json())?.data || [])
      } catch (error) {
        return {data: []}
      }
    }
    fetchImages()
  }, [])

  useEffect(() => {
    setImages(state => [...dataUpload, ...state])
  }, [dataUpload])

  return (
    <div className={`fixed w-full h-full top-0 left-0 px-4 py-4 md:py-8 lg:py-12 overflow-auto flex flex-col z-[200]
      ${!show ? "pointer-events-none !overflow-hidden" : 'bg-black/40'}`}
      onClick={() => {}}
    >
      <div className="flex-grow"></div>
      <div ref={rechargeRef} className='flex-none w-full max-w-3xl mx-auto'>
        <Zoom in={show}>
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

            <div className="p-6 pt-0 border-y">
              <div className="flex items-center border-b">
                <div className="p-4 uppercase text-xs font-semibold text-blue-600 border-b border-blue-600">
                  <span>Browse</span>
                  <span className="px-1 py-0.5 bg-gray-100 rounded">7</span>
                </div> 
                <Button className='!ml-auto' variant="contained" size='small' color='primary'
                  onClick={() => setAddModal(true)}
                >
                  Thêm ảnh
                </Button>
              </div>
              { images.length > 0
                ? <div className="mt-6 grid gap-4" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))'}}>
                  { images.map((v,i) => 
                    <div className="rounded border overflow-hidden" key={i}>
                      <div className="relative w-full h-24 bg-make-transparent">
                        <img src={v.url} alt="" className="w-full h-full object-contain" />
                        <div className="absolute top-2 left-2">
                          <input type="checkbox" name="file_selected" />
                        </div>
                        <span 
                          className="absolute top-2 right-2 icon w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                          onClick={() => {}}
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
                : <div className='mt-6'>Không có ảnh nào</div>
              }
              
            </div>

            <div className="p-6 bg-gray-100 flex items-center">
              <Button variant="outlined" size='small' color='inherit' onClick={() => setShow(false)}>
                Hủy bỏ
              </Button>

              <Button className='!ml-auto' variant="contained" size='small' color='primary'>
                Tiếp theo
              </Button>
            </div>
          </div>
        </Zoom>
        <AddModal show={addModal} setShow={setAddModal} setData={setDataUpload} />
      </div>
      <div className="flex-grow"></div>
    </div>
  )
}

type AddModalType = {
  show: boolean,
  setShow: (data: boolean) => void,
  setData: (data: any) => void,
}

const AddModal: React.FC<AddModalType> = ({show, setShow, setData}) => {
  const rechargeRef = useRef<HTMLDivElement>(null)

  useClickOutside(rechargeRef, () => {
    setShow(false)
  })

  const [files, setFiles] = useState<{
    name: string,
    type: string,
    preview: string,
    file: File
  }[]>([])

  const [isAddFiles, setIsAddFiles] = useState(false)
  const [loading, setLoading] = useState(false)

  const changeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    let tmpFiles = e.target.files ?? []
    let newFiles: any = []
    Array.from(tmpFiles).map((v,i) => {
      if (files.findIndex(v2 => v2.name == v.name) < 0) {
        newFiles.push({
          name: v.name,
          type: v.type,
          preview: URL.createObjectURL(v),
          file: v
        })
      }
    })

    setFiles((state) => [...state, ...newFiles])
  }

  useEffect(() => {
    if (files.length > 0) {
      setIsAddFiles(true)
    }
    else {
      setIsAddFiles(false)
    }
  }, [files])

  const removeFileChange = (index: number) => {
    URL.revokeObjectURL(files[index].preview)
    setFiles(files.filter((v,i) => i != index))
  }

  const upload = async () => {
    try {
      setLoading(true)

      var data: any = new FormData()

      files.map(v => {
        data.append('images[]', v.file)
      })

      const res = await fetch('/api/admin/images', {
        method: 'post',
        body: data
      })

      if (!res.ok) throw ""

      const { images } = await res.json()

      files.forEach((v,i) => {
        URL.revokeObjectURL(files[i].preview)
      })
      setFiles([])

      setShow(false)
      setData(images)
      
    } catch (e) {

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((v,i) => {
        URL.revokeObjectURL(files[i].preview)
      })
    }
  }, [])

  return (
    <div className={`fixed w-full h-full top-0 left-0 px-4 py-4 md:py-8 lg:py-12 overflow-auto flex justify-center items-start z-[200]
      ${!show ? "pointer-events-none !overflow-hidden" : 'bg-black/40'}`}>
      <div ref={rechargeRef} className='w-full max-w-3xl mx-auto'>
        <Zoom in={show}>
          <div className='w-full bg-white rounded'>
            <div className="p-6 flex items-center justify-between">
              <span className='text-xl font-semibold'>Thêm ảnh mới</span>
              <span 
                className="icon w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                onClick={() => setShow(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
              </span>
            </div>

            <div className="p-6 pt-0 border-y">
              { isAddFiles
                ? <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold">{files.length} tài sản đã sẵn sàng để tải lên</h5>
                      <p className="text-sm mt-1 text-gray-600">Quản lý tài sản trước khi thêm chúng vào thư viện phương tiện</p>
                    </div>
                    <Button variant="contained" onClick={(e) => setIsAddFiles(false)}>Thêm file</Button>
                  </div>
                  <div className="mt-6 grid gap-4" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))'}}>
                    { files.map((v,i) =>
                      <div className="rounded border overflow-hidden" key={i}>
                        <div className="relative w-full h-24 bg-make-transparent">
                          <img src={v.preview} alt="" className="w-full h-full object-contain" />
                          <span
                            className="absolute top-2 right-2 icon w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                            onClick={() => {removeFileChange(i)}}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>
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
                </>
                : <>
                  <div className="flex items-center border-b">
                    <div className="p-4 uppercase text-xs font-semibold text-blue-600 border-b border-blue-600">
                      <span>Từ máy tính của bạn</span>
                    </div> 
                  </div>
                  <div className="mt-6 flex flex-col items-center justify-center w-full border border-dashed py-12 rounded bg-gray-50">
                    <span className="icon w-20 h-20 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"></path><path d="m8 11-3 4h11l-4-6-3 4z"></path><path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>
                    </span>
                    <span className="my-4 font-semibold">Bấm để thêm một tài sản hoặc kéo và thả một trong khu vực này</span>
                    <Button variant="contained" component="label">
                      Chọn file
                      <input hidden type="file" name="imageFile" id="imageFile" multiple={true} accept="image/*" onChange={(e) => changeFiles(e)} />
                    </Button>
                  </div>
                </>
              }
              
            </div>

            <div className="p-6 bg-gray-100 flex items-center">
              <Button variant="outlined" size='small' color='inherit' onClick={() => setShow(false)}>
                Hủy bỏ
              </Button>

              <Button className='!ml-auto' variant="contained" size='small' color='primary'
                onClick={upload}
              >
                Tải ảnh lên
              </Button>
            </div>
          </div>
        </Zoom>
      </div>

      { loading ? <div className="absolute w-full h-full top-0 left-0 bg-white/30 grid place-items-center pointer-events-auto">
        <span className="icon animate-spin w-10 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"></path></svg>
        </span>
      </div> : null }
    </div>
  )
}

export default AdminFormFieldImage