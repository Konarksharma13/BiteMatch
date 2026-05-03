# 🍽️ BiteMatch

**BiteMatch** is a gamified, Tinder-style food recommendation engine designed for live events and stadiums. It turns the often-overwhelming experience of finding what to eat into an addictive, personalized swipe-to-match game.

Instead of endlessly scrolling through a boring list of food stalls, users swipe through vibrant cards of stadium food and stalls. Behind the scenes, the app tracks their preferences and generates a customized "Match Screen" showing their ultimate taste profile and pinpointing exactly which stall they should visit.

## ✨ Core Features

* **Tinder-Style Swiping**: Swipe Right (Like), Swipe Left (Nope), or Swipe Up (Fave) on food items and stalls.
* **Match Screen Experience**: A highly-animated, celebratory final screen that pairs the user with their #1 most-liked food category.
* **Smart Recommendations**: Evaluates swipe data locally to generate a personalized "Custom Menu" of top-rated foods.
* **Stall Wayfinding**: Directly links your matched foods to their physical locations (e.g., "📍 Go to Pizza Arena").
* **Dynamic Engagement Badges**: Floating, animated card badges (e.g., "🔥 1,240 fans liked Pizza today!") to create a live, social feel.
* **Personality Profiling**: Analyzes swipe patterns to assign a fun personality type (e.g., "🔥 Top 5% Food Explorer").

## 🛠️ Tech Stack

* **Frontend Framework**: React (Vite)
* **Styling**: Tailwind CSS
* **Animations**: Framer Motion
* **Swipe Mechanics**: `react-tinder-card`
* **Icons & Notifications**: `react-icons`, `react-hot-toast`

## 🚀 Getting Started

No backend required. The application handles all scoring, tracking, and rendering entirely client-side using React state.

1. Clone the repository:
   ```bash
   git clone https://github.com/Konarksharma13/BiteMatch.git
   ```
2. Navigate into the directory:
   ```bash
   cd BiteMatch
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📱 Responsive Layout
The app is built mobile-first. On mobile devices, the Match Screen naturally scrolls down from the main Match Hero to the recommendations. On larger desktop screens, it seamlessly transforms into a fixed 50/50 split-screen layout so the match animation stays anchored while the recommendations scroll independently.
