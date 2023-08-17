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
  catch (error: any) {
    let variant: VariantType = "error"
    enqueueSnackbar((typeof error?.message === "string") ? (
      error.message.startsWith("Error: ") ? error.message.substring("Error: ".length) : error.message
    ) : 'Có lỗi xảy ra, vui lòng thử lại sau', { variant })
  } 
  finally {
    if (typeof setLoading == "function")
      setLoading(false)
  }
}