import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axios.get('/places').then(response => {
      setPlaces(response.data);
    });
    // Fetch the user's role or privileges from the server
    axios.get('/user/role') // Replace '/user/'+id with '/user/role'
    .then(response => {
      setIsAdmin(response.data.role === 'admin');
    })
    .catch(error => {
      console.error('Error fetching user role:', error);
    });
}, []);


  const handleDeletePlace = async (placeId) => {
    try {
      await axios.delete(`/places/${placeId}`);
      setPlaces(prevPlaces => prevPlaces.filter(place => place._id !== placeId));
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {places.length > 0 && places.map(place => (
        <div key={place._id}>
          <Link to={`/place/${place._id}`}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {place.photos?.[0] && (
                <Image className="rounded-2xl object-cover aspect-square" src={place.photos?.[0]} alt="" />
              )}
            </div>
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-sm text-gray-500">{place.title}</h3>
            <div className="mt-1">
              <span className="font-bold">${place.price}</span> per night
            </div>
          </Link>
          {isAdmin && (
            <button
              className="text-red-500 mt-2"
              onClick={() => handleDeletePlace(place._id)}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}