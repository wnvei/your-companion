import React, { useEffect, useRef, useState } from 'react';
import atmosAudio from '../assets/atmos.mp3';

const messages = [
  { text: 'what have you done?', delay: 0 },
  { text: 'YOU  MONSTER', delay: 3000, isAlert: true },
  { text: 'is this what you wanted?!?!', delay: 7000 },
  { text: 'are you happy with yourself now??', delay: 10000 },
  { text: 'you...', delay: 13000 }
];

const Mistake = () => {
  const atmosRef = useRef(null);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [whiteout, setWhiteout] = useState(false);

  useEffect(() => {
    atmosRef.current = new Audio(atmosAudio);
    atmosRef.current.loop = true;
    atmosRef.current.volume = 0.5;
    atmosRef.current.play().catch(() => console.warn('Autoplay blocked.'));

    return () => {
      atmosRef.current.pause();
      atmosRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    messages.forEach(({ text, delay, isAlert }, i) => {
      setTimeout(() => {
        setCurrentMessage({ text, isAlert });

        if (isAlert) {
          setIsFlashing(true);
        } else {
          setIsFlashing(false);
        }

        if (i === messages.length - 1) {
          setTimeout(() => {
            setWhiteout(true);
            if (atmosRef.current) {
              atmosRef.current.pause();
              atmosRef.current.currentTime = 0;
            }
          }, 2000);
        }
      }, delay);
    });
  }, []);

  const renderMessage = () => {
    if (!currentMessage) return null;

    if (currentMessage.text === 'YOU  MONSTER') {
      return (
        <div className="text-5xl md:text-7xl font-bold z-10 flex gap-3">
          <span className="text-9xl text-white">YOU</span>
          <span className="text-9xl pl-5 text-red-800">MONSTER</span>
        </div>
      );
    }

    return (
      <div className="text-4xl md:text-6xl text-white text-center px-6 transition-opacity duration-1000 z-10">
        {currentMessage.text}
      </div>
    );
  };

  return (
    <div
      className={`relative w-screen h-screen flex items-center justify-center transition duration-500 ${
        whiteout ? 'bg-white' : isFlashing ? 'animate-flash' : 'bg-black'
      }`}
    >
      {renderMessage()}

      {whiteout && (
        <div className="absolute inset-0 bg-white text-black font-mono text-sm p-10 z-50 pt-20 blur-[0.45px]">
            <h1 className="text-5xl text-black">
                <span className="text-blue-700 underline font-bold">404 error:</span> File not found
            </h1>

            <p className="text-2xl mt-6">
                The <span className="text-blue-800 font-bold underline">URL</span> you requested was not found.
            </p>

            <p className="text-xl mt-4">
                Did you mean to type <span className="text-blue-700 blur-xs underline">http://secretwebsite.com/home</span>?
            </p>

            <p className="text-xl mt-1">You maybe would like to look at:</p>
            <ul className="list-disc text-xl list-inside ml-4 blur-xs text-blue-700 underline">
                <li>The main page</li>
                <li>The list of downloads</li>
            </ul>

            <p className="mt-10 text-sm text-gray-600">
                A project of the <span className="underline blur-xs text-blue-700">Web Archive Foundation</span>.
            </p>

            <p className="mt-10 text-sm text-red-600">
                Stay safe online.
            </p>
            </div>
        )}

      <style>
        {`
          @keyframes flashBG {
            0%, 100% { background-color: black; }
            50% { background-color: white; }
          }
          .animate-flash {
            animation: flashBG 0.15s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Mistake;
