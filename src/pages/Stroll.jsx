import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import m1 from '../assets/maps/m1.jpg';
import m2 from '../assets/maps/m2.jpg';
import m3 from '../assets/maps/m3.jpg';
import m4 from '../assets/maps/m4.jpg';
import m5 from '../assets/maps/m5.jpg';
import m6 from '../assets/maps/m6.jpg';
import m7 from '../assets/maps/m7.jpg';
import m8 from '../assets/maps/m8.jpg';
import m9 from '../assets/maps/m9.jpg';

import flowerImg from '../assets/flower.jpg';
import gunImg from '../assets/gun.jpg';
import gunshotMp3 from '../assets/gunshot.mp3';
import eerieAudio from '../assets/eerie.mp3';

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
