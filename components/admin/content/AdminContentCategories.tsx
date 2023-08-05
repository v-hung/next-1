"use client"
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, tableCellClasses } from '@mui/material'
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import React from 'react'
import styled from '@emotion/styled';
import Link from 'next/link';
import { Category } from '@prisma/client';
import { useRouter } from 'next/navigation';

type State = {
  data: any[]
}

const AdminContentCategories: React.FC<State> = ({data}) => {
  const router = useRouter()

  const columns = [
    { id: 'id', label: 'ID', width: "0px"},
    { id: 'title', label: 'Tên'},
    { id: 'age', label: 'Tuổi'},
    { id: 'gender', label: 'Giới tính'},
  ]

  // const data = new Array(30).fill(0).map((v,i) => ({ id: i, name: "Viet Hung", age: 25, gender: "Nam"}))

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <section className="flex items-center space-x-4">
        <div>
          <h3 className="text-2xl font-semibold">Danh mục</h3>
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
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align="center"
                      // width={column?.width || 'auto'}
                      style={{width: column?.width || 'auto'}}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell align="right" style={{width: '0px', whiteSpace: 'nowrap'}}>Hành động</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : data
                ).map((row) => (
                  <StyledTableRow key={row.id}>
                    <TableCell align="left"><input type="checkbox" /></TableCell>
                    <TableCell align="center">{row.id}</TableCell>
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
                ))}
                {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
                { data.length == 0 
                  ? <TableRow><TableCell colSpan={"100%" as any} className='text-center'>Không có bản ghi nào</TableCell></TableRow> : null
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
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
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: "#0000000a",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default AdminContentCategories