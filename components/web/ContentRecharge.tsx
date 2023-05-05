"use client"
import Container from '@/components/web/Container'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material'
import Button from '@mui/material/Button';
import useModal from '@/stores/web/modal'

const ContentRecharge = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const recharge = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    try {
      setLoading(true)
      setError("")
      setSuccess(false)
      
      await new Promise((res) => setTimeout(() => res(1), 1000))
      
      const { email, password, remember } = Object.fromEntries(
        new FormData(e.target as HTMLFormElement),
      );
      
      const res = await fetch("/fdasf")
      
      if (!res?.ok) {
        throw await res.text()
      }

      setSuccess(true)
    } 
    catch (error) {
      setError("Đã có lỗi xảy ra vui lòng thử lại sau")
      console.log({error}) 
    } finally {
      setLoading(false)
    }
  }

  const modal = useModal()

  const showModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    modal.changeModalShow("recharge")
  }

  return (
    <Container className="py-8">
      <form 
        className={`relative w-full max-w-md mx-auto border bg-white px-6 py-8 rounded ${error != "" ? "border-red-500" : ""}`}
        onSubmit={recharge}
      >
        <h3 className="font-semibold text-center text-xl">Nạp thẻ</h3>
        <div className="mt-6 flex flex-col space-y-4">
          <FormControl fullWidth>
            <InputLabel id="type">Loại thẻ</InputLabel>
            <Select
              labelId="type"
              name='type'
              defaultValue=""
              label="Loại thẻ"
              required={true}
            >
              <MenuItem value="viettel">Viettel</MenuItem>
              <MenuItem value="mobi">Mobi</MenuItem>
              <MenuItem value="vina">Vina</MenuItem>
              <MenuItem value="vnmobi">VNMOBI</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="card">Mệnh giá thẻ</InputLabel>
            <Select
              labelId="card"
              name='card'
              label="Mệnh giá thẻ"
              defaultValue=""
              required={true}
            >
              <MenuItem value="10k">10k</MenuItem>
              <MenuItem value="20k">20k</MenuItem>
              <MenuItem value="50k">50k</MenuItem>
              <MenuItem value="100k">100k</MenuItem>
              <MenuItem value="100k">100k</MenuItem>
            </Select>
          </FormControl>

          <TextField name='serial' label="Serial thẻ" variant="outlined" required={true} />

          <TextField name='code' label="Mã thẻ" variant="outlined" required={true} />

          { error ? <div className="p-2 rounded border-red-300 bg-red-100 text-red-500">{error}</div> : null }

          <Button type='submit' variant="contained">Nạp tiền</Button>

          <Button variant="contained" color='secondary' onClick={(e) => showModal(e)}>Nạp qua ví điện tử</Button>
        </div>

        { loading
          ? <div className="absolute w-full h-full top-0 left-0 bg-white/70 grid place-items-center">
            <span className="icon animate-spin">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"></path></svg>
            </span>
          </div>
        : null}
      </form>
    </Container>
  )
}

export default ContentRecharge