import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AccountNav from "../AccountNav.jsx";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`/users/${selectedUser._id}`);
        await sendDeletionEmail(selectedUser.email);
        setSelectedUser(null);
        getUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const sendDeletionEmail = async (email) => {
    try {
      await axios.post('/send-deletion-email', { email });
      console.log('Deletion email sent successfully.');
    } catch (error) {
      console.error('Failed to send deletion email:', error);
    }
  };

  const handleDeleteConfirmation = (user) => {
    setSelectedUser(user);
    // Show the modal for confirmation
    // Handle user confirmation (e.g., using a frontend modal library)
  };

  return (
    
    <div className="container mx-auto px-4 py-8">
      <AccountNav />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 border-b">Name</th>
            <th className="py-2 border-b">Email</th>
            <th className="py-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="py-2">{user.name}</td>
              <td className="py-2">{user.email}</td>
              <td>
                <button
                  className="text-red-500 font-semibold"
                  onClick={() => handleDeleteConfirmation(user)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for confirmation */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Do you want to delete this user: {selectedUser.name}?</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded font-semibold mr-2"
                onClick={deleteUser}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-semibold"
                onClick={() => setSelectedUser(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}