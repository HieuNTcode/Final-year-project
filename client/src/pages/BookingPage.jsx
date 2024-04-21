import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import StripeCheckout from 'react-stripe-checkout';

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
          const storedIsPaid = localStorage.getItem(`booking_${id}_isPaid`); // Retrieve the payment status from local storage
          setIsPaid(storedIsPaid === 'true'); // Convert the stored string value to a boolean
        }
      });
    }
  }, [id]);

  const handlePayment = async (token) => {
    try {
      const response = await axios.post('/payments', {
        bookingId: booking._id,
        token: token.id,
        amount: booking.price,
      });

      console.log('Payment response:', response.data);
      setIsPaid(true);
      localStorage.setItem(`booking_${id}_isPaid`, 'true'); // Store the payment status in local storage
    } catch (error) {
      console.error('Error occurred during payment:', error);
      // Handle the payment error logic here
    }
  };

  if (!booking) {
    return null; // Return null or a loading indicator while booking data is being fetched
  }

  return (
    <div className="my-8" style={{
      width: "1400px",
      marginLeft: "217px",
      marginRight: "217px",
      marginTop: "50px"
    }}>
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDates booking={booking} />
          <div>
            <div className="text-xl mt-4 mb-4 ">Full Name: {booking.name}</div>
            <div className="text-xl mb-4">Phone number: {booking.phone}</div>
            <div className="text-xl mb-4">Payment name: {booking.paymentname}</div>
            <div className="text-xl mb-4">Credit number: {booking.creditNumber}</div>
          </div>
        </div>

        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${booking.price}</div>
          {isPaid ? (
            <div className="bg-green-200 p-4 rounded-md">
              Booking has been paid.
            </div>
          ) : (
            <StripeCheckout
              stripeKey="pk_test_51P3TzSGHkbez6ATfIR9bmxTpQsxngXBxl7Amev0RhNM5T49Cz6hH2PJasVfVnmMF1CKmQ0mHUYnLfj6u4ThqvzKz00j0su02gs"
              token={handlePayment}
              amount={booking.price * 100}
              currency="USD"
            >
              <button className="mt-2 mb-2 ml-2 py-2 px-4 bg-green-500 items-center text-white rounded">
                {isPaid ? 'Paid' : 'Pay'}
              </button>
            </StripeCheckout>
          )}
        </div>
      </div>

      <PlaceGallery place={booking.place} />
    </div>
  );
}