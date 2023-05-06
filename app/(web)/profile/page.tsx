import ContentProfile from "@/components/web/content/ContentProfile";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

const page = async () => {
  const userData = await getCurrentUser()

  if (!userData) {
    redirect('/login')
  }
  return (
    <ContentProfile userData={userData} />
  )
}

export default page