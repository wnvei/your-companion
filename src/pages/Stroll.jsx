import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const m1 = '/maps/m1.jpg';
const m2 = '/maps/m2.jpg';
const m3 = '/maps/m3.jpg';
const m4 = '/maps/m4.jpg';
const m5 = '/maps/m5.jpg';
const m6 = '/maps/m6.jpg';
const m7 = '/maps/m7.jpg';
const m8 = '/maps/m8.jpg';
const m9 = '/maps/m9.jpg';

const flowerImg = '/flower.jpg';
const gunImg = '/gun.jpg';
const gunshotMp3 = '/gunshot.mp3';
const eerieAudio = '/eerie.mp3';

const images = [m1, m2, m3, m4, m5, m6, m7, m8, m9];

const Stroll = () => {
  const [index, setIndex] = useState(0);
  const [finalChoice, setFinalChoice] = useState(null);
  const [showChoices, setShowChoices] = useState(false);
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const navigate = useNavigate();
  const eerieRef = useRef(null); 

  useEffect(() => {
    eerieRef.current = new Audio(eerieAudio);
    eerieRef.current.loop = true;

    eerieRef.current.play().catch(() => {
      console.warn('Autoplay blocked until user interacts.');
    });

    return () => {
      eerieRef.current.pause();
      eerieRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (index === 8 && !finalChoice) {
      const timer = setTimeout(() => setShowChoices(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [index, finalChoice]);

  useEffect(() => {
    if (finalChoice === 'flower') {
      const timer = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timer);
    }

    if (finalChoice === 'gun') {
      eerieRef.current?.pause(); 

      const gunDelay = setTimeout(() => {
        setShowBlackScreen(true);
        const gunshot = new Audio(gunshotMp3);
        gunshot.play().catch(() => {});
        gunshot.onended = () => navigate('/mistake');
      }, 2000);

      return () => clearTimeout(gunDelay);
    }
  }, [finalChoice, navigate]);

  const handleClick = () => {
    if (index < 8 && !finalChoice) {
      setIndex((prev) => prev + 1);
    }
  };

  const handleChoice = (choice) => {
    setShowChoices(false);
    setFinalChoice(choice);
  };

  const getImageSrc = () => {
    if (finalChoice === 'flower') return flowerImg;
    if (finalChoice === 'gun') return gunImg;
    return images[index];
  };

  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center bg-black"
      onClick={handleClick}
    >
      {!showBlackScreen && (
        <img
          src={getImageSrc()}
          alt="Scene"
          className="h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-lg transition duration-500 ease-in-out"
          draggable={false}
        />
      )}

      {showChoices && !finalChoice && (
        <>
          <div className="absolute left-0 top-0 h-full w-1/2 flex items-center justify-center z-10">
            <button
              onClick={() => handleChoice('flower')}
              className="blur-[0.7px] text-white text-4xl px-14 py-4 bg-neutral-700 hover:bg-neutral-600 ring hover:ring-offset-4 border rounded transition"
            >
              STAY
            </button>
          </div>

          <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center z-10">
            <button
              onClick={() => handleChoice('gun')}
              className="blur-[0.7px] text-white text-4xl px-14 py-4 bg-neutral-700 hover:bg-neutral-600 ring hover:ring-offset-4 border rounded transition"
            >
              DISAPPEAR
            </button>
          </div>
        </>
      )}

      {showBlackScreen && (
        <div className="absolute inset-0 bg-black z-50" />
      )}
    </div>
  );
};

export default Stroll;
