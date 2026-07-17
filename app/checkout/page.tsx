import type { Metadata } from "next";
import { getSettings } from "@/lib/db";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "השלמת הזמנה" };

export default function CheckoutPage() {
  const settings = getSettings();
  return (
    <CheckoutForm
      deliveryFee={Number(settings.delivery_fee) || 0}
      freeShippingOver={Number(settings.free_shipping_over) || 0}
      minOrder={Number(settings.min_order) || 0}
      deliveryAreas={settings.delivery_areas}
      paymentInfo={settings.payment_info}
    />
  );
}
