"use client"
import { SceneDataState } from '@/app/admin/(admin)/scenes/page'
import { removeAccents } from '@/lib/utils/helper'
import { Button, TextField } from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'

const ListScene = ({
  scenes, openModalAdd, setOpenModalAdd
}: {
  scenes: SceneDataState[],
  openModalAdd: boolean,
  setOpenModalAdd: Dispatch<SetStateAction<boolean>>
}) => {

  const [search, setSearch] = useState('')

  const scenesFilter = scenes.filter(v => removeAccents(v.name.toLowerCase()).indexOf(removeAccents(search.toLowerCase())) >= 0)

  return (
    <div className='w-full h-full flex flex-col space-y-4 py-4'>
      <div className="px-4">
        <TextField InputProps={{
            startAdornment: (
              <span className='icon'>search</span>
            )
          }} fullWidth={true} size='small' placeholder='Tìm kiếm...' 
          value={search}
          onChange={(e => setSearch(e.target.value))}
        />
      </div>

      <div className='border-b mx-4'></div>

      <div className="flex-grow min-h-0 flex flex-col space-y-2 overflow-y-auto px-4">
        { scenesFilter.length > 0 ? scenes.map(v =>
            <button key={v.id} className="flex items-center space-x-4 rounded hover:bg-gray-200 px-2 py-2 group ">
              <span className="icon">location_on</span>
              <span className="flex-grow min-w-0 text-left">{v.name}</span> 
              <span className="flex-none icon invisible pointer-events-none group-hover:visible 
                group-hover:pointer-events-auto !ml-auto text-teal-500 hover:text-teal-600">
                drag_indicator
              </span>
            </button>
          )
          : <p className="p-2">Không tìm thấy điểm chụp nào</p>
        }
      </div>

      <Button variant='contained' startIcon={(
        <span className='icon'>save</span>
      )} className='!mx-4' >Lưu vị trí</Button>

      <Button variant='outlined' startIcon={(
        <span className='icon'>add</span>
      )} className='!mx-4' onClick={() => setOpenModalAdd(true)} >Thêm bối cảnh mới</Button>

    </div>
  )
}

export default ListScene