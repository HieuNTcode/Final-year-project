import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";
import { useParams } from "react-router-dom";
import ReviewImg from "./ReviewImg.jsx";

export default function ReviewWidget({ place }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0); // Updated initial value to 0
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    async function fetchReviews() {
      if (place) {
        const response = await axios.get(`/reviews/place/${place._id}`);
        const reviewsWithUserData = await Promise.all(
          response.data.map(async (review) => {
            if (review.user) {
              const userResponse = await axios.get(`/users/${review.user}`);
              review.user = userResponse.data;
            }
            return review;
          })
        );
        setReviews(reviewsWithUserData);
      }
    }
    fetchReviews();
  }, [place]);

  async function ReviewPlace() {
    await axios.post("/reviews", {
      comment,
      user: user ? user._id : null,
      rating,
      place: place._id,
    });
  }

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <div className="border rounded-xl mt-4 p-4">
        <div className="flex">
          <div className="py-3 px-4 w-1/2">
            <label className="text-lg">Comment:</label>
            <input
              type="text"
              value={comment}
              onChange={(ev) => setComment(ev.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="py-3 px-4 border-l w-1/2">
            <label className="text-lg">Rating:</label>
            <select
              value={rating}
              onChange={(ev) => setRating(Number(ev.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value={0}>Select a rating</option>
              <option value={1}>1. Poor place</option>
              <option value={2}>2. Bad</option>
              <option value={3}>3. Decent</option>
              <option value={4}>4. Good</option>
              <option value={5}>5. Excellent</option>
            </select>
          </div>
        </div>
      </div>
      <button
        onClick={ReviewPlace}
        className="primary mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
      >
        Review this place
      </button>
      <div className="mt-8">
        <h2 className="font-bold text-3xl text-center mb-8">People who love the place</h2>
        <div className="grid grid-cols-12 py-6 border-b border-gray-200 mb-8">
          <div className="col-span-12 lg:col-span-8">
            <h5 className="font-semibold text-xl leading-8 text-gray-900 text-center">
              Reviews
            </h5>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <h5 className="font-semibold text-xl leading-8 text-gray-900 text-center">
              Rating
            </h5>
          </div>
        </div>
        <div className="grid gap-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="flex items-center border border-gray-200 rounded-lg p-4"
              >
                <div className="flex-shrink-0 w-16 h-16">
                  <ReviewImg user={review.user} />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-lg leading-6 text-gray-900 mb-2">
                    {review.user.name}
                  </p>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
                <div className="flex items-center justify-center ml-auto">
                  <span className="text-2xl font-semibold text-blue-500 flex items-center">
                    {review.rating}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
}