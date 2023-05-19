import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/server/prismadb';
import { useCurrentUserAdmin } from '@/lib/server/helperServer';

export async function POST(request: NextRequest) {
  try {
    const user = await useCurrentUserAdmin(request)

    if (!user) return NextResponse.json("Unauthorized", {status: 401})

    const formData = await request.formData()
    const image = formData.get('image') as string,
          title = formData.get('title') as string,
          type = formData.get('type') as string

    const data = await db.category.create({
      data: {
        title,
        image,
        type,
      }
    })

    return NextResponse.json({data});
  }
  catch (e) {
    console.log(e)
    return NextResponse.json("Error", {status: 400})
  }
}