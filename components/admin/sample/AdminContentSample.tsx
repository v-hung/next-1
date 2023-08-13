"use client"
import { Backdrop, Box, CircularProgress, Fade, IconButton, Menu, MenuItem, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, tableCellClasses } from '@mui/material'
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import { useState } from 'react'
import styled from '@emotion/styled';
import Link from 'next/link';
import { Category, Image } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import moment from 'moment';
import FormIOSSwitch from '@/components/FormIOSSwitch';
import { VariantType, enqueueSnackbar } from 'notistack';
import { DeleteDataSampleState, SampleColumnsType, deleteDataSample } from '@/lib/server/sample';
import { useTransition } from "react";

export type SampleStateType = {
  data: any[],
  name: string,
  table_name: string,
  count: number,
  ROWS_PER_PAGES: number[],
  columns: SampleColumnsType[],
}
const AdminContentSample: React.FC<SampleStateType> = ({ 
  data, name, table_name, count, ROWS_PER_PAGES, columns 
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const page = +(searchParams?.get('page') || 1)
  const per_page = +(searchParams?.get('per_page') || ROWS_PER_PAGES[0])

  // const [columnsShow, setColumnsShow] = useState<SampleColumnsType[]>(columns.filter(v => v.show))

  // Avoid a layout jump when reaching the last page with empty rows.
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    let query = new URLSearchParams(searchParams?.toString())

    query.set('page', (newPage + 1).toString())
        
    router.push(`?${query.toString()}`)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let query = new URLSearchParams(searchParams?.toString())

    query.delete('page')
    query.set('per_page', (event.target.value || ROWS_PER_PAGES[0].toString()))
        
    router.push(`?${query.toString()}`)
  }

  // show field
  const [anchorElShowField, setAnchorElShowField] = useState<null | HTMLElement>(null)
  const openShowField = Boolean(anchorElShowField)
  const handleClickShowField = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElShowField(event.currentTarget)
  }
  const handleCloseShowField = () => {
    setAnchorElShowField(null)
  }

  const [columnShowFields, setColumnShowFields] = useState<string[]>(columns.filter(v => v.show).map(e => e.key))
  const handelChangeColumnShowField = (e: React.FormEvent<HTMLInputElement>, key: string) => {
    const { checked: isChecked } = e.target as HTMLInputElement

    if (isChecked) {
      setColumnShowFields([...columnShowFields, key])
    }
    else {
      setColumnShowFields(columnShowFields.filter(item => item !== key))
    }
  }

  // checked
  const [checked, setChecked] = useState<string[]>([])

  const handleSelectAll = () => {
    if (checked.length == data.length) {
      setChecked([])
    }
    else {
      setChecked(data.map(v => v.id))
    }
  }

  const handleSelect = (e: React.FormEvent<HTMLInputElement>) => {
    const { id, checked: isChecked } = e.target as HTMLInputElement

    if (isChecked) {
      setChecked([...checked, id])
    }
    else {
      setChecked(checked.filter(item => item !== id))
    }
  }

  // delete data item
  const [loading, setLoading] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [deleteId, setDeleteId] = useState<string | number | null>(null)

  const handleCloseModalDelete = () => {
    setIsDelete(false)
    setDeleteId(null)
  }

  const showDeleteModal = (id?: number | string) => {
    if (id != undefined) {
      setDeleteId(id)
    }

    setIsDelete(true)
  }

  const handelDeleteData = async (e: React.MouseEvent<HTMLElement>) => {
    try {
      if ((deleteId == null && checked.length == 0) || loading) return
      setLoading(true)

      if (deleteId) {
        await deleteDataSample({ ids: [deleteId], table: table_name})
      }
      else if (checked.length > 0) {
        await deleteDataSample({ ids: checked, table: table_name})
      }

      let variant: VariantType = "success"
      enqueueSnackbar('Thành công', { variant })

      router.refresh()
    } 
    catch (error) {
      console.log({error})
      let variant: VariantType = "error"
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại sau', { variant })
    } 
    finally {
      setLoading(false)
      setIsDelete(false)
    }
  }

  return (
    <>
      <section className="flex items-center space-x-4">
        <div>
          <h3 className="text-2xl font-semibold">{name}</h3>
          {/* <p className="text-sm text-gray-600 mt-1">{count} bản ghi</p> */}
        </div>

        <Button variant="contained" color='error' disabled={checked.length == 0} 
          onClick={() => showDeleteModal()}
          startIcon={(
            <span className="material-symbols-outlined">
              delete
            </span>
          )}
        >
          Xóa bản ghi
        </Button>

        <Button href={`${pathname}/create`} LinkComponent={Link} className='!ml-auto' variant="contained" startIcon={(
          <span className="material-symbols-outlined">
            add
          </span>
        )}>
          Thêm bản ghi mới
        </Button>

        <div className="relative">
          <button className="flex space-x-2 p-2 pr-2 bg-white border rounded shadow" onClick={handleClickShowField}>
            <span className="material-symbols-outlined icon-fill">
              settings
            </span>
            <span className="material-symbols-outlined">
              arrow_drop_down
            </span>
          </button>
          <Menu
            anchorEl={anchorElShowField}
            open={openShowField}
            onClose={handleCloseShowField}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {columns.map(column =>
              <MenuItem key={column.key}>
                <FormIOSSwitch label={column.label} 
                  onChange={(e) => handelChangeColumnShowField(e, column.key)} 
                  checked={columnShowFields.includes(column.key)} className='block w-full'/>
              </MenuItem>
            )}
          </Menu>
        </div>
      </section>

      <section className='mt-8'>
        <Paper sx={{ width: '100%' }} className='rounded overflow-hidden'>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{width: '0px'}} align="left">
                    <input type="checkbox" checked={checked.length == data.length} onChange={handleSelectAll} />
                  </StyledTableCell>
                  {columns.filter(v => columnShowFields.includes(v.key)).map((column) => (
                    <StyledTableCell
                      key={column.key}
                      align="center"
                      // width={column?.width || 'auto'}
                      style={{width: column.key == 'id' ? 0 : 'auto'}}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell align="right" style={{width: '0px', whiteSpace: 'nowrap'}}>Hành động</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? data.map((row) => (
                  <StyledTableRow key={row.id}>
                    <TableCell align="left">
                      <input type="checkbox" id={row.id} checked={checked.includes(row.id)} onChange={handleSelect} />
                    </TableCell>
                    {columns.filter(v => columnShowFields.includes(v.key)).map(column => 
                      <TableCell align="center" key={`${row.id}-${column.key}`}>
                        { column.type == 'date'
                          ? ViewDateField(row[column.key])
                          : column.type == 'publish' ? ViewPublishField(row[column.key])
                          : column.type == 'select' ? ViewSelectField(row[column.key], column.details.list)
                          : column.type == 'image' ? ViewImageField(row[column.key])
                          : column.type == 'relation' ? ViewRelationField(row[column.key], column.details.title)
                          : column.type == 'permissions' ? null
                          : <span>{row[column.key] || ''}</span>
                        }
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <div className="flex space-x-1 items-center justify-end">
                        {/* <Button color='warning' variant='contained' size='small' startIcon={(
                          <span className="material-symbols-outlined">
                            visibility
                          </span>
                        )}>Xem</Button> */}
                        <Button LinkComponent={Link} href={`${pathname}/${row.id}`} color='primary' variant='contained' size='small' startIcon={(
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        )}>Sửa</Button>
                        <Button color='error' variant='contained' size='small' 
                          onClick={() => showDeleteModal(row.id)}
                          startIcon={(
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          )}
                        >Xóa</Button>
                      </div>
                    </TableCell>
                  </StyledTableRow>
                ))
                : <TableRow><TableCell colSpan={"100%" as any} className='!text-center'>Không có bản ghi nào</TableCell></TableRow> }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[...ROWS_PER_PAGES, { label: 'All', value: -1 }]}
            component="div"
            count={count}
            rowsPerPage={per_page}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </section>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isDelete}
        onClose={handleCloseModalDelete}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isDelete}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl rounded shadow bg-white">
            <div className="p-4 flex items-center justify-between">
              <h5 className="text-lg font-medium">Delete Item</h5>
              <button className='flex' onClick={handleCloseModalDelete}>
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            </div>
            <div className="p-4 border-y bg-gray-100">
              Are you sure you want to delete 
              <span className="text-red-600"> {deleteId ? `"${deleteId}"` : checked.join(', ')}</span>
            </div>
            <div className="flex items-center justify-end p-4 space-x-4">
              <Button variant="outlined" color='black' onClick={handleCloseModalDelete}>Cancel</Button>
              <Button variant="contained" color='error' onClick={handelDeleteData}>Delete</Button>
            </div>
          </div>
        </Fade>
      </Modal>

      <Backdrop
        sx={{ color: '#fff', zIndex: '99999' }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#3e3e3e",
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: "#0000000a",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const ViewDateField = (value: Date) => {
  const date = moment(value)
  const formattedDate = date.format('YYYY-MM-DD')
  const formattedTime = date.format('HH:mm:ss')

  return <div className="whitespace-nowrap text-center">
    <p className="text-sm">{formattedDate}</p>
    <p className='text-gray-500 text-xs'>{formattedTime}</p>
  </div>
}

const ViewPublishField = (value: string) => {
  return <div className={`inline-block px-4 py-1.5 rounded text-white ${value == 'draft' ? 'bg-gray-500' : 'bg-purple-500'}`}>
    { value == 'draft' ? 'Nháp' : 'Xuất bản'}
  </div>
}

const ViewImageField = (data: Image | Image[] | null) => {
  if (data == null) {
    return null
  }

  const images = Array.isArray(data) ? data : [data]
  const length = images.length > 2 ? 2 : images.length

  return (
    <div className="flex -space-x-10 justify-center">
      {images.slice(0, length).map((image,i) =>
        <img key={image.id} src={image.url} alt={image.caption || image.name} loading='lazy' 
          className='w-20 h-16 rounded-lg object-cover ring-2 ring-white' />
      )}
      {images.length > length 
        ? <div className="h-16 rounded-lg ring-2 ring-white bg-gray-300/90 flex items-center px-2 font-semibold text-xs">+{images.length - length} more</div>
        : null
      }
    </div>
  )
}

const ViewRelationField = (data: any | any[] | null, title: string) => {
  if (data == null) {
    return null
  }

  const list = Array.isArray(data) ? data : [data]
  const length = list.length > 3 ? 3 : list.length

  return (
    <div className="flex flex-wrap items-center justify-center -mx-1">
      {list.slice(0, length).map((item,i) =>
        <div className="px-1 mb-2" key={item.id}>
          <div key={item.id} className='rounded-full bg-gray-200 px-2 py-1.5 font-semibold text-xs'>{item[title] || ''}</div>
        </div>
      )}
      {list.length > length 
        ? <div className="rounded-lg bg-gray-300/90 flex items-center p-2 font-semibold text-xs">+{list.length - length} more</div>
        : null
      }
    </div>
  )
}

const ViewSelectField = (value: string, list: { title: string, value: string}[]) => {
  const data = list.find(v => v.value == value)?.title || ''
  return (<span>{data}</span>)
}

export default AdminContentSample