import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";
import ReviewWidget from "../ReviewWidget";

export default function PlacePage() {
  const { id} = useParams();
  const [place, setPlace] = useState(null);
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
      fetchOwnerName(response.data.owner);
    });
  }, [id]);

  const fetchOwnerName = (ownerId) => {
    axios.get(`/users/${ownerId}`).then((response) => {
      setOwnerName(response.data.name);
    });
  };

  if (!place) return "";

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description:</h2>
            {place.description}
          </div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Perk:</h2>
            {place.perks.map((perk, index) => (
              <p key={index}>{perk}</p>
            ))} 
            <div className="my-4">
          
          <h2 className="font-semibold text-2xl">Owner:</h2>
              {ownerName}
        </div>
          </div>
          <h2 className="font-semibold text-2xl">Check in & out:</h2>
          Check-in: {place.checkIn}
          <br />
          Check-out: {place.checkOut}
          <br />
          Max number of guests: {place.maxGuests}
        </div>
       
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
          {place.extraInfo}
        </div>
        <ReviewWidget place={place}/>
      </div>
    </div>
  );
}