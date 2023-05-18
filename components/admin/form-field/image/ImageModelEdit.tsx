"use client"
import {useEffect, useRef, useState} from 'react'
import { useClickOutside } from '@/lib/clickOutside';
import { Image } from '@prisma/client';
import { Button, Tooltip, Zoom } from '@mui/material';
import { formatBytes, formatDate } from '@/lib/utils/helper';

type EditModalType = {
  show: boolean,
  setShow: (data: boolean) => void,
  data: Image | null,
  setData: (data: any) => void,
}

const AdminFormFieldImageEdit: React.FC<EditModalType> = ({show, setShow, data, setData}) => {
  const rechargeRef = useRef<HTMLDivElement>(null)

  useClickOutside(rechargeRef, () => {
    setShow(false)
  })

  const [loading, setLoading] = useState(false)
  const [deletePopup, setDeletePopup] = useState(false)

  const save = async () => {
    try {
      setLoading(true)

      var formData: any = new FormData()

      

      setShow(false)
    } catch (e) {

    } finally {
      setLoading(false)
    }
  }

  const download = () => {
    if (typeof window === "undefined" || !data) return
    var a = document.createElement('a')
    a.href = data.url
    a.download = data.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const copy = () => {
    if (typeof window === "undefined" || !data) return
    navigator.clipboard.writeText(data.url);
  }

  const deleteImage = () => {

  }

  return (
    <div className={`fixed w-full h-full top-0 left-0 px-4 py-4 overflow-hidden flex flex-col items-center justify-center z-[200]
      ${!show ? "pointer-events-none" : 'bg-black/40'}`}>
      <div ref={rechargeRef} className='w-full max-w-3xl mx-auto'>
        <Zoom in={show} unmountOnExit>
          <div className='w-full bg-white rounded'>
            <div className="p-6 flex items-center justify-between">
              <span className='text-xl font-semibold'>Chi tiết hình ảnh</span>
              <span 
                className="icon w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                onClick={() => setShow(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
              </span>
            </div>

            <div className={`relative p-6 border-y overflow-y-auto max-h-[60vh] flex space-x-4 items-start ${deletePopup ? '!overflow-hidden': ''}`}>
              <div className="w-1/2 rounded border bg-gray-200">
                <div className="p-2 flex justify-end space-x-2">
                  <Tooltip title="Xóa ảnh" placement="top">
                    <span className="icon w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                      onClick={() => setDeletePopup(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>
                    </span>
                  </Tooltip>

                  <Tooltip title="Tải ảnh xuống" placement="top">
                    <span className="icon w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                      onClick={download}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 8zM4 19h16v2H4z"></path></svg>
                    </span>
                  </Tooltip>

                  <Tooltip title="Sao chép liên kết" placement="top">
                    <span className="icon w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                      onClick={copy}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z"></path><path d="m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z"></path></svg>
                    </span>
                  </Tooltip>
                </div>
                <div className="w-full h-36 bg-make-transparent">
                  <img src={data?.url} alt={data?.name} className='w-full h-full object-contain' />
                </div>
                <div className="p-6"></div>
              </div>

              <div className="w-1/2">
                <div className="w-full rounded px-6 py-4 bg-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <p className="uppercase font-semibold">Kích cỡ</p>
                    <p className='mt-1'>{formatBytes(data?.size)}</p>
                  </div>
                  <div>
                    <p className="uppercase font-semibold">Kích thước</p>
                    <p className='mt-1'>{`${data?.naturalWidth}X${data?.naturalHeight}`}</p>
                  </div>
                  <div>
                    <p className="uppercase font-semibold">Ngày</p>
                    <p className='mt-1'>{formatDate(data?.createdAt)}</p>
                  </div>
                  <div>
                    <p className="uppercase font-semibold">Phần MỞ RỘNG</p>
                    <p className='mt-1'>{data?.type.split("/")[1] || "Trống"}</p>
                  </div>
                  <div>
                    <p className="uppercase font-semibold">ID ảnh</p>
                    <p className='mt-1'>{data?.id || "Trống"}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col space-y-4">
                  <div className='flex flex-col'>
                    <label className="font-semibold text-xs mb-1">Tên ảnh</label>
                    <input type="text" className='rounded border px-4 py-2 bg-white focus:ring-2 ring-blue-500' defaultValue={data?.name} required />
                  </div>
                  <div className='flex flex-col'>
                    <label className="font-semibold text-xs mb-1">Đầu đề</label>
                    <input type="text" className='rounded border px-4 py-2 bg-white focus:ring-2 ring-blue-500' defaultValue={data?.caption || ""} />
                  </div>
                  <div className='flex flex-col'>
                    <label className="font-semibold text-xs mb-1">Độ dài ảnh hiện thị</label>
                    <input type="text" className='rounded border px-4 py-2 bg-white focus:ring-2 ring-blue-500' defaultValue={data?.width || ""} />
                  </div>
                  <div className='flex flex-col'>
                    <label className="font-semibold text-xs mb-1">Chiều cao ảnh hiện thị</label>
                    <input type="text" className='rounded border px-4 py-2 bg-white focus:ring-2 ring-blue-500' defaultValue={data?.height || ""} />
                  </div>
                </div>
              </div>

              { deletePopup ? 
                <div className="fixed !ml-0 w-full h-full top-0 left-0 grid place-items-center bg-black/50">
                  <div className="w-72 rounded bg-white overflow-hidden">
                    <h5 className="font-semibold px-6 pt-6">
                      Bạn chắc chắn xóa hình ảnh này
                    </h5>
                    <p className="mt-2 mb-4 px-6 text-sm">
                      Việc hóa hình ảnh sẽ xóa vĩnh viễn chúng ra khỏi cơ sở dữ liệu và không thể khôi phục được.
                    </p>
                    <div className="p-4 bg-gray-200 flex space-x-4 justify-end">
                      <Button color='inherit' size='small' variant='text' onClick={() => setDeletePopup(false)}>Hủy bỏ</Button>
                      <Button variant="contained" size='small' color='error' onClick={deleteImage}>
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div> : null
              }
            </div>

            <div className="p-6 bg-gray-100 flex items-center">
              <Button variant="outlined" size='small' color='inherit' onClick={() => setShow(false)}>
                Hủy bỏ
              </Button>

              <Button className='!ml-auto' variant="contained" size='small' color='primary'
                onClick={save}
              >
                Lưu
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

export default AdminFormFieldImageEdit