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
    createOrder();
    sendEmail();

    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    const res = await fetch("api/create-intent", {
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
    }
  };

  const createOrder = () => {
    let productDocumentId = [];
    cart.forEach((el) => {
      productDocumentId.push(el?.product?.documentId);
    });
    const data = {
      data: {
        email: user.primaryEmailAddress.emailAddress,
        username: user.fullName,
        amount,
        products: productDocumentId,
      },
    };
    OrderApis.createOrder(data).then((res) => {
      if (res) {
        cart.forEach((el) => {
          CartApis.deleteCartItem(el?.documentId).then((result) => {});
        });
      }
    });
  };

  const sendEmail = async () => {
    const res = await fetch("api/send-email", {
      method: "POST",
    });
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
