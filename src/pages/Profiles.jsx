import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const blue = '/blue.jpg';
const deb = '/deb.jpg';
const leo = '/noah.jpg'; 
const mira = '/mira.jpg';
const myr = '/myr.jpg';
const noah = '/leo.jpg';
const jaq = '/jaq.jpg';

const profiles = [
  { id: 1, name: "Deborah", image: deb, status: "available", route: "/deb" },
  { id: 2, name: "Lionel", image: leo, status: "unavailable" },
  { id: 3, name: "Mira", image: mira, status: "unavailable" },
  { id: 4, name: "Myron", image: myr, status: "unavailable" },
  { id: 5, name: "Noah", image: noah, status: "available", route: "/noah" },
  { id: 6, name: "Jacqueline", image: jaq, status: "unavailable" },
];

const Profiles = () => {
  const [username, setUsername] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);

    audioRef.current = new Audio("/retro.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn("Audio play error:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleProfileClick = (profile) => {
    if (profile.status !== "available") return;
    if (profile.route) {
      navigate(profile.route);
    }
    localStorage.setItem("selectedProfile", profile.name);
  };

  const handleCloseModal = () => {
  setShowModal(false);
  if (audioRef.current && !isPlaying) {
    audioRef.current.play().catch((err) => {
      console.warn("Audio play error:", err);
    });
    setIsPlaying(true);
  }
};

  return (
    <>
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${blue})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-gray-200 border border-black w-[500px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] font-mono text-black text-sm">
            <div className="bg-blue-700 text-white px-3 py-1 font-bold flex justify-between items-center">
              <span>Warning</span>
              <button
                className="bg-gray-200 text-black px-1 ml-2 border border-black"
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>
            <div className="p-4 leading-relaxed">
              <p className="mb-2">
                <strong>Trigger Warning:</strong> This experience contains themes that may be distressing to some users.
              </p>
              <p className="mb-2">
                Please enable <span className="font-bold">sound</span> for the best experience.
              </p>
              <p>Viewer discretion is strongly advised.</p>
            </div>
            <div className="flex justify-end gap-2 p-2 border-t border-black">
              <button
                onClick={handleCloseModal}
                className="bg-gray-100 px-3 py-1 border border-black hover:bg-white active:translate-x-[1px] active:translate-y-[1px]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`relative text-center p-4 min-h-screen text-white transition-all duration-300 ${showModal ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <div className="absolute top-5 left-5 right-5 flex justify-between items-center px-4">
          <button
            onClick={toggleSound}
            className="group relative flex items-center text-white px-2 py-2 rounded-full hover:bg-black/50"
          >
            {isPlaying ? "🔊" : "🔇"}
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-sm bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {isPlaying ? "Sound On" : "Sound Off"}
            </span>
          </button>
          <p className="text-white">
            Welcome Back, <span className="text-purple-900 text-lg font-bold">{username}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-10 md:px-24 py-10">
          {profiles.map((profile) => {
            const isAvailable = profile.status === "available";
            return (
              <div
                key={profile.id}
                onClick={() => handleProfileClick(profile)}
                className={`transition-transform duration-300 transform hover:scale-101 p-8 w-full h-100 flex flex-col items-center justify-center
                  ${isAvailable ? "cursor-pointer" : "cursor-not-allowed opacity-50 blur-[5px] hover:blur-[0px]"}`}
              >
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-70 h-80 object-cover mb-4 border-2 border-white"
                />
                <p className="text-xl font-semibold">{profile.name}</p>
                <span className={`mt-1 text-lg ${isAvailable ? "text-green-500" : "text-gray-400"}`}>
                  {isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Profiles;
