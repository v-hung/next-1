import { PrismaClient, Permission } from '@prisma/client'
// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcrypt');
import bcrypt from 'bcrypt'

(() => {
  const prisma = new PrismaClient();
  async function main() {
    const password = await bcrypt.hash("password", 10)

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

    // const upsertUser = await prisma.permission.upsert({
    //   where: {
    //     key_tableName: {
    //       key: '',
    //       tableName: ''
    //     }
    //   },
    //   update: {},
    //   create: {
    //     key: '',
    //     tableName: ''
    //   },
    // })

    const role = await prisma.role.create({
      data: {
        name: 'Administrator',
        permissions: {
          create: permissions.map(v =>
            ({
              permission: {
                connect: 
                  {
                    key_tableName: {
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

    const user = await prisma.admin.create({
      data: {
        name: 'Admin',
        email: 'admin@admin.com',
        roleId: role.id,
        password
      }
    })
    
    console.log({ user })
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