"use client"
import {useEffect, useRef, useState} from 'react'
import { useClickOutside } from '@/lib/clickOutside';
import { Button, Zoom } from '@mui/material';
import { VariantType, enqueueSnackbar } from 'notistack';
import { uploadImages } from '@/lib/server/imageFormField';

type AddModalType = {
  show: boolean,
  setShow: (data: boolean) => void,
  setData: (data: any) => void,
  tableName: string,
  folderImageId?: string
}

const AdminImageAdd: React.FC<AddModalType> = ({show, setShow, setData, tableName, folderImageId}) => {
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

      var formData = new FormData()

      files.map(v => {
        formData.append('images[]', v.file)
      })

      const { images } = await uploadImages({
        formData: formData,
        tableName: tableName,
        folderImageId: folderImageId
      })

      files.forEach((v,i) => {
        URL.revokeObjectURL(files[i].preview)
      })
      setFiles([])

      setShow(false)
      setData(images)
      
    } catch (error) {
      let variant: VariantType = "error"
      enqueueSnackbar((typeof error === "string") ? error : 'Có lỗi xảy ra, vui lòng thử lại sau', { variant })
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
    <div className={`fixed w-full h-full top-0 left-0 px-4 py-4 overflow-hidden flex flex-col items-center justify-center z-[200]
      ${!show ? "pointer-events-none" : 'bg-black/40'}`}>
      <div ref={rechargeRef} className='w-full max-w-3xl mx-auto'>
        <Zoom in={show} unmountOnExit>
          <div className='w-full bg-white rounded'>
            <div className="p-6 flex items-center justify-between">
              <span className='text-xl font-semibold'>Thêm ảnh mới</span>
              <span 
                className="w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer flex items-center justify-center"
                onClick={() => setShow(false)}
              >
                <span className="icon">close</span>
              </span>
            </div>

            <div className="py-6 pt-0 border-y">
              { isAddFiles
                ? <>
                  <div className="px-6 pt-6 flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold">{files.length} tài sản đã sẵn sàng để tải lên</h5>
                      <p className="text-sm mt-1 text-gray-600">Quản lý tài sản trước khi thêm chúng vào thư viện phương tiện</p>
                    </div>
                    <Button variant="contained" onClick={(e) => setIsAddFiles(false)}>Thêm file</Button>
                  </div>
                  <div className="px-6 mt-6 grid gap-4 overflow-y-auto max-h-[60vh]" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))'}}>
                    { files.map((v,i) =>
                      <div className="rounded border overflow-hidden" key={i}>
                        <div className="relative w-full h-24 bg-make-transparent">
                          <img src={v.preview} alt="" className="w-full h-full object-contain" loading='lazy' />
                          <span
                            className="absolute top-2 right-2 icon w-8 h-8 !text-[18px] rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer"
                            onClick={() => {removeFileChange(i)}}
                          >
                            delete
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
                  <div className="px-6 flex items-center border-b">
                    <div className="p-4 uppercase text-xs font-semibold text-blue-600 border-b border-blue-600">
                      <span>Từ máy tính của bạn</span>
                    </div> 
                  </div>
                  <div className="px-6 mt-6 overflow-y-auto max-h-[60vh] flex flex-col items-center justify-center w-full border border-dashed py-12 rounded bg-gray-50">
                    <span className="icon text-blue-600 !text-6xl">
                      add_photo_alternate
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
        <span className="icon animate-spin">
          progress_activity
        </span>
      </div> : null }
    </div>
  )
}

export default AdminImageAdd