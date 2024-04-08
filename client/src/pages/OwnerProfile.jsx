import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import ProfileImg from '../ProfieImg.jsx';
import { UserContext } from "../UserContext.jsx";

export default function OwnerProfile() {
  const { ready, user, setUser } = useContext(UserContext);
  const { ownerId } = useParams();
  const [owner, setOwner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await axios.get(`/users/${ownerId}`);
        setOwner(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOwner();
  }, [ownerId]);

  

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const sendEmail = async () => {
    try {
      const response = await axios.post('/send-email', {
        sender: user.email,
        recipient: owner.email,
        subject: 'Message from your website',
        message: message,
      });

      if (response.status === 200) {
        setMessage('');
        toggleModal();
        console.log('Email sent successfully!');
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  if (!owner) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-16">
      <div className="p-8 bg-white shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">7</p>
              <p className="text-gray-400">His/Her places</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">4</p>
              <p className="text-gray-400">Reviews</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">5</p>
              <p className="text-gray-400">Bookings</p>
            </div>
          </div>
          <div className="relative">
            <ProfileImg user={owner} />
          </div>

          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button
              className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
              onClick={toggleModal}
            >
              Message
            </button>
          </div>
        </div>

        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">
            {owner.name},{" "}
            <span className="font-light text-gray-500">{owner.age}</span>
          </h1>
          <p className="font-light text-gray-600 mt-3">{owner.lived}</p>

          <p className="mt-8 text-gray-500">
            Solution Manager - Creative Tim Officer
          </p>
          <p className="mt-2 text-gray-500">University of Computer Science</p>
        </div>

        <div className="mt-12 flex flex-col justify-center">
          <p className="text-gray-600 text-center font-light lg:px-16">
            {owner.description}
          </p>
          <button className="text-indigo-500 py-2 px-4 font-medium mt-4">
            Show more
          </button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={toggleModal}
        contentLabel="Message Modal"
      >
        <h2>Send Message</h2>
        <textarea
          value={message}
          onChange={handleInputChange}
          placeholder="Enter your message..."
          rows={4}
        />
        <button className="py-4 px-6" onClick={sendEmail}>Send</button>
        <button onClick={toggleModal}>Cancel</button>
      </Modal>
    </div>
  );
}