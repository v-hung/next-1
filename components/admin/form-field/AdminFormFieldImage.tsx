"use client"
import {useEffect, useState} from 'react'
import { Image } from '@prisma/client';
import AdminImageModal from './image/ImageModal';
import ImageSlide from './image/ImageSlide';

type AdminFormFieldImageType = {
  label?: string,
  name: string
  required?: boolean,
  defaultValue?: Image[] | Image | null,
  value?: string,
  onChange?: (id: string) => void
  className?: string,
  details: {
    multiple?: boolean,
    tableName: string,
    onlyTable?: boolean
    myself?: boolean,
  }
}

const AdminFormFieldImage: React.FC<AdminFormFieldImageType> = ({
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
  }
}) => {
  const [value, setValue] = useState<string>("")
  const [showModal, setShowModal] = useState(false)
  const [images, setImages] = useState<Image[]>(defaultValue ? Array.isArray(defaultValue) ? defaultValue : [defaultValue] : [])

  const handelShowModal = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setShowModal((state) => state = !state)
  }

  useEffect(() => {
    let tempValue = multiple ? JSON.stringify(images.map(v => v.id)) : images.length > 0 ? images[0].id : ""
    setValue(tempValue)

    if (typeof onChange == 'function') 
      onChange(tempValue)
  }, [images])

  return (
    <div className={className}>
      { label
        ? <p className="text-sm font-semibold mb-1 capitalize">{label} { required && <span className="text-red-500">*</span> }</p>
        : null
      }
      <div className={`h-40 border rounded bg-white ${className}`}>
        <input type="hidden" name={name} value={value} className='sr-only' required={required} />
        <div className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
          onClick={handelShowModal}
        >
          { images.length > 0
            ? <ImageSlide images={images} />
            : <>
              <span className="icon-svg w-10 h-10 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"></path><path d="m8 11-3 4h11l-4-6-3 4z"></path><path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>
              </span>
              <span className="mt-2 text-xs font-semibold">Chọn để thêm một tài sản</span>
            </>
          }
        </div>
      </div>

      <AdminImageModal onlyTable={onlyTable} myself={myself} tableName={tableName} show={showModal} setShow={setShowModal} multiple={multiple} data={images} setData={setImages} />
    </div>
  )
}

export default AdminFormFieldImage