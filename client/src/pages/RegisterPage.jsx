import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Cpassword, setCpassword] = useState("");

  async function registerUser(ev) {
    ev.preventDefault();

    if (!name || !email || !password || !Cpassword) {
      alert("Please fill in all the required fields");
      return;
    }

    if (password !== Cpassword) {
      alert("Password and confirm password do not match");
      return;
    }

    try {
      await axios.post("/register", {
        name,
        email,
        password,
        Cpassword,
      });
      alert("Registration successful. Now you can log in!");
    } catch (e) {
      alert("Registration failed. Please try again later");
    }
  }

  return (
    <div className="mt-7 grow flex items-center justify-around" style={{ marginTop: "100px" }}>
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            type="email"
            placeholder="Your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={Cpassword}
            onChange={(ev) => setCpassword(ev.target.value)}
          />
          <button className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center py-2 px-4 w-full">
            Register
          </button>
          <div className="text-center justify-around">
            Already have an account?{" "}
            <Link className="underline text-bn" to={"/login"}>
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}