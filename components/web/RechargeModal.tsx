import { useClickOutside } from '@/lib/clickOutside'
import useModal from '@/stores/web/modal'
import React, { forwardRef, useRef, useState } from 'react'
import Table from './Table'

const RechargeModal = forwardRef((props, ref: any) => {
  const modal = useModal()
  // const rechargeRef = useRef<HTMLDivElement>(null)

  // useClickOutside(rechargeRef, () => {
  //   console.log('fd')
  //   modal.changeModalShow("")
  // })

  const [page, setPage] = useState(1)

  const data1 = [
    {name: "Vietcombank", value: "0123456789999", branch: "Hồ Chí Minh"},
    {name: "Techcombank", value: "0123456789999", branch: "Hồ Chí Minh"},
    {name: "MB Bank", value: "0123456789999", branch: "Hồ Chí Minh"}
  ]
  const titles1 = {name: "Ngân hàng", value: "Số tài khoản", branch: "Chi nhánh"}

  const data2 = [
    {name: "Ví Momo", value: "0399633237"},
    {name: "Thesieure", value: "0399633237"},
    {name: "Viettelpay", value: "0399633237"}
  ]
  const titles2 = {name: "Thẻ", value: "Số tài khoản"}

  return (
    <div {...props} ref={ref} className='w-[768px] max-w-[100vw] bg-gray-100 rounded shadow'>
      <h3 className='text-lg px-6 py-4 border-b'>Hướng dẫn nạp tiền từ ATM hoặc Ví điện tử:</h3>
      <div className="p-6">
        <div className="flex text-center text-white bg-gray-300">
          <div className={`w-1/2 p-4 cursor-pointer ${page == 1 ? 'bg-teal-500' : ''}`}
            onClick={() => setPage(1)}
          >ATM</div>
          <div className={`w-1/2 p-4 cursor-pointer ${page == 2 ? 'bg-teal-500' : ''}`}
            onClick={() => setPage(2)}
          >Ví điện tử</div>
        </div>

        <div className="mt-6">
          {page == 1
            ? <Table data={data1} titles={titles1} />
            : <Table data={data2} titles={titles2} />
          }
        </div>

        <div className="mt-6 text-gray-600">
          <p>Nội dung thanh toán: DangYM + ID thành viên của bạn.</p>
          <p><b>Ví Dụ</b>: ID thành viên của bạn 999 thì bạn chuyển tiền ghi nội dung: "<b>DangYM ID 999</b>"</p>
        </div>
      </div>
    </div>
  )
})

export default RechargeModal