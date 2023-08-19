"use client"
import {useEffect, useState} from 'react'
import { File } from '@prisma/client';
import AdminFileModal from './image/FileModal';
import FilesSlide from './image/FileSlide';
import { FileTypeState } from '@/lib/admin/sample';

type AdminFormFieldFileType = {
  label?: string,
  name?: string
  required?: boolean,
  defaultValue?: File[] | File | null,
  value?: string,
  onChange?: (id: string) => void
  className?: string,
  details: {
    multiple?: boolean,
    tableName: string,
    onlyTable?: boolean
    myself?: boolean,
    fileTypes?: FileTypeState
  }
}

const AdminFormFieldFile: React.FC<AdminFormFieldFileType> = ({
  name,
  label,
  required = false,
  defaultValue,
  className,
  onChange,
  details: {
    multiple = false,
    tableName,
    onlyTable = true,
    myself,
    fileTypes = ['image']
  }
}) => {
  const [value, setValue] = useState<string>("")
  const [showModal, setShowModal] = useState(false)
  const [files, setFiles] = useState<File[]>(defaultValue ? Array.isArray(defaultValue) ? defaultValue : [defaultValue] : [])

  const handelShowModal = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setShowModal((state) => state = !state)
  }

  useEffect(() => {
    let tempValue = multiple ? JSON.stringify(files.map(v => v.id)) : files.length > 0 ? files[0].id : ""
    setValue(tempValue)

    if (typeof onChange == 'function') 
      onChange(tempValue)
  }, [files])

  return (
    <div className={className}>
      { label
        ? <p className="text-sm font-medium mb-1 capitalize">{label} { required && <span className="text-red-500">*</span> }</p>
        : null
      }
      <div className={`h-40 border rounded bg-white ${className}`}>
        <input type="hidden" name={name} value={value} className='sr-only' required={required} />
        <div className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
          onClick={handelShowModal}
        >
          { files.length > 0
            ? <FilesSlide files={files} />
            : <>
              <span className="icon-svg w-10 h-10 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"></path><path d="m8 11-3 4h11l-4-6-3 4z"></path><path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>
              </span>
              <span className="mt-2 text-xs font-semibold">Chọn để thêm một tài sản</span>
            </>
          }
        </div>
      </div>

      <AdminFileModal 
        onlyTable={onlyTable} 
        myself={myself} 
        tableName={tableName} 
        show={showModal} 
        setShow={setShowModal} 
        multiple={multiple} 
        data={files} 
        setData={setFiles} 
        fileTypes={fileTypes}
      />
    </div>
  )
}

export default AdminFormFieldFile