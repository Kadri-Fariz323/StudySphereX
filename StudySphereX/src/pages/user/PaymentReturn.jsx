import { Card } from "@/components/UI/Card";
import { captureAndFinalizePaymentService } from "@/services/StudentViewService";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
export const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (!paymentId || !payerId) return;

   const capturePayment = async () => {
  try {
    const orderId = JSON.parse(localStorage.getItem("currentOrderId"));

    if (!orderId) {
      console.error("Order ID missing");
      return;
    }

    const response = await captureAndFinalizePaymentService(
      paymentId,
      payerId,
      orderId
    );

    if (response?.success) {
      localStorage.removeItem("currentOrderId");
      navigate("/user/student-courses");
  toast.success("Payment Successful")

    }
  } catch (error) {
    console.error("Payment capture failed:", error);
  }
};

    capturePayment();
  }, [paymentId, payerId, navigate]);

 return (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-40 animate-pulse"></div>

      <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-[320px] text-center">
        
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Text */}
        <h1 className="text-xl font-semibold text-gray-800">
          Processing Payment
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Please wait while we complete your transaction
        </p>

        {/* Progress bar */}
        <div className="mt-6 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

};
