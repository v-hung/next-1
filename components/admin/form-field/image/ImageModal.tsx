"use client"
import {useEffect, useRef, useState} from 'react'
import { useClickOutside } from '@/lib/clickOutside';
import { FolderImage, Image } from '@prisma/client';
import { Button, Zoom } from '@mui/material';
import { getScrollbarWidth } from '@/lib/utils/helper';
import AdminImageAdd from './ImageModalAdd';
import AdminImageEdit from './ImageModalEdit';
import AdminImageModalAddFolder from './ImageModalAddFolder';
import { getListFolderImage } from '@/lib/admin/imageFormField';

type ModalType = {
  show: boolean,
  setShow: (data: boolean) => void,
  multiple?: boolean,
  data: Image[]
  setData: (data: Image[]) => void,
  tableName: string,
  onlyTable?: boolean,
  myself?: boolean
}

const AdminImageModal: React.FC<ModalType> = ({
  show, setShow, multiple, data, setData, tableName, onlyTable, myself
}) => {
  const rechargeRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [folders, setFolders] = useState<FolderImage[]>([])
  const [folderParentId, setFolderParentId] = useState<string | undefined>(data.length > 0 ? (data[0].folderImageId || undefined) : undefined)
  const [folderParents, setFolderParents] = useState<FolderImage[]>([])

  const [selects, setSelects] = useState<Image[]>(data)
  const [checked, setChecked] = useState<string[]>(data.map(v => v.id))

  const [page, setPage] = useState(0)

  const [addModal, setAddModal] = useState(false)
  const [dataUpload, setDataUpload] = useState<Image[]>([])

  const [editModal, setEditModal] = useState(false)
  const [dataEdit, setDataEdit] = useState<Image | null>(null)

  const [addFolderModal, setAddFolderModal] = useState(false)
  const [dataFolderEdit, setDataFolderEdit] = useState<FolderImage | null>(null)
  const [dataFolderAdd, setDataFolderAdd] = useState<FolderImage | null>(null)

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
      const { folderParents, folders, images } = await getListFolderImage({
        parentId: folderParentId,
        tableName: onlyTable ? tableName : undefined,
        myself
      })

      setImages(images)
      setFolders(folders)
      setFolderParents(folderParents)

    } catch (error) {
      return {data: []}
    } finally {
      setLoading(false)
    }
  }

  // reload data in folder
  useEffect(() => {
    fetchImages()
  }, [folderParentId])

  // upload images
  useEffect(() => {
    if (dataUpload.length == 0) return

    fetchImages()
    
    // checked
    var updatedList: string[] = []
    if (multiple) {
      updatedList = [...checked, ...dataUpload.map(v => v.id)]
      setSelects(state => [...state, ...dataUpload])
    }
    else {
      updatedList = [dataUpload[0].id]
      setSelects([dataUpload[0]])
    }

    setChecked(updatedList)
    setPage(1)

  }, [dataUpload])

  const editImage = (image: Image) => {
    setDataEdit(image)
    setEditModal(true)
  }

  // add or edit folder
  useEffect(() => {
    if (dataFolderAdd) {
      let findDataFolder = folders.some(v => v.id == dataFolderAdd.id)

      if (findDataFolder) {
        setFolders(state => state.map(v => (v.id == dataFolderAdd.id) ? dataFolderAdd : v))
      }
      else {
        setFolders(state => [...state, dataFolderAdd])
      }
    }
  }, [dataFolderAdd])

  const handelAddEditFolder = (e: React.MouseEvent, dataEdit?: FolderImage) => {
    e.stopPropagation()
    if (dataEdit) {
      setDataFolderEdit(dataEdit)
    }
    else {
      setDataFolderEdit(null)
    }
    setAddFolderModal(true)
  }

  // change folder parent
  const handelClickFolder = (id: string) => {
    setFolderParentId(id)
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
    <div className={`fixed w-full h-full top-0 left-0 px-4 !m-0 overflow-hidden flex flex-col items-center justify-center z-[200]
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
                className="w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer flex items-center justify-center"
                onClick={() => setShow(false)}
              >
                <span className="icon">close</span>
              </span>
            </div>

            <div className="border-y">
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
                <Button className='!ml-auto' variant="outlined" size='small' color='primary'
                  onClick={(e) => handelAddEditFolder(e)}
                >
                  Thêm thư mục
                </Button>
                <Button className='!ml-4' variant="contained" size='small' color='primary'
                  onClick={() => setAddModal(true)}
                >
                  Thêm ảnh
                </Button>
              </div>

              <div hidden={page != 0}>
                { loading
                  ? <div className="w-full p-6 grid place-items-center">
                    <span className="icon animate-spin">
                      progress_activity
                    </span>
                  </div>
                  : <div className="">
                    { folderParents.length > 0
                      ? <div className="flex px-6 py-4 items-center bg-gray-100">
                        <span className="icon flex-none hover:bg-text-500 cursor-pointer"
                          onClick={() => setFolderParentId(undefined)}  
                        >folder_copy</span>
                        <div className="flex-grow min-w-0 flex flex-row-reverse justify-end items-center">
                          {folderParents.map((v, i) => 
                            <div key={v.id}>
                              <span className='mx-2'>/</span>
                              <span className={`text-sm hover:bg-text-500 ${i == 0 ? '' : 'text-blue-600 hover:underline cursor-pointer'}`}
                                onClick={() => setFolderParentId(v.id)}  
                              >{i == 4 ? '...' : v.name}</span>
                            </div>  
                          )}
                        </div>
                      </div>
                      : null
                    }
                    <div className='overflow-y-auto max-h-[60vh] pb-6'>
                      { folders.length > 0
                        ? <div className="mt-6 px-6">
                          <p className="font-semibold text-base mb-2">Thư mục ({folders.length})</p>
                          <div className="grid gap-4 grid-flow-col auto-cols-[100px]">
                            { folders.map(v =>
                              <div key={v.id} className="flex flex-col items-center space-y-1 px-2 py-2 bg-blue-50 rounded relative group cursor-pointer"
                                onClick={() => handelClickFolder(v.id)}
                              >
                                <span className="material-symbols-outlined icon-fill !text-5xl text-blue-500">folder</span>
                                <span className="line-clamp-3 text-center text-sm">{v.name}</span>
                                <div className="absolute top-0 right-2 w-8 h-8 rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer hidden group-hover:block"
                                  onClick={(e) => handelAddEditFolder(e,v)}
                                >
                                  <span className="icon !text-[18px]">edit</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        : null
                      }
                    
                      <div className="mt-6 px-6">
                        <p className="font-semibold text-base mb-2">Ảnh ({images.length})</p>
                        { images.length > 0
                          ? <div className="grid gap-4" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))'}}>
                            { images.map((v,i) =>
                              <div className="rounded border overflow-hidden" key={v.id}>
                                <div className="relative w-full h-24 bg-make-transparent group">
                                  <img src={v.url} alt="" className="w-full h-full object-contain" loading='lazy' />
                                  <div className="absolute top-2 left-2">
                                    <input type="checkbox" value={v.id} checked={isChecked(v.id)} onChange={(e) => handleCheck(e)} />
                                  </div>
                                  <span
                                    className="absolute top-2 right-2 material-symbols-outlined w-8 h-8 !text-[18px] rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer hidden group-hover:block"
                                    onClick={() => editImage(v)}
                                  >
                                    edit
                                  </span>
                                </div>
                                <div className="p-4 py-2 flex justify-between items-start border-t">
                                  <div className="flex-grow min-w-0 text-xs">
                                    <p className="font-semibold break-words">{v.name}</p>
                                    <p className="uppercase">{v.type}</p>
                                  </div>
                                  <div className="flex-none text-[10px] p-1 py-0.5 font-semibold rounded bg-gray-100">IMAGE</div>
                                </div>
                              </div>
                            )}
                          </div>
                          : <p>Không có ảnh nào</p>
                        }
                      </div>
                    </div>
                  </div>
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
                  ? <div className="px-6 my-6 grid gap-4 overflow-y-auto max-h-[60vh]" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))'}}>
                    { selects.map((v,i) =>
                      <div className="rounded border overflow-hidden" key={v.id}>
                        <div className="relative w-full h-24 bg-make-transparent">
                          <img src={v.url} alt="" className="w-full h-full object-contain" loading='lazy' />
                          <div className="absolute top-2 left-2">
                            <input type="checkbox" value={v.id} checked={isChecked(v.id)} onChange={(e) => handleCheck(e)} />
                          </div>
                          <span
                            className="absolute top-2 right-2 material-symbols-outlined w-8 h-8 !text-[18px] rounded border p-1.5 bg-white hover:bg-gray-100 cursor-pointer hidden group-hover:block"
                            onClick={() => editImage(v)}
                          >
                            edit
                          </span>
                        </div>
                        <div className="p-4 py-2 flex justify-between items-start border-t">
                          <div className="flex-grow min-w-0 text-xs">
                            <p className="font-semibold break-words">{v.name}</p>
                            <p className="uppercase">{v.type}</p>
                          </div>
                          <div className="flex-none text-[10px] p-1 py-0.5 font-semibold rounded bg-gray-100">IMAGE</div>
                        </div>
                      </div>
                    )}
                  </div>
                  : <div className='px-6 my-6'>Không có ảnh nào được chọn</div>
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
        <AdminImageAdd tableName={tableName} folderImageId={folderParentId} show={addModal} setShow={setAddModal} setData={setDataUpload} />
        <AdminImageEdit show={editModal} setShow={setEditModal} data={dataEdit} setData={setDataEdit} />
        <AdminImageModalAddFolder tableName={tableName} show={addFolderModal} parentId={folderParentId} setShow={setAddFolderModal} data={dataFolderEdit} setData={setDataFolderAdd} />
      </div>
      {/* <div className="flex-grow"></div> */}
    </div>
  )
}

export default AdminImageModal