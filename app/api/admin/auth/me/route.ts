import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prismadb";
import bcrypt from 'bcrypt'
import { removeSpace } from '@/lib/utils/validator'
import { signToken, verifyToken } from '@/lib/utils/jwt'
import { cookies } from "next/headers";
import { serialize } from 'cookie';

export async function GET(request: NextRequest) {
  try {
    let cookie = request.cookies.get('token-admin')?.value
    let decode = null
    if (cookie) {
      decode = await verifyToken(cookie)
    }

    return NextResponse.json({ decode });
  }
  catch (e) {
    console.log(e)
    return NextResponse.json("Error", {status: 400})
  }
}