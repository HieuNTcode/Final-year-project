import axios from "axios";
import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import AccountNav from "../AccountNav";
import PlaceImg from "../PlaceImg";

export default function PlacesPage(){
    const [places,setPlaces] = useState([]);
    useEffect(() => {
        axios.get('/user-places').then(({data}) =>{
            setPlaces(data);
        });
    },[]);

    const deletePlace = (placeId) => {
        axios.delete(`/places/${placeId}`)
          .then(() => {
            // Update the places list after successful deletion
            setPlaces(places.filter(place => place._id !== placeId));
          })
          .catch(error => {
            console.error("Error deleting place:", error);
          });
      };
      
   return (
    <div>
        <AccountNav />  
        <div className="text-center">
           <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                   </svg>
            add new places
           </Link>
        </div>
        <div className="mt-4" style={{
      marginLeft: "217px",
      marginRight: "217px",  
    }}>

            {places.length > 0 && places.map(place => (
                <Link to={'/account/places/'+place._id} className="flex cursor-pointer mt-7 gap-4 bg-gray-100 p-4 rounded-2xl" >
                    <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                       <PlaceImg place={place} />
                    </div >
                    <div className="grow-0 shrink">
                    <h2 className="text-xl" >{place.title}</h2>
                    <p className="text-sm mt-2">
                        {place.description}
                    </p>
                    <Link to={'/account/places'} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                            <button onClick={() => deletePlace(place._id)} class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                                <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    Delete
                                </span>
                            </button>
                    </Link>
                    </div>
                </Link>
            ))}
        </div>
    </div>
   );
}