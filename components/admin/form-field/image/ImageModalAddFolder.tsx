"use client"
import {FormEvent, useEffect, useRef, useState} from 'react'
import { useClickOutside } from '@/lib/clickOutside';
import { Button, Zoom } from '@mui/material';
import { FolderImage } from '@prisma/client';
import AdminFormFieldText from '../AdminFormFieldText';
import moment from 'moment';
import { createEditFolder } from '@/lib/server/imageFormField';

type AddModalType = {
  show: boolean,
  setShow: (data: boolean) => void,
  data: FolderImage | null
  setData: (data: FolderImage) => void,
  tableName: string
}

const AdminImageModalAddFolder: React.FC<AddModalType> = ({show, setShow, data, setData, tableName}) => {
  const rechargeRef = useRef<HTMLDivElement>(null)

  useClickOutside(rechargeRef, () => {
    setShow(false)
  })

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')

  const handelSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    try {
      setLoading(true)

      const { folder } = await createEditFolder({
        name: name,
        tableName: tableName
      })

      setShow(false)
      setData(folder)
      
    } catch (e) {

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`fixed w-full h-full top-0 left-0 px-4 py-4 overflow-hidden flex flex-col items-center justify-center z-[200]
      ${!show ? "pointer-events-none" : 'bg-black/40'}`}>
      <div ref={rechargeRef} className='w-full max-w-2xl mx-auto'>
        <Zoom in={show} unmountOnExit>
          <div className='w-full bg-white rounded'>
            <div className="p-6 flex items-center justify-between">
              <span className='text-xl font-semibold'>{data ? 'Sửa' : 'Thêm'} thư mục mới</span>
              <span 
                className="w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer flex items-center justify-center"
                onClick={() => setShow(false)}
              >
                <span className="icon">close</span>
              </span>
            </div>

            <div className="p-6 border-y">
              { data
                ? <div className="p-4 rounded bg-gray-50 flex space-x-4 text-xs text-gray-800 mb-4">
                  <div className='w-1/2'>
                    <p className="uppercase">Creation Date</p>
                    <p>{moment(data.createdAt).format('DD/MM/YYYY')}</p>
                  </div>
                  <div className='w-1/2'>
                    <p className="uppercase">Update Date</p>
                    <p>{moment(data.updatedAt).format('DD/MM/YYYY')}</p>
                  </div>
                </div>
                : null
              }

              <AdminFormFieldText label='Tên' name='name' value={name} onChange={(e) => setName(e.target.value)} defaultValue={data?.name} />
            </div>

            <div className="p-6 bg-gray-100 flex items-center">
              <Button variant="outlined" size='small' color='inherit' onClick={() => setShow(false)}>
                Hủy bỏ
              </Button>

              <Button className='!ml-auto' variant="contained" size='small' color='primary'
                onClick={handelSubmit}
              >
                Tạo mới
              </Button>
            </div>
          </div>
        </Zoom>
      </div>

      { loading ? <div className="absolute w-full h-full top-0 left-0 bg-white/30 grid place-items-center pointer-events-auto">
        <span className="icon-svg animate-spin w-10 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"></path></svg>
        </span>
      </div> : null }
    </div>
  )
}

export default AdminImageModalAddFolder