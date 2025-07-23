import { useState } from "react"
import { useNavigate } from "react-router-dom";
import stars from '../assets/stars.jpg';

const Homepage = () => {
    const [username, setUsername] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
    e.preventDefault();
        if (username.trim() !== "") {
            setSubmitted(true);
            console.log("Username submitted:", username);
            localStorage.setItem("username", username);
            const savedUsername = localStorage.getItem("username");
            console.log("Welcome back,", savedUsername);
            navigate("/profiles"); 
        }
    };
  return (
    <div className="min-h-screen max-w-sceen flex flex-col items-center justify-center">
    <div className="absolute inset-0 z-0" 
    style={{ backgroundImage: `url(${stars})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'contrast(1.1) brightness(1) blur(1px) opacity(0.5) grayscale(0.7)',
    }} />
    <div className="relative z-10 flex flex-col items-center justify-center text-white">
        <p className="text-5xl md:text-[3rem]">Rent a</p>
        <h1 className="text-6xl md:text-[10rem] mb-6 text-white italic">Companion</h1>
        <p className="text-sm md:text-[1.5rem]">"Your connection. Your comfort. Your companion"</p>
        <p className="text-xl pt-5">Login</p>
        <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 p-2"
        >
        <label>Username:</label>
        <input 
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="hover:bg-neutral-800 px-4 border border-gray-300 text-gray-300 rounded"
        />
        <button
            type="submit"
            className="px-4 border hover:bg-neutral-700 text-white rounded"
        >
            Enter
        </button>
        </form>
    </div>
    </div>
  )
}

export default Homepage