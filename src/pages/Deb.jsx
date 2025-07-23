import React, { useState, useRef, useEffect } from 'react';
import bgDeb from '../assets/bgDeb.jpg';
import debVideo from '../assets/deb.mp4';
import debGlitch from '../assets/DebGlitch.mp4';

const Deb = () => {
  const profileName = 'Deb';
  const phoneRedirect = '/phone';

  const responseTree = {
    "hi": { reply: "hey ,miss me ?", next: ["how are you", "we just met"] },
    "hello princess": { reply: "hey ,miss me ?", next: ["how are you", "we just met"] },
    "how are you": { reply: "im great and you", next: ["i'm great", "Someone's in the mood"] },
    "we just met": { reply: "and?", next: ["i'm great", "Someone's in the mood"] },
    "i'm great": { reply: "i feel watched, don't you?", next: ["WHAT ARE YOU WEARING"] },
    "Someone's in the mood": { reply: "i feel watched, don't you?", next: ["WHAT ARE YOU WEARING"] },
    "WHAT ARE YOU WEARING": { reply: "gift me something and i'll describe it for you", next: [] },
    "GIFTED": { reply: "come find out.", next: ["I WANT TO BITE YOUR NECK", "you sure?"] },
    "I WANT TO BITE YOUR NECK": { reply: "okay relax", next: ["TELL ME WHERE YOU LIVE"] },
    "you sure?": { reply: "okay relax", next: ["TELL ME WHERE YOU LIVE"] },
    "TELL ME WHERE YOU LIVE": { reply: "haha you're funny", next: ["I'M NOT KIDDING"] },
    "I'M NOT KIDDING": { reply: "um", glitch: true, next: ["YOU'RE JUST BY THE 5TH STREET AREN'T YOU"] },
    "YOU'RE JUST BY THE 5TH STREET AREN'T YOU": { reply: "okay this is getting creepy", next: ["YOU'RE MINE, I'M GOING TO CHAIN U AND KEEP U WITH ME"] },
    "YOU'RE MINE, I'M GOING TO CHAIN U AND KEEP U WITH ME": { reply: "i can't do this i'm sorry. You're a f*****g creep.", glitch: true, end: true },
    "I'm kidding haha": { reply: "ha that was creepy", next: ["haha I want to EAT YOU W***E"] },
    "haha I want to EAT YOU WHORE(blurred out)": { reply: "i can't do this i'm sorry. You're a f*****g creep.", glitch: true, end: true }
  };

  const sensitiveTriggers = [
    "I'M NOT KIDDING",
    "YOU'RE JUST BY THE 5TH STREET AREN'T YOU",
    "YOU'RE MINE, I'M GOING TO CHAIN U AND KEEP U WITH ME",
    "haha I want to EAT YOU W***E"
  ];

  const sensitiveReplies = {
    "I'M NOT KIDDING": "um",
    "YOU'RE JUST BY THE 5TH STREET AREN'T YOU": "okay this is getting creepy",
    "YOU'RE MINE, I'M GOING TO CHAIN U AND KEEP U WITH ME": "i can't do this i'm sorry. You're a f*****g creep.",
    "haha I want to EAT YOU W***E": "i can't do this i'm sorry. You're a f*****g creep."
  };

  const giftOptions = ['🌹 Flowers-$10.00', '💄 Lipstick-$15.00'];
  const initialOptions = ["hi", "hello princess"];

  const [messages, setMessages] = useState([]);
  const [videoStopped, setVideoStopped] = useState(false);
  const [isDisturbed, setIsDisturbed] = useState(false);
  const [showPhoneButton, setShowPhoneButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState(initialOptions);
  const [pendingMessage, setPendingMessage] = useState('');
  const [gifted, setGifted] = useState(false);
  const [giftPrompted, setGiftPrompted] = useState(false);
  const messagesEndRef = useRef(null);

  const isTrigger = (input) =>
    sensitiveTriggers.some(trigger => input.toLowerCase().includes(trigger.toLowerCase()));

  const handleSendMessage = () => {
    const trimmed = pendingMessage.trim();
    if (!trimmed || videoStopped) return;

    setMessages(prev => [...prev, { text: trimmed, sender: 'You' }]);
    setPendingMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const replyObj = responseTree[trimmed];
      const isSensitive = isTrigger(trimmed);

      if (isSensitive) {
        const matched = sensitiveTriggers.find(trigger =>
          trimmed.toLowerCase().includes(trigger.toLowerCase())
        );
        const sensitiveReply = sensitiveReplies[matched];
        if (sensitiveReply) {
          setTimeout(() => {
            setMessages(prev => [...prev, { text: sensitiveReply, sender: profileName }]);
          }, 800);
        }
      }

      if (replyObj) {
        const { reply, next, glitch, end } = replyObj;

        setTimeout(() => {
          if (!isSensitive || (reply && reply !== sensitiveReplies[trimmed])) {
            setMessages(prev => [...prev, { text: reply ?? '', sender: profileName }]);
            if (reply?.toLowerCase().includes("gift me something")) setGiftPrompted(true);
          }

          if (glitch) {
            setIsDisturbed(true);
            setTimeout(() => setIsDisturbed(false), 3000);
          }

          if (end) {
            setTimeout(() => {
              setMessages(prev => [...prev, { text: "GOODBYE", sender: profileName }]);
              setVideoStopped(true);
              setShowPhoneButton(true);
            }, 1000);
            setCurrentOptions([]);
          } else {
            setCurrentOptions(next ?? []);
          }

          setIsTyping(false);
        }, isSensitive ? 1600 : 800);
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, { text: "I don't get it...", sender: profileName }]);
          setCurrentOptions([]);
          setIsTyping(false);
        }, 800);
      }
    }, 400);
  };

  const handleOptionClick = (text) => setPendingMessage(text);

  const handleGift = (gift) => {
    setMessages(prev => [...prev, { text: `You have gifted: ${gift}`, sender: 'You' }]);
    setGifted(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Come find out.", sender: profileName }]);
      setCurrentOptions(["I WANT TO BITE YOUR NECK", "you sure?"]);
    }, 800);
  };

  const shouldEnableGift = giftPrompted && !gifted;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{
        backgroundImage: `url(${bgDeb})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(0.45px)',
      }}
    >
      <div className="w-4/7 flex flex-col p-10">
        <div className="flex-2 relative border p-4 h-64 bg-black rounded overflow-hidden">
          {!videoStopped && (
            <video
              src={isDisturbed ? debGlitch : debVideo}
              autoPlay
              muted
              loop
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 text-center p-4">
          <h2 className="text-lg font-semibold mb-3 text-white">Gifts:</h2>
          <div className="flex justify-center items-center flex-wrap gap-4">
            {shouldEnableGift &&
              giftOptions.map((gift) => {
                const [emoji, label] = gift.split(' ');
                return (
                  <button
                    key={gift}
                    onClick={() => handleGift(gift)}
                    className="relative group text-7xl p-4 rounded-full hover:scale-110 transition transform"
                  >
                    <span>{emoji}</span>
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      {label}
                    </span>
                  </button>
                );
              })}
            {showPhoneButton && (
              <button
                onClick={() => (window.location.href = phoneRedirect)}
                className="relative group hover:scale-110 text-7xl text-white transition"
              >
                📞
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs text-red-900 bg-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  Phone
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-3/7 flex flex-col px-20 pt-5" style={{ height: 'calc(100vh - 2rem)' }}>
        <div className="flex-1 overflow-y-auto bg-white p-4 rounded shadow overflow-x-hidden">
          <div className="flex flex-col space-y-3">
            {messages.map((msg, index) => {
              const isAllCaps = msg.text === msg.text.toUpperCase() && /[A-Z]/.test(msg.text);
              const isFromBot = msg.sender !== 'You';
              const textColor = isFromBot && isAllCaps ? 'text-red-600' : 'text-black';
              const bubbleClasses = msg.sender === 'You'
                ? 'bg-pink-500 text-white self-end'
                : `bg-gray-200 ${textColor} self-start`;
              return (
                <div key={index} className={`px-4 py-2 rounded-lg break-words w-fit max-w-[60%] ${bubbleClasses}`}>
                  {msg.text}
                </div>
              );
            })}
            {isTyping && (
              <div className="text-pink-600 px-4 py-2 rounded-lg w-fit max-w-[60%] italic self-start">typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={pendingMessage}
            readOnly
            tabIndex={-1}
            className="flex-1 px-3 py-2 border rounded-lg bg-neutral-700 cursor-not-allowed caret-transparent"
            placeholder="Use the options below to respond..."
          />
          <button
            onClick={handleSendMessage}
            disabled={!pendingMessage.trim()}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Send
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {currentOptions.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(option)}
              className="bg-neutral-800 text-white px-4 py-2 rounded hover:bg-neutral-700 transition"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deb;
