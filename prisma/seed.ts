// import { PrismaClient } from '@prisma/client'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
// import bcrypt from 'bcrypt'

(() => {
  const prisma = new PrismaClient();
  async function main() {
    const password = await bcrypt.hash("password", 10)

    const role = await prisma.role.create({
      data: {
        name: 'Administrator',
        permissions: {
          create: [
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
          ]
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