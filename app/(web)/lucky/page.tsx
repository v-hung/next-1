import ContentLucky from "@/components/web/ContentLucky";
import ContentProfile from "@/components/web/ContentProfile";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

const page = async () => {
  // const userData = await getCurrentUser()

  // if (!userData) {
  //   redirect('/login')
  // }
  return (
    <ContentLucky />
  )
}

export default page