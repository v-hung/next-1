import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/server/prismadb';
import { useCurrentUserAdmin } from '@/lib/server/helperServer';

export async function GET(request: NextRequest) {
  try {
    const user = await useCurrentUserAdmin(request)

    if (!user) return NextResponse.json("Unauthorized", {status: 401})

    const data = await db.category.findMany()

    return NextResponse.json({data});
  }
  catch (e) {
    console.log(e)
    return NextResponse.json("Error", {status: 400})
  }
}