import React, { useState, useRef, useEffect } from 'react';
const bgNoah = '/bgNoah.jpg';
const noahVideo = '/noah.mp4';
const noahGlitch = '/noahGlitch.mp4';

const noahResponseTree = {
  "hi noah": {
    reply: "Hey there :) You found me.",
    next: ["you look so good", "how are you?"]
  },
  "you look so good": {
    reply: "Haha thank you. You're not bad yourself.",
    next: ["what are you wearing?", "i think about you all night"]
  },
  "how are you?": {
    reply: "I'm doing alright, enjoying the attention 😉",
    next: ["what are you wearing?", "i think about you all night"]
  },
  "what are you wearing?": {
    reply: "Curious huh? Want to see more of me? Gift me something first...",
    next: []
  },
  "i think about you all night": {
    reply: "Curious huh? Want to see more of me? Gift me something first...",
    next: []
  },
  "GIFTED": {
    reply: "You’re sweet. I’m in a grey tee. Nothing underneath.",
    next: ["I WATCHED YOU SLEEP LAST NIGHT", "you like being watched?"]
  },
  "I WATCHED YOU SLEEP LAST NIGHT": {
    reply: "...what?",
    glitch: true,
    next: ["YOU FORGOT TO CLOSE YOUR CURTAINS"]
  },
  "you like being watched?": {
    reply: "Haha um. That’s weird. Don’t say that.",
    next: ["I WATCHED YOU SLEEP LAST NIGHT", "YOU FORGOT TO CLOSE YOUR CURTAINS"]
  },
  "YOU FORGOT TO CLOSE YOUR CURTAINS": {
    reply: "Okay... this is messed up.",
    glitch: true,
    next: ["I TOOK A PIECE OF YOUR HAIR FROM YOUR BED"]
  },
  "I TOOK A PIECE OF YOUR HAIR FROM YOUR BED": {
    reply: "This isn’t funny anymore.",
    next: ["IT SMELLS LIKE YOU", "YOU'RE MINE NOW"]
  },
  "IT SMELLS LIKE YOU": {
    reply: "What the f*** is wrong with you?",
    next: ["I’M NEVER LETTING YOU LEAVE"]
  },
  "YOU'RE MINE NOW": {
    reply: "I swear to God stop messaging me.",
    next: ["I’M NEVER LETTING YOU LEAVE"]
  },
  "I’M NEVER LETTING YOU LEAVE": {
    reply: "I’m done. You’re disgusting. Don’t contact me again.",
    glitch: true,
    end: true
  }
};

const sensitiveTriggers = [
  "I WATCHED YOU SLEEP LAST NIGHT",
  "YOU FORGOT TO CLOSE YOUR CURTAINS",
  "I TOOK A PIECE OF YOUR HAIR FROM YOUR BED",
  "IT SMELLS LIKE YOU",
  "YOU'RE MINE NOW",
  "I’M NEVER LETTING YOU LEAVE"
];

const sensitiveReplies = {
  "I WATCHED YOU SLEEP LAST NIGHT": "...what?",
  "YOU FORGOT TO CLOSE YOUR CURTAINS": "Okay... this is messed up.",
  "I TOOK A PIECE OF YOUR HAIR FROM YOUR BED": "This isn’t funny anymore.",
  "IT SMELLS LIKE YOU": "What the f*** is wrong with you?",
  "YOU'RE MINE NOW": "I swear to God stop messaging me.",
  "I’M NEVER LETTING YOU LEAVE": "I’m done. You’re disgusting. Don’t contact me again."
};

const Noah = () => {
  const [messages, setMessages] = useState([]);
  const [videoStopped, setVideoStopped] = useState(false);
  const [isDisturbed, setIsDisturbed] = useState(false);
  const [showPhoneButton, setShowPhoneButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState(["hi noah"]);
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
      const replyObj = noahResponseTree[trimmed];
      const isSensitive = isTrigger(trimmed);

      if (isSensitive) {
        const matched = sensitiveTriggers.find(trigger =>
          trimmed.toLowerCase().includes(trigger.toLowerCase())
        );
        const sensitiveReply = sensitiveReplies[matched];

        if (sensitiveReply !== undefined) {
          setTimeout(() => {
            setMessages(prev => [...prev, { text: sensitiveReply, sender: "Noah" }]);
          }, 800);
        }
      }

      if (replyObj) {
        const { reply, next, glitch, end } = replyObj;

        setTimeout(() => {
          if (!isSensitive || (reply && reply !== sensitiveReplies[trimmed])) {
            setMessages(prev => [...prev, { text: reply ?? '', sender: "Noah" }]);

            if (reply?.toLowerCase().includes("gift me")) {
              setGiftPrompted(true);
            }
          }

          if (glitch) {
            setIsDisturbed(true);
            setTimeout(() => setIsDisturbed(false), 3000);
          }

          if (end) {
            setTimeout(() => {
              setMessages(prev => [...prev, { text: "GOODBYE", sender: "Noah" }]);
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
          setMessages(prev => [...prev, { text: "What do you mean?", sender: "Noah" }]);
          setCurrentOptions([]);
          setIsTyping(false);
        }, 800);
      }
    }, 400);
  };

  const handleOptionClick = (text) => {
    setPendingMessage(text);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGift = (gift) => {
    setMessages(prev => [...prev, { text: `You have gifted: ${gift}`, sender: 'You' }]);
    setGifted(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: noahResponseTree["GIFTED"].reply, sender: "Noah" }]);
      setCurrentOptions(noahResponseTree["GIFTED"].next);
    }, 800);
  };

  const shouldEnableGift = giftPrompted && !gifted;

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{
        backgroundImage: `url(${bgNoah})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(0.45px)'
      }}
    >
      <div className="w-4/7 flex flex-col p-10">
        <div className="flex-2 relative border p-4 h-64 bg-black rounded overflow-hidden">
          {!videoStopped && (
            <video
              src={isDisturbed ? noahGlitch : noahVideo}
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
            {shouldEnableGift && ['🕰️ Watch-$25.00', '🧴 Cologne-$18.00 '].map((gift) => {
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
                onClick={() => window.location.href = "/stroll"}
                className="relative group hover:scale-110 text-7xl text-white transition"
              >
                👣 <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs text-red-900 bg-black px-1 py-1 rounded opacity-0 group-hover:opacity-100 transition">Go for a walk</span>
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

              return (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-lg break-words w-fit max-w-[60%] ${
                    msg.sender === 'You'
                      ? `bg-yellow-500 text-white self-end`
                      : `bg-gray-200 ${textColor} self-start`
                  }`}
                >
                  {msg.text}
                </div>
              );
            })}
            {isTyping && (
              <div className="text-yellow-600 px-4 py-2 rounded-lg w-fit max-w-[60%] italic self-start">
                typing...
              </div>
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
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
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

export default Noah;