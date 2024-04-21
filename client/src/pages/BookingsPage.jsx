import AccountNav from "../AccountNav";
import {useEffect, useState} from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import {differenceInCalendarDays, format} from "date-fns";
import {Link} from "react-router-dom";
import BookingDates from "../BookingDates";

export default function BookingsPage() {
  const [bookings,setBookings] = useState([]);
  const [displayCount, setDisplayCount] = useState(6);
  useEffect(() => {
    axios.get('/bookings').then(response => {
      setBookings(response.data);
    });
  }, []);

  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + 6);
  };
  return (
    <div>
      <AccountNav />
      <div>
        {bookings.slice(0, displayCount).map(booking => (
          <Link to={`/account/bookings/${booking._id}`} className="flex gap-4 mt-8 bg-gray-200 rounded-2xl overflow-hidden">
            <div className="w-48">
              <PlaceImg place={booking.place} style={{
                height: "142px" }}/>
            </div>
            <div className="py-3 pr-3 grow">
              <h2 className="text-xl">{booking.place.title}</h2>
              <div className="text-xl">
                <BookingDates booking={booking} className="mb-2 mt-4 text-gray-500" />
                <div className="flex gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  <span className="text-2xl">
                    Total price: ${booking.price}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {bookings.length > displayCount && (
        <button className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleShowMore}
        style={{
          width: "400px",
          marginLeft: "707px",
          marginRight: "217px",
          marginTop: "50px"
        }}>
          Show More
        </button>
      )}
    </div>
  );
}