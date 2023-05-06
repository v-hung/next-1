import ContentRecharge from "@/components/web/content/ContentRecharge";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

const page = async () => {
  const userData = await getCurrentUser()

  if (!userData) {
    redirect('/login')
  }
  return (
    <ContentRecharge />
  )
}

export default page