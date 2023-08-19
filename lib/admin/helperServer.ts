'use server'

import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import db from "./prismadb";
import { signToken, verifyToken } from "../utils/jwt";
import { redirect } from "next/navigation";
import { Admin, File, PermissionsOnRoles, Role } from "@prisma/client";
import { exclude } from "../utils/helper";
import { removeSpace } from "../utils/validator";
import bcrypt from 'bcrypt'

export type AdminUserType = Omit<Admin, "password"> & {
  image: File | null
  role: Role & {
    permissions: PermissionsOnRoles[]
  }
} | null

export const useCurrentUserAdmin = async (request?: NextRequest) => {
  try {
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
      throw ""
    }

    const user = await db.admin.findUnique({
      where: {
        id: adminId
      },
      include: {
        image: {
          where: {
            mime: {
              startsWith: 'image'
            }
          }
        },
        role: {
          include: {
            permissions: true
          }
        }
      }
    })

    const userWithoutPassword: AdminUserType = exclude(user, ['password'])

    return user
  } catch (error) {
    console.log({error})
    return null
  }
}

export const logoutUserAdmin = async () => {
  'use server'
  cookies().delete('token-admin')
  redirect('/admin')
}

export const loginUserAdmin = async ({
  email, password, remember
}: {
  email: string,
  password: string,
  remember: string
}) => {
  try {
    const userData = await db.admin.findUnique({
      where: {
        email: removeSpace(email)
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        password: true
      }
    })

    if (!userData) {
      throw "Email not found"
    }

    if (!await bcrypt.compare(password, userData.password || '')) {
      throw "Password is corrected"
    }

    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
    }

    const token = await signToken(user.id.toString(), remember ? "60d" : "1d")

    cookies().set({
      name: 'token-admin',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: remember ? 86400 * 60 : 86400
    })

    return { user }

  } catch (error) {
    console.log({error})
    throw (typeof error === "string" && error != "") ? error : 'Có lỗi xảy ra vui lòng thử lại sau'
  }
}