"use client"
import {useEffect, useRef, useState} from 'react'
import { useClickOutside } from '@/lib/clickOutside';
import { File } from '@prisma/client';
import { Button, Tooltip, Zoom } from '@mui/material';
import { formatBytes, formatDate } from '@/lib/utils/helper';
import { promiseFunction } from '@/lib/admin/promise';

type EditModalType = {
  show: boolean,
  setShow: (data: boolean) => void,
  data: File | null,
  setData: (data: any) => void,
}

const AdminFileEdit: React.FC<EditModalType> = ({show, setShow, data, setData}) => {
  const rechargeRef = useRef<HTMLDivElement>(null)

  useClickOutside(rechargeRef, () => {
    setShow(false)
  })

  const [loading, setLoading] = useState(false)
  const [deletePopup, setDeletePopup] = useState(false)

  const save = async () => {
    await promiseFunction({
      loading,
      setLoading,
      callback: async () => {
        
      }
    })
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

  const deleteFile = () => {

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
                className="w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer flex items-center justify-center"
                onClick={() => setShow(false)}
              >
                <span className="icon">close</span>
              </span>
            </div>

            <div className={`relative p-6 border-y overflow-y-auto max-h-[60vh] flex space-x-4 items-start ${deletePopup ? '!overflow-hidden': ''}`}>
              <div className="w-1/2 rounded border bg-gray-200">
                <div className="p-2 flex justify-end space-x-2">
                  <Tooltip title="Xóa ảnh" placement="top">
                    <span className="icon w-8 h-8 !text-lg rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                      onClick={() => setDeletePopup(true)}
                    >
                      delete
                    </span>
                  </Tooltip>

                  <Tooltip title="Tải ảnh xuống" placement="top">
                    <span className="icon w-8 h-8 !text-lg rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                      onClick={download}
                    >
                      download
                    </span>
                  </Tooltip>

                  <Tooltip title="Sao chép liên kết" placement="top">
                    <span className="icon w-8 h-8 !text-lg rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                      onClick={copy}
                    >
                      content_copy
                    </span>
                  </Tooltip>
                </div>
                <div className="w-full h-36 bg-make-transparent">
                  <img src={data?.url} alt={data?.name} className='w-full h-full object-contain' loading='lazy' />
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
                    <p className='mt-1'>{data?.mime.split("/")[0] || "Trống"}</p>
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
                      <Button variant="contained" size='small' color='error' onClick={deleteFile}>
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
        <span className="icon animate-spin">
          loading
        </span>
      </div> : null }
    </div>
  )
}

export default AdminFileEdit