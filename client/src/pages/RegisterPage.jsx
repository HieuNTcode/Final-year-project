import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage () {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [Cpassword,setCpassword] = useState('');
    async function registerUser(ev){
      ev.preventDefault();
      try{
        await axios.post('/register', {
        name,
        email,
        password,
        Cpassword,
      });
      alert('Registration successful. Now you can logging!')
      } catch (e){
        alert('Registration fail, Please try again later')
      }
      
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Register</h1>
            <form className="max-w-md mx-auto" onSubmit={registerUser}>
                <input type="text" placeholder="Your name" 
                    value={name}
                    onChange={ev => setName(ev.target.value)}/>
                <input type="email" placeholder="Your@email.com" 
                    value={email}
                    onChange={ev => setEmail(ev.target.value)} />
                <input type="password" placeholder="Password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)} />
                <input type="password" placeholder="Confirm passwor" 
                    value={Cpassword}
                    onChange={ev => setCpassword(ev.target.value)} />
                <button className="primary">Register</button>
                <div>
                    Already have an account? <Link className="underline text-bn" to={'/login'}>Login here</Link>
                </div>
            </form>   
            </div>
        </div>
    );
}