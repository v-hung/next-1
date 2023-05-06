import db from "@/lib/server/prismadb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async (req: any, res: any) => {
  try {
    const session = await getServerSession(req, res, authOptions)
    console.log(1, session)
    
    if (!session?.user?.email) {
      throw ""
    }
  
    const currentUser = await db.user.findUnique({
      where: {
        email: session.user.email as string
      }
    })
  
    res.status(200).json(currentUser)

  } catch(e) {
    res.status(401).json({ error: 'Authentication' })
  }
}