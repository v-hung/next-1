import SettingContentAdmin from '@/components/admin/content/SettingContentAdmin'
import db from '@/lib/server/prismadb'
import { SampleColumnsType, SampleFieldAndDetailsType } from '@/lib/server/sample'
import { Setting, GroupSetting } from '@prisma/client'
import React from 'react'

export type GroupSettingType = Omit<GroupSetting, 'settings'> & {
  settings: SettingType[]
}

export type SettingType = (Omit<Setting, 'type' | 'details'>) & {
  type: SampleFieldAndDetailsType['type']
  details: SampleFieldAndDetailsType['details']
}

const getData = async () => {
  const data = await db.groupSetting.findMany({
    include: {
      settings: true
    }
  })

  const groupSettings = data.map(v => ({
    ...v,
    settings: v.settings.map(v2 => ({
      ...v2,
      details: v2.details ? JSON.parse(v2.details) : {}
    }))
  })) as any[] as GroupSettingType[]
 
  return groupSettings
}

const createEditGroup = async ({
  id, name
}: {
  id?: string,
  name: string
}) => {
  "use server"
  try {
    const group = id ? await db.groupSetting.update({
      where: {
        id: id
      },
      data: {
        name: name,
      }
    }) : await db.groupSetting.create({
      data: {
        name: name,
      }
    })

    return group
  } 
  catch (error) {
    throw (typeof error === "string") ? error : 'Có lỗi xảy ra, vui lòng thử lại sau'
  } 
}

async function page() {

  const groupSettings = await getData()

  return (
    <SettingContentAdmin groupSettings={groupSettings} createEditGroup={createEditGroup} />
  )
}

export default page