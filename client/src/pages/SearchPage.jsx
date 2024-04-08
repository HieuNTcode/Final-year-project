import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Image from "../Image.jsx";

const SearchPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get('/places');
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    filterPlaces(e.target.value);
  };

  const filterPlaces = (searchTerm) => {
    const filtered = places.filter((place) =>
      place.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlaces(filtered);
  };

  return (
    <div>
      <input   
      style={{
      width: "1400px",
      marginLeft: "217px",
      marginRight: "217px",
      marginTop: "50px"
      }}
        type="text"
        value={searchInput}
        onChange={handleSearchInputChange}
        placeholder="Search places..."
      />
      <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-6 lg:grid-cols-6" style={{
      width: "1600px",
      marginLeft: "150px",
      marginRight: "217px",
      marginTop: "50px"
      }}>
      {filteredPlaces.length > 0 && filteredPlaces.map(place => (
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
        </div>
      ))}
    </div>
    </div>
  );
};

export default SearchPage;