import { useEffect, useState } from 'react';
import axios from "axios";

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/users').then(response => {
      setUsers(response.data);
    });
}, []);

  const deleteUser = async (userId) => {
    try {
        await axios.delete(`/users/${userId}`);
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      } catch (error) {
        console.error("Error deleting place:", error);
      }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Number of Places</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 && users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.places}</td>
              <td>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}