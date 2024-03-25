import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";
import { useParams } from "react-router-dom";
import ReviewImg from "./ReviewImg.jsx";

export default function ReviewWidget({ place }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
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
            <input
              type="number"
              value={rating}
              onChange={(ev) => setRating(ev.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
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
              Reviews & Rating
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
                  <span className="text-2xl font-semibold text-blue-500">
                    {review.rating}
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