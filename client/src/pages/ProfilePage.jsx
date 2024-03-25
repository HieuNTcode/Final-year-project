import { UserContext } from "../UserContext.jsx";
import { useContext, useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage.jsx";
import AccountNav from "../AccountNav.jsx";
import ProfileImg from "../ProfieImg.jsx";

export default function ProfilePage() {
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function fetchBookingCount() {
    try {
      const response = await axios.get("/bookings/count", {
        params: {
          userId: user._id,
        },
      });
      setBookingCount(response.data.count);
    } catch (error) {
      console.log("Error fetching booking count:", error);
    }
  }
  
  async function fetchReviewCount() {
    try {
      
      const response = await axios.get("/reviews/count", {
        params: {
          userId: user._id,
        },
      });
      setReviewCount(response.data.count);
    } catch (error) {
      console.log("Error fetching review count:", error);
    }
  }

  
  
  useEffect(() => {
    if (ready && user) {
      fetchBookingCount();
      fetchReviewCount();
    }
  }, [ready, user]);

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  if (!ready) {
    return "loading..";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="p-16">
          <div className="p-8 bg-white shadow mt-24">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
                <div>
                  <p className="font-bold text-gray-700 text-xl">
                    {bookingCount}
                  </p>
                  <p className="text-gray-400">Your places</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-xl">
                    {reviewCount}
                    </p>
                  <p className="text-gray-400">Reviews</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-xl">5
                  </p>
                  <p className="text-gray-400">Bookings</p>
                </div>
              </div>
              <div className="relative">
                <ProfileImg user={user} />
              </div>

              <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                <Link to={"/account/edit-user/" + user._id}>
                  <button className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                    Edit
                  </button>
                </Link>
                <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                  Message
                </button>
              </div>
            </div>

            <div className="mt-20 text-center border-b pb-12">
              <h1 className="text-4xl font-medium text-gray-700">
                {user.name},{" "}
                <span className="font-light text-gray-500">{user.age}</span>
              </h1>
              <p className="font-light text-gray-600 mt-3">{user.lived}</p>

              <p className="mt-8 text-gray-500">
                Solution Manager - Creative Tim Officer
              </p>
              <p className="mt-2 text-gray-500">
                University of Computer Science
              </p>
            </div>

            <div className="mt-12 flex flex-col justify-center">
              <p className="text-gray-600 text-center font-light lg:px-16">
                {user.description}
              </p>
              <button className="text-indigo-500 py-2 px-4  font-medium mt-4">
                Show more
              </button>
              <div className="text-center max-w-lg mx-auto">
                Logged in as {user.name} ({user.email}) <br />
                <button onClick={logout}
                  className="primary max-w-sm mt-2">Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
}