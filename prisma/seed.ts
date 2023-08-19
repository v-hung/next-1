import { PrismaClient, Permission } from '@prisma/client'
// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcrypt');
import bcrypt from 'bcrypt'

(() => {
  const prisma = new PrismaClient();
  async function main() {
    const permissions: Permission[] = await prisma.$transaction([
      {
        key: 'browse',
        tableName: 'admin'
      },
      {
        key: 'create',
        tableName: 'admin'
      },
      {
        key: 'edit',
        tableName: 'admin'
      },
      {
        key: 'delete',
        tableName: 'admin'
      },
      {
        key: 'image',
        tableName: 'admin'
      },
      {
        key: 'browse',
        tableName: 'role'
      },
      {
        key: 'create',
        tableName: 'role'
      },
      {
        key: 'edit',
        tableName: 'role'
      },
      {
        key: 'delete',
        tableName: 'role'
      },
      {
        key: 'image',
        tableName: 'role'
      }
    ].map(v => prisma.permission.create({
      data: v
    })))

    const role = await prisma.role.create({
      data: {
        name: 'Administrator',
        permissions: {
          create: permissions.map(v =>
            ({
              permission: {
                connectOrCreate: {
                  where: {
                    key_tableName: {
                      key: v.key,
                      tableName: v.tableName
                    }
                  },
                  create: {
                    key: v.key,
                    tableName: v.tableName
                  }
                }
              }
            })
          )
        }
      }
    })

    const password = await bcrypt.hash("password", 10)
    const user = await prisma.admin.create({
      data: {
        name: 'Admin',
        email: 'admin@admin.com',
        roleId: role.id,
        password
      }
    })

    const groups = await prisma.$transaction(
      [
        { name: "Site", canDelete: false, settings: [
          { name: 'site title', type: 'string', required: false, canDelete: false },
          { name: 'site description', type: 'string', required: false, canDelete: false },
          { name: 'site logo', type: 'file', required: false, details: `{
            multiple: false,
            onlyTable: true,
            typeFiles: ['image']
          }`, canDelete: false },
        ] },
        { name: "Admin", canDelete: false, settings: [
          { name: 'admin title', type: 'string', required: false, canDelete: false },
          { name: 'admin description', type: 'string', required: false, canDelete: false },
        ] }
      ].map(v => prisma.groupSetting.create({
        data: {
          name: v.name,
          canDelete: v.canDelete,
          settings: {
            create: v.settings
          }
        }
      }))
    )
    
    console.log('Successfully')
  }
  
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
})()