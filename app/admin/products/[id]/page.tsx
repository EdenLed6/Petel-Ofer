import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb, type Product } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const product = getDb().prepare("SELECT * FROM products WHERE id = ?").get(Number(id)) as
    | Product
    | undefined;
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-berry underline">← חזרה למוצרים</Link>
      <h1 className="text-3xl font-black text-berry-deep mt-2 mb-6">עריכת מוצר: {product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}
