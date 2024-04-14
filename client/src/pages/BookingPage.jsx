import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import StripeCheckout from 'react-stripe-checkout';

export default function BookingPage() {
  const {id} = useParams();
  const [booking,setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({_id}) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
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
  
      // Handle the payment success logic here
      console.log('Payment response:', response.data);
    } catch (error) {
      console.error('Error occurred during payment:', error);
      // Handle the payment error logic here
    }
  };

  if (!booking) {
    return '';
  }

  return (
    <div className="my-8"  style={{
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
          <div className="text-xl mt-4 mb-4 " >Full Name: {booking.name}</div>
          <div className="text-xl mb-4">Phone number: {booking.phone}</div>
          <div className="text-xl mb-4">Payment name: {booking.paymentname}</div>
          <div className="text-xl mb-4">Credit number: {booking.creditNumber}</div>
        </div>
        </div>

        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>
      <div className="bg-primary p-6 text-white rounded-2xl">
    <div>Total price</div>
    <div className="text-3xl">${booking.price}</div>
    <StripeCheckout
      stripeKey="pk_test_51P3TzSGHkbez6ATfIR9bmxTpQsxngXBxl7Amev0RhNM5T49Cz6hH2PJasVfVnmMF1CKmQ0mHUYnLfj6u4ThqvzKz00j0su02gs"
      token={handlePayment}
      amount={booking.price * 100} // Stripe expects the amount in cents
      currency="USD"
    >
      <button className="my-4 py-2 px-4 bg-green-500 text-white rounded">Pay</button>
    </StripeCheckout>
  </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}