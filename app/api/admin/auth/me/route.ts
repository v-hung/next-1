import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prismadb";
import bcrypt from 'bcrypt'
import { removeSpace } from '@/lib/utils/validator'
import { signToken, verifyToken } from '@/lib/utils/jwt'
import { cookies } from "next/headers";
import { serialize } from 'cookie';
import db from '@/lib/prismadb';

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get('adminId') || 0

    if (adminId == 0) return NextResponse.json("Error", {status: 400})

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

    return NextResponse.json({user});
  }
  catch (e) {
    console.log(e)
    return NextResponse.json("Error", {status: 400})
  }
}