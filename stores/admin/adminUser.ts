import { Admin } from "@prisma/client";
import { useEffect, useState } from "react";
import { create } from "zustand";

export type AdminUser = Omit<Admin, "password"> | null

type UserType = {
  user: AdminUser
  save: (data: AdminUser) => void
}

const useAdminUser = create<UserType>(set => ({
  user: null,
  save: (data: AdminUser) => set(state => ({
    user: data
  }))
}))

export default useAdminUser