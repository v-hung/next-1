import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import db from "./prismadb";
import { verifyToken } from "../utils/jwt";

export const useCurrentUserAdmin = async (request?: NextRequest) => {
  let cookie = null

  if (request) {
    cookie = request.headers.get('authorization')?.split(' ')[1] || request.cookies.get('token-admin')?.value
  }
  else {
    cookie = cookies().get('token-admin')?.value
  }

  let adminId = null

  if (cookie) {
    let temp = await verifyToken(cookie)
    if (temp?.payload.sub) {
      adminId = temp.payload.sub
    }
  }

  if (!adminId) {
    return null
  }

  const user = await db.admin.findUnique({
    where: {
      id: +adminId
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true
    }
  })

  return user
}

// export