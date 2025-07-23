import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 


const dialSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
const tableBg = '/table.jpg';
const note = '/note.png';
const windAudio = 'wind.mp3'

const Phone = () => {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [debbieCalls, setDebbieCalls] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const navigate = useNavigate();
  
  const windAudioRef = useRef(null);

    useEffect(() => {
    const wind = new Audio(windAudio);
    wind.loop = true;
        const playAudio = async () => {
        try {
        await wind.play();
        } catch (e) {
        console.warn('Autoplay blocked. Will play on interaction.', e);
        }
    };

    playAudio();

    windAudioRef.current = wind;

    return () => {
        wind.pause();
        wind.currentTime = 0;
    };
    }, []);

  const handlePress = (value) => {
  if (windAudioRef.current && windAudioRef.current.paused) {
    windAudioRef.current.play().catch(() => {});
  }

  dialSound.currentTime = 0;
  dialSound.play();

  setTyping(true);
  setTimeout(() => {
    setTyping(false);
    setInput((prev) => prev + value);
  }, 150);
};

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
  const sanitizedInput = input.replace(/\s|-/g, '');

  if (sanitizedInput === '43879108') {
    dialSound.play(); 
  } else if (sanitizedInput === '56783414') {
    const newCount = debbieCalls + 1;
    setDebbieCalls(newCount);

    if (newCount >= 2) {
      setBlocked(true);
      return;
    }

    dialSound.loop = true;
    dialSound.play();
    setTimeout(() => {
      dialSound.pause();
    }, 7000);
  } else {
    dialSound.loop = true;
    dialSound.play();
    setTimeout(() => {
      dialSound.pause();
    }, 7000);
  }
};

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <div
      className="max-h-screen flex overflow-hidden"
      style={{
        backgroundImage: `url(${tableBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-1/2 flex items-center justify-center p-10 blur-[0.8px]">
        <div className="w-77 bg-gray-800 rounded-t-[6vw] rounded-b-2xl p-10 shadow-2xl flex flex-col justify-between">
          <div className="bg-neutral-500 rounded-t-[3vw] rounded-b-lg text-red-300 text-2xl text-right px-4 py-3 h-50 flex items-center justify-end">
            {typing ? '| ' : input || ' '}
          </div>
          <div className="flex justify-between mt-4 p-5">
            <button
              onClick={handleCall}
              className="bg-green-600 font-bold hover:bg-green-500 px-4 py-1 rounded-full text-sm"
            >
              CALL
            </button>
            <button
              onClick={handleBackspace}
              className="bg-red-600 hover:bg-red-500 px-4 rounded-full font-bold text-sm"
            >
              CLEAR
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {buttons.flat().map((num) => (
              <button
                key={num}
                onClick={() => handlePress(num)}
                className="bg-neutral-700 hover:bg-gray-600 active:scale-90 text-xl py-4 rounded-lg transition duration-150 shadow"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-1/2 p-20 flex flex-col items-center">

    {!blocked ? (
        <>
        <button
            onClick={() => setShowNote(!showNote)}
            className="border bg-neutral-700 hover:bg-neutral-900 px-10 py-2 rounded-lg transition"
        >
            Contacts
        </button>

        <AnimatePresence>
            {showNote && (
            <motion.img
                src={note}
                alt="Contact Note"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="mt-6 max-w-xl w-full blur-[0.5px]"
            />
            )}
        </AnimatePresence>
        </>
    ) : (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="h-screen flex justify-center items-center flex-col space-y-10"
                >
                <p className="text-white text-5xl font-bold">Looks like you've been blocked, creep.</p>
                <p className="text-white text-2xl font-bold">What are you going to do now?</p>

                <div className="flex gap-6 justify-center">
                    <button
                    onClick={() => navigate('/stroll')}
                    className="bg-gray-700 hover:bg-gray-800 text-black px-6 py-3 rounded-lg shadow"
                    >
                    Find Her
                    </button>
                    <button
                    onClick={() => navigate('/')}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow"
                    >
                    Give Up
                    </button>
                </div>
                </motion.div>
            )}

            </div>
            </div>
  );
};

export default Phone;