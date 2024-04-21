import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Cpassword, setCpassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const openTermsModal = () => {
    setShowTermsModal(true);
  };

  async function registerUser(ev) {
    ev.preventDefault();

    if (!name || !email || !password || !Cpassword || !agree) {
      setShowModal(true);
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
    <div
      className="mt-7 grow flex items-center justify-around"
      style={{ marginTop: "100px" }}
    >
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
          <div>
            <input
              type="checkbox"
              checked={agree}
              onChange={(ev) => setAgree(ev.target.checked)}
              id="agree"
            />
            <label htmlFor="agree">
              I agree to the{" "}
              <span
                className="underline text-blue-500 cursor-pointer"
                onClick={openTermsModal}
              >
                terms and conditions
              </span>
            </label>
          </div>
          <button
            className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center py-2 px-4 w-full"
          >
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
      <Modal
        isOpen={showTermsModal}
        onRequestClose={() => setShowTermsModal(false)}
        contentLabel="Terms and Conditions Modal"
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          content: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px"
          }
        }}
      >
        <h2>Terms and Conditions</h2>
        <p>Guest Responsibilities: As a guest, you are responsible for providing accurate information, respecting the host's property and rules, and treating the space and neighbors with respect.</p>
        <p>Booking and Payment: By making a reservation, you agree to pay the total amount specified, including any additional fees or taxes. Find.io handles the payment process, and you must comply with their terms of service.</p>
        <p>Cancellation Policy: Each listing on Find.io has its own cancellation policy set by the host. You should review and understand the cancellation policy before making a reservation, as it determines whether you are eligible for a refund in case of cancellation.</p>
        <p>Refundable Deposit: Some hosts may require a security deposit to cover any potential damages or violations. If a deposit is required, it will be clearly communicated during the booking process.</p>
        <p>Communication and Reviews: Both guests and hosts are encouraged to communicate openly and honestly. After your stay, you may be asked to review and rate your experience, providing feedback for future guests and hosts.</p>
        <p>House Rules: Each host sets their own house rules, which are specific guidelines for guests to follow during their stay. These rules may include restrictions on smoking, pets, parties, or additional guests. It's essential to review and respect these rules to maintain a positive experience.</p>
        <p>Liability: Find.io acts as an intermediary platform and is not responsible for any incidents or accidents that occur during your stay. Hosts are encouraged to have appropriate insurance coverage, and guests should consider obtaining travel insurance to safeguard against unforeseen circumstances.</p>
        {/* Add your terms and conditions content here */}
        <button onClick={() => setShowTermsModal(false)}>Close</button>
      </Modal>
      
    </div>
  );
}