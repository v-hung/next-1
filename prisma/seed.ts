// import { PrismaClient } from '@prisma/client'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
// import bcrypt from 'bcrypt'

(() => {
  const prisma = new PrismaClient();
  async function main() {
    const password = await bcrypt.hash("password", 10)
    const user = await prisma.admin.create({
      data: {
        name: 'Admin',
        email: 'admin@admin.com',
        image: 'storage/images/user/b3.png',
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