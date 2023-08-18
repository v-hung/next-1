import Banner from "@/components/web/Banner";
import ListProduct from "@/components/web/ListProduct";
import db from "@/lib/admin/prismadb";
import { Category, Image } from "@prisma/client";
import { useSession } from "next-auth/react";

type CategoryTypeState = "lien-quan" | "toc-chien" | 'vong-quay' | 'free-fire' | undefined

export type CategoryState = Omit<Category, 'type'> & {
  accountNumber?: number
  type: CategoryTypeState,
  image: Image | null
}

const getData = async () => {
  try {
    const categories = await db.category.findMany({
      where: {
        publish: 'publish'
      },
      include: {
        image: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const data: CategoryState[] = await Promise.all(categories.map(async v => {
      let accountNumber = await db.product.count({
        where: {
          categoryId: v.id,
          publish: 'publish'
        }
      })

      return {
        ...v,
        type: v.type as CategoryTypeState,
        accountNumber
      }
    }))

    return data
  } catch (error) {
    return []
  }
}

export default async function Page() {
  // await new Promise((res) => setTimeout(() => res(1), 50000))
  const lienquans = await getData()

  return (
    <>
      <Banner />
      <ListProduct title="Danh mục game Liên quân" items={lienquans} />
      {/* <ListProduct title="Sự kiện siêu hót" items={items2} />
      <ListProduct title="Danh mục game tốc chiến" items={items3} />
      <ListProduct title="Danh mục game FreeFire" items={items4} /> */}
      <div className="mt-12"></div>
    </>
  );
}
