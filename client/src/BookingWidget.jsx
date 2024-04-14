import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import visaLogo from "./assets/logo/VISA.png";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const [paymentname, setPaymentName] = useState("");
  const [creditNumber, setCreditCardNumber] = useState("");
  const { user } = useContext(UserContext);

  const paymentOptions = [
    { paymentname: "VISA", logo: visaLogo },
    { paymentname: "PAYPAL" },
  ];

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  // Format credit card number as "XXXX-XXXX-XXXX"
  const formatCreditCardNumber = (inputNumber) => {
    const creditCardDigits = inputNumber.replace(/\D/g, "");
    const formattedNumber = creditCardDigits
      .replace(/(\d{4})(?=\d)/g, "$1-")
      .slice(0, 19);
    return formattedNumber;
  };

  async function bookThisPlace() {
    if (!user) {
      setRedirect("/login");
      return;
    }

    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
      paymentname,
      creditNumber,
    });
      // After receiving the booking response from the server

    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Payment method:</label>
            <select
              value={paymentname}
              onChange={(ev) => setPaymentName(ev.target.value)}
            >
              <option value="">Select a payment method</option>
              {paymentOptions.map((option) => (
                <option key={option.paymentname} value={option.paymentname}>
                  {option.paymentname}
                </option>
              ))}
            </select>
            {paymentname && (
              <img
                src={paymentOptions.find((option) => option.paymentname === paymentname).logo}
                alt={paymentname}
                className="mt-2"
              />
            )}
            <div>
              <label>Credit card number:</label>
              <input
                type="text"
                value={formatCreditCardNumber(creditNumber)}
                onChange={(ev) => setCreditCardNumber(ev.target.value)}
              />
            </div>
          </div>
        )}
      </div>
      {!user && (
        <div className="text-center mt-4">
          <p>Please <Link to="/login">login</Link> to book this place.</p>
        </div>
      )}
      {user && (
        <button onClick={bookThisPlace} className="primary mt-4">
          Book this place
          {numberOfNights > 0 && (
            <span> ${numberOfNights * place.price}</span>
          )}
        </button>
      )}
    </div>
  );
}