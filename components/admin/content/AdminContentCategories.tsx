"use client"
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, tableCellClasses } from '@mui/material'
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import { useState } from 'react'
import styled from '@emotion/styled';
import Link from 'next/link';
import { Category } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export type AdminContentStateType = {
  data: any[],
  name: string,
  count: number,
  ROWS_PER_PAGES: number[],
  columns: {
    key: string,
    label: string,
    type: 'string' | 'number' | 'date'
    show: boolean
  }[]
}

const AdminContentCategories: React.FC<AdminContentStateType> = ({ data, name, count, ROWS_PER_PAGES = [10, 20, 50], columns }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = +(searchParams?.get('page') || 1)
  const per_page = +(searchParams?.get('per_page') || ROWS_PER_PAGES[0])

  const [columnsShow, setColumnsShow] = useState(columns.filter(v => v.show))

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

  return (
    <>
      <section className="flex items-center space-x-4">
        <div>
          <h3 className="text-2xl font-semibold">{name}</h3>
          <p className="text-sm text-gray-600 mt-1">10 bản ghi</p>
        </div>

        <Button variant="contained" color='error' startIcon={(
          <span className="material-symbols-outlined">
            delete
          </span>
        )}>
          Xóa bản ghi
        </Button>

        <Button href='/admin/categories/create' LinkComponent={Link} className='!ml-auto' variant="contained" startIcon={(
          <span className="material-symbols-outlined">
            add
          </span>
        )}>
          Thêm bản ghi mới
        </Button>

        <div className="relative">
          <button className="flex space-x-2 p-2 pr-2 bg-white border rounded">
            <span className="material-symbols-outlined icon-fill">
              settings
            </span>
            <span className="material-symbols-outlined">
              arrow_drop_down
            </span>
          </button>
        </div>
      </section>

      <section className='mt-8'>
        <Paper sx={{ width: '100%' }} className='rounded overflow-hidden'>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{width: '0px'}} align="left"><input type="checkbox" /></StyledTableCell>
                  {columnsShow.map((column) => (
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
                    <TableCell align="left"><input type="checkbox" /></TableCell>
                    {columnsShow.map(v => 
                      <TableCell align="center">{row.id}</TableCell>
                    )}
                    <TableCell align="center">{row.title}</TableCell>
                    <TableCell align="center">{row.image}</TableCell>
                    <TableCell align="center">{row.type}</TableCell>
                    <TableCell align="right">
                      <div className="flex space-x-1 items-center">
                        <Button color='warning' variant='contained' size='small' startIcon={(
                          <span className="material-symbols-outlined">
                            visibility
                          </span>
                        )}>Xem</Button>
                        <Button color='primary' variant='contained' size='small' startIcon={(
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        )}>Sửa</Button>
                        <Button color='error' variant='contained' size='small' startIcon={(
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        )}>Xóa</Button>
                      </div>
                    </TableCell>
                  </StyledTableRow>
                ))
                : <TableRow><TableCell colSpan={"100%" as any} className='text-center'>Không có bản ghi nào</TableCell></TableRow> }
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

export default AdminContentCategories