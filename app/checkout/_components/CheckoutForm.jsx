import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import { CartContext } from "../../_context/CartContext";
import { useUser } from "@clerk/nextjs";
import OrderApis from "../../_utils/OrderApis";
import CartApis from "../../_utils/CartApis";

const CheckoutForm = ({ amount }) => {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useUser();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const handleError = (error) => {
      setLoading(false);
      setErrorMessage(error.message);
    };
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    try {
      await createOrder();
    } catch (err) {
      console.log(err);
    }

    const res = await fetch("/api/create-intent", {
      method: "POST",
      body: JSON.stringify({
        amount: amount,
      }),
    });

    const clientSecret = await res.json();

    const result = await stripe.confirmPayment({
      clientSecret,
      elements,
      confirmParams: {
        return_url: "https://full-stack-ecommerce-nextjs-strapi.vercel.app/payment-confirm",
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      try {
        await sendEmail();
      } catch (err) {
        console.log("sendEmail error after payment:", err);
      }
    }
  };

  const createOrder = async () => {
    let productDocumentId = [];
    cart.forEach((el) => {
      productDocumentId.push(el?.product?.documentId);
    });
    const data = {
      data: {
        email: user?.primaryEmailAddress?.emailAddress,
        username: user?.fullName,
        amount,
        products: productDocumentId,
      },
    };
    try {
      const res = await OrderApis.createOrder(data);
      if (res) {
        cart.forEach((el) => {
          CartApis.deleteCartItem(el?.documentId).then((result) => {});
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendEmail = async () => {
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: [user?.primaryEmailAddress?.emailAddress],
        }),
      });
      const data = await res.json();
      console.log("sendEmail response:", data);
    } catch (err) {
      console.log("sendEmail error:", err);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-10 md:mx-16 lg:mx-52 xl:mx-[400px] mt-12">
        <PaymentElement />
        <button className="w-full p-2 mt-4 text-white rounded-md bg-primary">
          Submit
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
