document.addEventListener("DOMContentLoaded", () => {
  const payNowButton = document.getElementById("payNowBtn");

  if (!payNowButton) return;

  payNowButton.addEventListener("click", async () => {
    const bookingId = payNowButton.dataset.bookingId;

    try {
      const response = await fetch(`/bookings/${bookingId}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!data.success) {
        alert("Unable to initiate payment");
        return;
      }

      const options = {
        key: data.razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Wanderlust",
        description: `Booking Payment for ${bookingId}`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              `/bookings/${bookingId}/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );

            if (verifyResponse.ok) {
              window.location.href = `/bookings/${bookingId}/payment-success`;
            } else {
              window.location.href = `/bookings/${bookingId}/payment-failure`;
            }
          } catch (error) {
            window.location.href = `/bookings/${bookingId}/payment-failure`;
          }
        },
        prefill: {
          name: data.userName || "",
          email: data.userEmail || "",
        },
        theme: {
          color: "#0d6efd",
        },
      };
      console.log(data);
      console.log(data.razorpayKey);
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment initialization failed");
    }
  });
});
