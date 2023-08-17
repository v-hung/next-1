import SettingContentAdmin from '@/components/admin/content/SettingContentAdmin'
import { useCurrentUserAdmin } from '@/lib/admin/helperServer'
import db from '@/lib/admin/prismadb'
import { SampleColumnsType, SampleFieldAndDetailsType, getValueSettings } from '@/lib/admin/sample'
import { Setting, GroupSetting } from '@prisma/client'
import React from 'react'
import { TABLES_SAMPLE } from '../(sample)/[slug]/table'
import { checkPermissions } from '@/lib/admin/fields'

export type GroupSettingType = Omit<GroupSetting, 'settings'> & {
  settings: SettingType[]
}

export type SettingType = (Omit<Setting, 'type' | 'details' | 'value'>) & SampleFieldAndDetailsType & {
  value: any
}

const getData = async () => {
  const data = await db.groupSetting.findMany({
    include: {
      settings: true
    }
  })

  const groupSettings = await Promise.all(data.map(async v => ({
    ...v,
    settings: await getValueSettings(v.settings)

  })) as any[] as GroupSettingType[])
 
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

const deleteGroup = async ({ id }: { id: string }) => {
  "use server"
  try {
    await db.groupSetting.delete({
      where: {
        id: id
      }
    })
  } 
  catch (error) {
    throw (typeof error === "string") ? error : 'Có lỗi xảy ra, vui lòng thử lại sau'
  } 
}

export type CreateEditSettingType = {
  groupId: string,
  settings: ({
    id: string, 
    name: string,
    required: boolean,
  } & SampleFieldAndDetailsType)[]
}

const createEditSetting = async ({ 
  groupId, settings
}: CreateEditSettingType) => {
  "use server"
  try {
    await db.setting.deleteMany({
      where: {
        groupId: groupId
      }
    })

    await db.$transaction(settings.map(v => db.setting.create({
      data: {
        name: v.name,
        required: v.required || false,
        type: v.type,
        details: JSON.stringify(v.details),
        groupId: groupId
      }
    })))
  } 
  catch (error) {
    console.log({error})
    throw (typeof error === "string") ? error : 'Có lỗi xảy ra, vui lòng thử lại sau'
  } 
}

const saveSetting = async(data : Array<[string, string]>) => {
  "use server"
  try {
    await db.$transaction(data.map(([key, value]) => db.setting.update({
      where: {
        name: key
      },
      data: {
        value: value
      }
    })))
  } 
  catch (error) {
    console.log({error})
    throw (typeof error === "string" && error) ? error : 'Có lỗi xảy ra, vui lòng thử lại sau'
  } 
}

async function page() {
  const admin = await useCurrentUserAdmin()

  if (!checkPermissions(admin?.role.permissions || [], "setting", "browse")) {
    return <div>Bạn không có quyền truy cập trang này</div>
  }

  const groupSettings = await getData()

  return (
    <SettingContentAdmin groupSettings={groupSettings} 
      createEditGroup={createEditGroup} 
      deleteGroup={deleteGroup} 
      createEditSetting={createEditSetting} 
      saveSetting={saveSetting}
    />
  )
}

export default page