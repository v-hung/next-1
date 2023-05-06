import { NextResponse } from 'next/server';
import prisma from "@/lib/server/prismadb";
import bcrypt from 'bcrypt'
import { removeSpace } from '@/lib/utils/validator'
import { signToken } from '@/lib/utils/jwt'
import { cookies } from "next/headers";
import { serialize } from 'cookie';

export async function POST(request: Request) {
  try {
    const { email = "", password = "", remember = false } = await request.json()

    const userData = await prisma.admin.findUnique({
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
      return NextResponse.json("Email not found", { status: 400 })
    }

    if (!await bcrypt.compare(password, userData.password || '')) {
      return NextResponse.json("Password is corrected", { status: 400 })
    }

    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
    }

    const response = NextResponse.next()

    const token = await signToken(user, remember ? "60d" : "1d")

    return NextResponse.json({ user, token }, {
      headers: {
        'Set-Cookie': [
          serialize('token-admin', token, { maxAge: remember ? 86400 * 60 : 86400, path: '/', httpOnly: true })
        ].toString()
      }
    });
  }
  catch (e) {
    console.log(e)
    return NextResponse.json("Error", {status: 400})
  }
}