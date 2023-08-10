import { AdminUserType } from "@/lib/server/helperServer";
import { Admin, Image } from "@prisma/client";
import { useEffect, useState } from "react";
import { create } from "zustand";

type UserType = {
  user: AdminUserType
  save: (data: AdminUserType) => void
}

const useAdminUser = create<UserType>(set => ({
  user: null,
  save: (data: AdminUserType) => set(state => ({
    user: data
  }))
}))

export default useAdminUser