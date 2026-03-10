"use client";
import React, { Suspense } from "react"; // أضف Suspense
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./_components/CheckoutForm";
import { useSearchParams } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY);

function CheckoutContent() {
  const searchParams = useSearchParams(); // انقل useSearchParams إلى component داخلي
  const options = {
    mode: "payment",
    currency: "usd",
    amount: Math.round(Number(searchParams.get("amount")) * 100),
  };
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm amount={Number(searchParams.get("amount"))} />
    </Elements>
  );
}

function Checkout() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

export default Checkout;