import { VariantType, enqueueSnackbar } from "notistack"

export const promiseFunction = async ({
  loading, setLoading, callback
}: {
  loading?: boolean,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  callback: () => Promise<void>
}) => {
  try {
    if (loading) return
    if (typeof setLoading == "function")
      setLoading(true)

    await callback()
    
    let variant: VariantType = "success"
    enqueueSnackbar('Thành công', { variant })
  } 
  catch (error) {
    let variant: VariantType = "error"
    enqueueSnackbar((typeof error === "string") ? error : 'Có lỗi xảy ra, vui lòng thử lại sau', { variant })
  } 
  finally {
    if (typeof setLoading == "function")
      setLoading(false)
  }
}