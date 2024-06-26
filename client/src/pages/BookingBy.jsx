import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingBy() {
  const {id} = useParams();
  const [booking,setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get(`/BookingBy/${id}`).then(response => {
        setBooking(response.data);
      });
    }
  }, [id]);
  

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
      <PlaceGallery place={booking.place} />
    </div>
  );
}