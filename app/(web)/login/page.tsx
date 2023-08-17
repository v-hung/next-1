import ContentLogin from "@/components/web/content/ContentLogin"
import { getCurrentUser } from "@/lib/web/getCurrentUser"
import { redirect } from "next/navigation"

const page = async () => {
  const userData = await getCurrentUser()

  if (userData) {
    redirect('/')
  }
 
  return (
    <ContentLogin />
  )
}

export default page