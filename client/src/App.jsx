import './App.css'
import './index.css'
import { Route, Routes} from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import ProfilePage from './pages/ProfilePage'
import PlacesPage from './pages/PlacesPage'
import PlacePage from './pages/PlacePage'
import PlacesFormPage from './pages/PlacesFormPage'
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import EditProfile from './pages/EditProfile'
import AdminPage from './pages/AdminPage'
import SearchPage from './pages/SearchPage'
import WhoBookingPage from './pages/WhoBookingPage'
import BookingBy from './pages/BookingBy'
import OwnerProfile from './pages/OwnerProfile';



axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
 
  return (
    <UserContextProvider>
    <Routes>
      <Route path='/' element={<Layout />}>
      <Route index element={<IndexPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/Register' element={<RegisterPage />} />
      <Route path="/account" element={<ProfilePage />} />
      <Route path="/account/places" element={<PlacesPage />} />
      <Route path="/account/places/new" element={<PlacesFormPage />} />
      <Route path="/account/places/:id" element={<PlacesFormPage />} />
      <Route path="/place/:id" element={<PlacePage />} />
      <Route path="/account/bookings" element={<BookingsPage />} />
      <Route path="/account/bookings/:id" element={<BookingPage />} />
      <Route path="/account/edit-user/:id"  element={<EditProfile />} />
      <Route path="/account/admin"  element={<AdminPage />} />
      <Route path="/places/search"  element={<SearchPage />} />
      <Route path="/account/bookingBy" element={<WhoBookingPage />} />
      <Route path="/account/bookingBy/:id" element={<BookingBy />} />
      <Route path="/owner/:ownerId" element={<OwnerProfile />} />
      </Route>
    </Routes>
    </UserContextProvider>
  )
}

export default App
