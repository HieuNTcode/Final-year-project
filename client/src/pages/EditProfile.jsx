import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Navigate, useParams} from "react-router-dom";
import PhotosUploader from "../PhotosUploader.jsx";


export default function EditProfile () {
  const {id} = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [addedPhotos,setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState('');
  const [lived,setLived] = useState('');
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/edit-user/'+id).then(response => {
        const {data} = response;
        setName(data.name);
        setEmail(data.email);
        setAge(data.age);
        setLanguage(data.language);
        setLived(data.lived);
        setDescription(data.description);
        setAddedPhotos(data.imageProfile);
    });
  }, [id]);
 
  const handleFormSubmit = (ev) => {
    ev.preventDefault();

    // Create the updated user data object
    const updatedUser = {
      name,
      email,
      addedPhotos,
      description,
      age,
      language,
      lived,
    };

    // Send the updated user data to the server for profile update
    axios.put('/edit-user', 
    {id, ...updatedUser
    })
      .then(response => {
        console.log(response.data); // Optional: Display success message or perform any other action
      })
      .catch(error => {
        console.log(error);
      });
      setRedirect(true);
  };
  
  if (redirect) {
    return <Navigate to={'/account'} />
  }

  return (
    <div>
      <h2 className='pl-6 text-2xl font-bold sm:text-xl'>Edit Profile</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
        <label>Description:</label>
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div>
          <label>Language:</label>
          <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} />
        </div>
        <div>
          <label>lived:</label>
          <input type="text" value={lived} onChange={(e) => setLived(e.target.value)} />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};
