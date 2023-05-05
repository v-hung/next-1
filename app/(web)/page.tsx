import Banner from "@/components/web/Banner";
import ListProduct, { ItemInListProductType } from "@/components/web/ListProduct";
import { useSession } from "next-auth/react";

export default async function Page() {
  // await new Promise((res) => setTimeout(() => res(1), 50000))
  const items1: ItemInListProductType[] = new Array(8).fill(
  {
    image: "https://shopdangym.com/tep-tin/1680804533ACC_LIÊN_QUÂN_RẺ.gif",
    title: "Account liên quân giá rẻ",
    accountNumber: 1549,
    sold: 154786,
    type: "account"
  })

  const items2: ItemInListProductType[] = new Array(8).fill(
  {
    image: "https://shopdangym.com/tep-tin/1663867243VQAccVip.gif",
    title: "VÒNG QUAY ACC VIP 100K",
    sold: 642440,
    type: "luck"
  })

  const items3: ItemInListProductType[] = new Array(3).fill(
  {
    image: "https://shopdangym.com/tep-tin/1639073007TH%E1%BB%AC_V%E1%BA%ACN_MAY_T%E1%BB%90C_CHI%E1%BA%BEN_100K.gif",
    title: "VÒNG QUAY ACC VIP 100K",
    sold: 642440,
    type: "luck"
  })

  const items4: ItemInListProductType[] = new Array(4).fill(
  {
    image: "https://shopdangym.com/tep-tin/1639073007TH%E1%BB%AC_V%E1%BA%ACN_MAY_FREE_FIRE_100K.gif",
    title: "VÒNG QUAY ACC VIP 100K",
    sold: 642440,
    type: "luck"
  })

  return (
    <>
      <Banner />
      <ListProduct title="Danh mục game Liên quân" items={items1} />
      <ListProduct title="Sự kiện siêu hót" items={items2} />
      <ListProduct title="Danh mục game tốc chiến" items={items3} />
      <ListProduct title="Danh mục game FreeFire" items={items4} />
      <div className="mt-12"></div>
    </>
  );
}
