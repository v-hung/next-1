import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/admin/prismadb";
import bcrypt from 'bcrypt'
import { removeSpace } from '@/lib/utils/validator'
import { signToken, verifyToken } from '@/lib/utils/jwt'
import { cookies } from "next/headers";
import { serialize } from 'cookie';
import db from '@/lib/admin/prismadb';
import { useCurrentUserAdmin } from '@/lib/admin/helperServer';

export async function GET(request: NextRequest) {
  try {
    const user = await useCurrentUserAdmin(request)

    return NextResponse.json({user});
  }
  catch (e) {
    console.log(e)
    return NextResponse.json("Error", {status: 400})
  }
}