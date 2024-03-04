import { useState } from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";

export default function PlacesPage(){
    const {action} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect,setRedirect] = useState('');
    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text){
        return (
        <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function preInput(header,description) {
        return(
            <>
             {inputHeader(header)}
             {inputDescription(description)}
            </>
        )
    }
    async function addNewPlace(ev){
        ev.preventDefault();
        const {data} = await axios.post('/places', {title, address, addedPhotos, 
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests
        });
        setRedirect('/account/places');
    }

    if (redirect) {
        return <Navigate to = {redirect}/>
    }
   return (
    <div>
        {action !== 'new' && (
            <div className="text-center">
           <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                   </svg>
            add new places
           </Link>
        </div>
        )}
        {action === 'new' && (
            <div>
                <form onSubmit={addNewPlace}>
                    {preInput('Title','Title for your place should be short and catchy as in advertisement')}
                    <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for exmaple: my place etc"/>
                    {preInput('Address','Address to this place')}
                    <input type="text"  value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address"/>
                    {preInput('Photos','more = better')}
                    <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                    {preInput('Description','description of the places')}
                    <textarea  value={description} onChange={ev => setDescription(ev.target.value)}/>
                    {preInput('Perks','select all the perks of your places')}
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <Perks selected={perks} onChange={setPerks}/>
                    </div>
                    {preInput('Extra info','house rules, etc')}
                    <textarea  value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}/>
                    {preInput('Check in & out times','add check in and out times, remember to have some time window for cleaning the room between guests')}
                    <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                            <h3 mt-2 mb-1>Check in time</h3>
                            <input type="text"  value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder="14:00"/>
                        </div>
                        <div>
                            <h3 mt-2 mb-1>Check out time</h3>
                            <input type="text"  value={checkOut} onChange={ev => setCheckOut(ev.target.value)} />
                        </div>
                        <div>
                            <h3 mt-2 mb-1>Max number of guest</h3>
                            <input type="text"  value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)}/>
                        </div>
                    </div>
                    <button className="primary my-4">Save</button>
                </form>
            </div>
        )}
    </div>
   )
}