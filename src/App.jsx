import React, { useState, useRef, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { FaTimes, FaStar, FaHeart } from 'react-icons/fa';

const CARDS = [
  { id: 1, type: "food", name: "Classic Cheeseburger", emoji: "🍔", desc: "Juicy, cheesy goodness.", link: "Burger Blast", bg: "from-orange-400 to-red-500" },
  { id: 2, type: "stall", name: "Pizza Arena", emoji: "🍕🏆", desc: "The best wood-fired pizzas.", link: "Pepperoni Pizza", bg: "from-red-500 to-pink-600" },
  { id: 3, type: "food", name: "Loaded Fries", emoji: "🍟", desc: "Smothered in cheese and bacon.", link: "Greasy Fries", bg: "from-yellow-500 to-amber-600" },
  { id: 4, type: "stall", name: "Taco Town", emoji: "🌮🌵", desc: "Authentic Mexican street food.", link: "Spicy Beef Tacos", bg: "from-emerald-400 to-teal-600" },
  { id: 5, type: "food", name: "Sugar Churros", emoji: "🍩", desc: "Crispy and covered in cinnamon.", link: "Sweet Treats", bg: "from-purple-400 to-indigo-500" },
  { id: 6, type: "stall", name: "Healthy Bites", emoji: "🥗✨", desc: "Fresh organic salads and wraps.", link: "Caesar Salad", bg: "from-green-400 to-emerald-500" },
  { id: 7, type: "food", name: "BBQ Wings", emoji: "🍗", desc: "Spicy and tangy.", link: "Wing Masters", bg: "from-rose-500 to-red-700" },
  { id: 8, type: "stall", name: "Noodle House", emoji: "🍜🥢", desc: "Hot, slurpy ramen bowls.", link: "Spicy Ramen", bg: "from-blue-500 to-cyan-600" },
  { id: 9, type: "food", name: "Margherita Slice", emoji: "🍕", desc: "Simple, fresh basil and mozzarella.", link: "Pizza Arena", bg: "from-red-400 to-rose-600" },
  { id: 10, type: "stall", name: "Burger Blast", emoji: "🍔💥", desc: "Smashburgers and thick shakes.", link: "Classic Cheeseburger", bg: "from-amber-500 to-orange-600" },
];

const FloatingHearts = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 1, scale: Math.random() * 0.5 + 0.5 }}
          animate={{ y: '-20vh', opacity: 0, rotate: Math.random() * 360 - 180 }}
          transition={{ duration: Math.random() * 3 + 3, repeat: Infinity, ease: 'linear', delay: Math.random() * 3 }}
          className="absolute text-pink-500 text-3xl drop-shadow-lg"
        >
          {['❤️', '✨', '💖', '🎉'][Math.floor(Math.random() * 4)]}
        </motion.div>
      ))}
    </div>
  );
};

function App() {
  const [cards] = useState(CARDS);
  const [currentIndex, setCurrentIndex] = useState(CARDS.length - 1);
  const [scores, setScores] = useState({ foods: {} });
  const [overlayMsg, setOverlayMsg] = useState(null);

  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () => Array(CARDS.length).fill(0).map(() => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const showOverlay = (dir) => {
    if (dir === 'right') setOverlayMsg({ text: '🔥 LIKE', color: 'text-green-400', border: 'border-green-400', shadow: 'drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]' });
    else if (dir === 'left') setOverlayMsg({ text: '❌ NOPE', color: 'text-red-500', border: 'border-red-500', shadow: 'drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]' });
    else if (dir === 'up') setOverlayMsg({ text: '⭐ FAVE', color: 'text-yellow-400', border: 'border-yellow-400', shadow: 'drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]' });

    setTimeout(() => setOverlayMsg(null), 600);
  };

  const swipe = async (dir) => {
    if (currentIndex >= 0 && currentIndex < cards.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const swiped = (direction, cardIndex) => {
    showOverlay(direction);

    if (direction === 'right' || direction === 'up') {
      const card = cards[cardIndex];
      const points = direction === 'up' ? 2 : 1;
      const foodName = card.type === 'food' ? card.name : card.link;

      setScores(prev => ({
        foods: { ...prev.foods, [foodName]: (prev.foods[foodName] || 0) + points }
      }));
    }

    updateCurrentIndex(cardIndex - 1);
  };

  const outOfFrame = (idx) => {
    if (currentIndexRef.current >= idx) {
      updateCurrentIndex(idx - 1);
    }
  };

  const restart = () => {
    setScores({ foods: {} });
    updateCurrentIndex(CARDS.length - 1);
  };

  const getTop3 = (obj) => {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const topFoods = getTop3(scores.foods);

  // Logic to determine main match
  const topMatchName = topFoods.length > 0 ? topFoods[0][0] : "Mystery Dish";
  const topMatchCard = CARDS.find(c => c.name === topMatchName || c.link === topMatchName) || CARDS[0];

  const getPersonalityMessage = () => {
    if (topFoods.length === 0) return "You didn't swipe right on anything... tough crowd! 🧊";
    const top = topMatchName.toLowerCase();
    if (top.includes('burger') || top.includes('fries')) return "You clearly love juicy, filling comfort food 🍔";
    if (top.includes('pizza') || top.includes('slice')) return "A true pizza aficionado — classic, cheesy, perfect 🍕";
    if (top.includes('taco') || top.includes('wings') || top.includes('spicy')) return "Spicy, fast, and bold — that’s your vibe 🌶️";
    if (top.includes('salad') || top.includes('healthy')) return "Fresh, crisp, and clean — keeping it healthy! 🥗";
    if (top.includes('churro') || top.includes('sugar') || top.includes('sweet')) return "Always leaving room for dessert! 🍩";
    return "You are a stadium snack champion 🏟️";
  };

  const getFoodStall = (foodName) => {
    const card = CARDS.find(c => c.name === foodName || c.link === foodName);
    if (!card) return "Main Food Court";
    return card.type === 'food' ? card.link : card.name;
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden select-none font-sans text-white">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
        <h1 className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent flex items-center gap-2 drop-shadow-lg">
          BiteMatch 🍽️
        </h1>
      </header>

      {/* Main Area */}
      <div className="flex-1 relative flex flex-col justify-center items-center pt-24 pb-32 md:pb-36">
        {currentIndex >= 0 ? (
          <>
            <div className="relative w-[90%] max-w-sm aspect-[3/4] sm:aspect-[4/5] mx-auto z-10 flex-shrink-0">

              {currentIndex === cards.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-14 w-full text-center pointer-events-none z-10"
                >
                  <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20 shadow-lg animate-pulse inline-block">
                    👋 Swipe cards to decide your feast!
                  </span>
                </motion.div>
              )}

              {cards.map((card, index) => (
                <TinderCard
                  ref={childRefs[index]}
                  className="absolute inset-0"
                  key={card.id}
                  onSwipe={(dir) => swiped(dir, index)}
                  onCardLeftScreen={() => outOfFrame(index)}
                  preventSwipe={['down']}
                  swipeRequirementType="position"
                >
                  <div
                    className={`w-full h-full bg-gradient-to-br ${card.bg} rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-end p-8 border border-white/20 cursor-grab active:cursor-grabbing overflow-hidden group`}
                  >
                    <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/10 shadow-lg">
                      <span className="text-sm font-black uppercase tracking-widest text-white/90">
                        {card.type === 'food' ? '🍔 Food Item' : '⛺ Food Stall'}
                      </span>
                    </div>

                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                      className="absolute top-24 right-6 max-w-[150px] text-right pointer-events-none z-20"
                    >
                      <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/30 shadow-xl text-xs font-bold leading-snug drop-shadow-md">
                        {index % 2 === 0
                          ? `🔥 ${Math.floor(Math.random() * 2000) + 500} fans liked ${card.name.split(' ')[0]} today!`
                          : `✨ Trending in your stadium right now!`}
                      </div>
                    </motion.div>

                    <div className="absolute top-1/4 -right-10 text-[12rem] opacity-20 pointer-events-none rotate-12 drop-shadow-2xl">
                      {card.emoji}
                    </div>

                    <div className="relative z-10 space-y-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent -mx-8 -mb-8 p-8 pt-24">
                      <h2 className="text-4xl md:text-5xl font-black leading-tight drop-shadow-lg text-white">
                        {card.name}
                      </h2>

                      <p className="text-lg font-medium text-white/80 drop-shadow-sm">
                        {card.desc}
                      </p>

                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-sm md:text-base font-bold bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
                          {card.type === 'food' ? `📍 Sold at: ${card.link}` : `🍳 Signature: ${card.link}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </TinderCard>
              ))}
            </div>

            <div className="absolute bottom-6 md:bottom-12 left-0 w-full flex justify-center items-center gap-6 z-20">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => swipe('left')}
                className="flex items-center justify-center bg-slate-900 text-red-500 p-5 rounded-full border border-red-500/30 shadow-[0_10px_30px_rgba(239,68,68,0.2)] hover:shadow-[0_10px_30px_rgba(239,68,68,0.4)] transition-all z-20"
              >
                <FaTimes className="text-3xl" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => swipe('up')}
                className="flex items-center justify-center bg-slate-900 text-yellow-400 p-4 rounded-full border border-yellow-400/30 shadow-[0_10px_30px_rgba(250,204,21,0.2)] hover:shadow-[0_10px_30px_rgba(250,204,21,0.4)] transition-all mb-4 z-20"
              >
                <FaStar className="text-2xl" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => swipe('right')}
                className="flex items-center justify-center bg-slate-900 text-green-500 p-5 rounded-full border border-green-500/30 shadow-[0_10px_30px_rgba(34,197,94,0.2)] hover:shadow-[0_10px_30px_rgba(34,197,94,0.4)] transition-all z-20"
              >
                <FaHeart className="text-3xl" />
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-950 flex flex-col lg:flex-row overflow-y-auto overflow-x-hidden z-30"
          >
            <FloatingHearts />

            {/* Match Screen Hero Section - Fixed on lg screens */}
            <div className="min-h-[70vh] lg:min-h-screen lg:w-1/2 flex flex-col justify-center items-center p-6 pt-28 lg:pt-6 relative z-10 lg:sticky lg:top-0">
              <motion.h2
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 drop-shadow-xl text-center mb-2"
              >
                🔥 IT’S A MATCH!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-xl font-bold text-white/80 mb-8 text-center"
              >
                You matched with: <span className="text-pink-400">{topMatchName.toUpperCase()}</span> {topMatchCard.emoji}
              </motion.p>

              {/* Glowing Match Card */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.6, delay: 0.7 }}
                className="relative w-56 h-56 bg-gradient-to-br from-pink-600 to-orange-500 rounded-full flex justify-center items-center border-4 border-pink-400 shadow-[0_0_80px_rgba(236,72,153,0.5)] z-20"
              >
                <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-pink-400"></div>
                <span className="text-8xl drop-shadow-2xl">{topMatchCard.emoji}</span>
              </motion.div>

              {/* Match Bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1.2 }}
                className="bg-white text-slate-900 px-6 py-4 rounded-3xl rounded-tl-sm font-bold shadow-2xl mt-8 max-w-[85%] text-center text-lg flex flex-col gap-1"
              >
                <span>"You and {topMatchName} are a perfect match ❤️"</span>
                <span className="text-sm text-pink-600 font-black uppercase tracking-widest mt-1">📍 Go to {getFoodStall(topMatchName)}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                className="text-center mt-8 space-y-3"
              >
                <div className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-yellow-500/30">
                  🔥 Top 5% Food Explorer
                </div>
                <p className="text-lg font-medium text-slate-300 italic px-6">
                  {getPersonalityMessage()}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
                className="mt-12 animate-bounce opacity-50 lg:hidden"
              >
                <span className="text-xs uppercase tracking-widest font-bold">Scroll for Recommendations 👇</span>
              </motion.div>
            </div>

            {/* Recommendations Section - Scrollable on right for lg screens */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}
              className="bg-slate-900/80 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-slate-800 p-6 md:p-12 rounded-t-[3rem] lg:rounded-t-none lg:rounded-l-[3rem] relative z-10 lg:w-1/2 lg:min-h-screen flex flex-col justify-center"
            >
              <h3 className="text-3xl font-black text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Your Custom Menu
              </h3>

              <div className="space-y-10 max-w-2xl mx-auto w-full">
                {/* Top Foods */}
                <section>
                  <h4 className="text-xl font-bold mb-4 text-orange-400 border-b border-slate-700 pb-2">
                    🍽️ Top Food Recommendations
                  </h4>
                  {topFoods.length > 0 ? (
                    <div className="grid gap-3">
                      {topFoods.map(([name], i) => {
                        const stallName = getFoodStall(name);
                        return (
                          <div key={name} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                            <span className="text-3xl">{CARDS.find(c => c.name === name || c.link === name)?.emoji || '🍔'}</span>
                            <div>
                              <p className="font-bold text-lg leading-tight text-white">{name}</p>
                              <p className="text-sm font-medium text-emerald-400 mt-1">📍 Go to {stallName}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : <p className="text-slate-500 italic">No foods liked.</p>}
                </section>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 space-y-4 max-w-sm mx-auto w-full">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={restart}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-black text-lg rounded-2xl shadow-[0_10px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_10px_30px_rgba(236,72,153,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <span>🎲 Try New Taste Profile</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Swipe Overlay Animation */}
      <AnimatePresence>
        {overlayMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: -5 }}
            exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.3 } }}
            className="absolute inset-0 pointer-events-none flex justify-center items-center z-50"
          >
            <div className={`text-6xl md:text-7xl font-black uppercase tracking-tighter ${overlayMsg.color} ${overlayMsg.shadow} border-8 ${overlayMsg.border} px-8 py-4 rounded-[2.5rem] bg-slate-950/60 backdrop-blur-md shadow-2xl`}>
              {overlayMsg.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
