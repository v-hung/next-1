import { create } from "zustand";

type MenuType = {
  open: boolean,
  width: string,
  toggle: () => void
}

const useAdminMenu = create<MenuType>(set => ({
  open: true,
  width: "16rem",
  toggle: () => set(state => ({
    open: !state.open
  }))
}))

export default useAdminMenu