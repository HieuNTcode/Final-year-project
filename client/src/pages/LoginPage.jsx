import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Logo from "../assets/logo/login.jpg";
import Modal from "react-modal";

export default function LoginPage () {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const {setUser} = useContext(UserContext);

    async function handleLoginSubmit(ev) {
      ev.preventDefault();
      try {
        const { data } = await axios.post("/login", { email, password });
        if (data === "not found") {
          setModalOpen(true);
        } else {
          setUser(data);
          alert("Login Successful!");
          setRedirect(true);
        }
      } catch (e) {
        alert("Login failed!");
      }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
      <div style={{
        marginTop: "50px",
      }}>
      <div class="bg-gray-100 flex justify-center items-center m-auto" style={{
        marginTop: "50px",
        marginBottom: "90px",
        minHeight: "0",
      }}>
        <div class="w-1/2 hidden lg:block">
          <img src={Logo} class="object-cover w-full" alt="Logo" />
        </div>
        <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2" style={{
          height: "30vh",
          paddingTop: "0px",
          paddingBottom: "0px",

        }}>
          <h1 class="text-2xl font-semibold mb-4 text-center">Login</h1>
          <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
            <div class="mb-4">
              <label for="username" class="block text-gray-600">User email</label>
              <input type="email" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autocomplete="off" placeholder="Your@email.com"
                value={email}
                onChange={ev => setEmail(ev.target.value)} />
            </div>
            <div class="mb-4">
              <label for="password" class="block text-gray-600">Password</label>
              <input type="password" placeholder="password" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autocomplete="off"
                value={password}
                onChange={ev => setPassword(ev.target.value)} />
            </div>
            <button type="submit" class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center py-2 px-4 w-full">Login</button>
          </form>
          <div class="mt-6 text-blue-500 text-center">
            Dont't have an account yet? <Link className="underline text-bn" to={'/register'}>Register now</Link>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Email Not Found Modal"
        style={{
          content: {
            width: "300px", 
            height: "200px",
            margin: "auto",
          },
        }}
      >
        <h2>Email not found. Please register an account.</h2>
        <div className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center py-2 px-4 w-full" style={{
           display: "flex", 
           justifyContent: "center",
           marginTop:"60px",
            }}>
          <button className="bg-0" onClick={() => setModalOpen(false)}>Close</button>
        </div>
      </Modal>
      </div>
    );
}