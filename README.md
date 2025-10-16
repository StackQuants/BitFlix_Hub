# Bitflix Gaming UI

A modern, mobile-first gaming UI built with React, TypeScript, and Vite. Bitflix lets players connect a Stacks wallet, play chess, track streaks, unlock games, and view global leaderboards — all wrapped in a sleek, app-like experience.

## Features

- **Vite + React + TypeScript**: Fast dev server and optimized builds
- **Mobile-first UI**: 390×844 device frame, Tailwind-based styling
- **Wallet onboarding**: Connect Stacks wallets (Leather; scaffolding for Hiro/Xverse)
- **Chess gameplay**: Local AI opponent, timers, move highlighting, basic rules, castling, and simple AI
- **Daily limits & streaks**: Track daily games and win/play streaks per user
- **Leaderboards**: Global/daily boards with podium and list views
- **Wallet screen**: Fetch live STX balance via Hiro Testnet API
- **Game unlocks**: Persist unlocked games per wallet in `localStorage`
- **Built-in chatbot**: Bitflix AI Assistant UI (local, rule-based responses)

## Tech Stack

- React 19, React DOM
- TypeScript 5
- Vite 6 with `@vitejs/plugin-react`
- Tailwind via CDN (in `index.html`)
- Stacks ecosystem libs: `@leather.io/sdk`, `@stacks/*`

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

- App runs on `http://localhost:3000`
- Vite dev server is configured to bind to `0.0.0.0`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
BetFlix_UI-main/
  App.tsx                 # Root app shell, tabs, auth state, routing-like view switch
  index.html              # Tailwind CDN, fonts, Vite entry, mobile-friendly document
  index.tsx               # React root bootstrap
  vite.config.ts          # Vite + React plugin, env exposure, alias '@' → project root
  tsconfig.json
  package.json
  public/                 # Static assets (game images)
  components/             # UI screens and widgets
    EntryScreen.tsx       # Name input + connect Stacks wallet (Leather)
    HomeScreen.tsx        # Live/coming-soon games, AI assistant launcher
    ChessGameScreen.tsx   # Chess board, simple AI, timers, moves
    LeaderboardScreen.tsx # Podium + lists, daily/global tabs
    WalletScreen.tsx      # STX balances via Hiro Testnet API
    BottomNav.tsx         # Tab bar (Home/Rankings/Profile/Wallet)
    BitflixChatbot.tsx    # In-app chatbot UI (local responses)
    icons/                # Tab icons
    hooks/useStacks.ts    # Wallet connection hook scaffold
  constants.ts            # Seed player and game data
  types.ts                # App types (Tab, User, Game, etc.)
  README.md
```

## Environment Variables

Vite exposes env values via `define` in `vite.config.ts`:

- `GEMINI_API_KEY` (optional): Available as `process.env.GEMINI_API_KEY` if you extend the chatbot or other AI features.

Create a `.env` file in the project root if needed:

```bash
GEMINI_API_KEY=your_key_here
```

Note: Do not commit real secrets. Vite inlines env at build-time when referenced.

## Wallet Integration

- Current UI supports Leather wallet detection and address retrieval from `window.LeatherProvider`.
- On successful connect, the app stores minimal user data in `localStorage` (`bitflix_user`) and ties unlocked games to the wallet (`bitflix_unlocked_<address>`).
- STX balances are fetched from Hiro Testnet API in `WalletScreen.tsx`.

If you target Hiro/Xverse as well, add their providers and connection flows in `components/hooks/useStacks.ts` and `EntryScreen.tsx`.

## Chess Gameplay Notes

- Pieces: Unicode set; simple legal move generation with king-safety filtering.
- Features: Castling, check detection, timers (10 minutes per side), basic AI with capture/center bias.
- Daily limit: 17 games/day tracked in `localStorage` (`chessGamesData`).
- Rewards: Example values shown in UI; adapt to real economics as needed.

## Leaderboards and Streaks

- Leaderboards: Global and Daily tabs; demo daily wins generated client-side.
- Streaks: `StreakData` tracks current/best win streaks, consecutive play days, and totals; updated after each game.

## Styling

- TailwindCSS via CDN in `index.html`.
- Inter font loaded via Google Fonts.
- App renders into a centered mobile frame with rounded corners and shadows for a native feel.

## Development Tips

- Types live in `types.ts`. Prefer strong types for new modules/components.
- Avoid catching errors without handling; surface user-friendly toasts where relevant.
- Keep components focused; lift shared state to `App.tsx` or a state manager if needed.
- Use `localStorage` keys consistently: `bitflix_user`, `bitflix_unlocked_<wallet>`.

## Deployment

- Any static host that supports Vite build output will work (e.g., Vercel, Netlify, Cloudflare Pages, GitHub Pages).
- Build command: `npm run build`
- Output directory: `dist/`

## Roadmap Ideas

- Real-time multiplayer with websockets and authoritative server
- On-chain tournaments and verifiable match results
- Proper wallet adapters for Hiro/Xverse and mainnet/testnet toggles
- Server-backed leaderboards and anti-cheat
- Progressive Web App (PWA) support
- Full AI backend for the chatbot

---

## Step-by-Step User Guide (with images)

A practical walkthrough of Bitflix from onboarding to rewards. Screens shown are representative; your UI may vary as features evolve.

### 1) Overview: Monthly Rotations & Rewards

- Each month, Bitflix features one live title (e.g., Chess Championship) with upcoming games in rotation (e.g., Racing, Trivia, Poker).
- Players join the monthly competition by paying a small entry fee to the prize pool. Example: 50 STX per player.
- At month end:
  - Top 10 overall on the global leaderboard receive STX rewards from the pool.
  - Top 3 per country also receive country‑level awards.
  - Future: The “King” (rank #1) of each game receives a unique NFT badge/crown.

State at this point: deciding to participate → ready to connect wallet.

### 2) Connect Wallet & Create Player

- Open Bitflix, enter your display name, and connect a Stacks wallet (Leather supported in MVP).
- We guide you through a simple 1‑tap connect flow.

Screenshot:

![Entry / Connect Screen](./image1.png)

State at this point: Not connected → Connected with wallet address; local profile created.

### 3) Join This Month’s Game (Entry Fee → Pool)

- From `Home`, select the laive game for the month (e.g., Chess Championship).
- Pay the entry fee (e.g., 50 STX) to the pool wallet address.
  - Pool funds are reserved for rewards distribution at the end of the month.
- After payment confirmation, you’re enrolled and can start playing.

Screenshots:

- Home (Live Game Highlight):

![Home - Chess Live](./public/chess.png)

- Upcoming Games Preview:

![Upcoming Games](./public/race.png)

State at this point: Enrolled for the month → eligible to compete and earn.

### 4) Choose Gameplay Mode: AI or Players

- Tap ‘Play’ to enter the Arena for this month’s game.
- Modes:
  - Play vs AI: instant practice and quick matches.
  - Play vs Players: compete with real users (creator/community tournaments coming).

State at this point: Matchmaking → match started.

### 5) Play Limits & Fairness (Daily Cap)

- To keep games fair and competitive, you can play **up to 17 matches per day**.
- The counter resets at midnight UTC.

State at this point: Track today’s remaining matches → plan your sessions.

### 6) Earn FP (Flix Points) Per Win

- Win a game: earn **+5 FP**.
- Lose a game: **0 FP**.
- FP are internal points designed to convert to real STX using transparent conversion metrics (to be finalized and published).

State at this point: FP balance increases with wins → motivation to return.

### 7) Track Wallet, FP, and History

- `Wallet` shows your STX balance (fetched via Hiro Testnet API in MVP).
- Your FP (Flix Points) are displayed and summed from your wins.
- `Profile` and Leaderboards reflect your progress and match history.

State at this point: Clear visibility into balances, performance, and streaks.

### 8) Leaderboards & End‑of‑Month Rewards

- Leaderboards rank players globally and (optionally) by country.
- At month end:
  - Rewards are distributed from the pool to the **Top 10 overall** and the **Top 3 per country**.
  - Future: “Game King” NFT to the #1 player.

Screenshot (Representative):

![Leaderboards Preview](./public/trivia.png)

State at this point: Competition concluded → rewards distributed.

### 9) Monthly Game Rotation

- After rewards are sent, a new game goes live for the next month (e.g., Racing, Trivia, Poker).
- Players vote on which game should be listed next (voting module coming soon).

Screenshots (Game Art):

![Racing](./public/race.png)

![Poker](./public/poker.png)

State at this point: New season → fresh leaderboard and pool.
a
### 10) AI Assistant In‑Game

- An AI assistant is built into Bitflix to answer FAQs about earning FP, wallet connections, ratings, and more.
- Open it from the `Home` header to chat while you play.

State at this point: Faster help → fewer drop‑offs.

### 11) Social: Chat & Tipping (Planned)

- Global and friends chatrooms so you can coordinate matches and celebrate wins.
- Tipping: send a small amount of STX to help friends who need funds to join a game.

State at this point: Sociala engagement → community growth and retention.

### 12) Staking & Voting (Planned)

- Staking STX within the app to unlock perks and utility.
- Voting: let the community choose the next month’s featured game.

State at this point: Deeper utility → stronger economic loop.

---

## Quick Gallery

- Entry / Connect: `./image1.png`
- Chess Live Card: `./public/chess.png`
- Upcoming Racing: `./public/race.png`
- Trivia / Leaderboard Art: `./public/trivia.png`
- Poker Art: `./public/poker.png`

---

## Glossary

- **STX**: Stacks network token used for entry fees and rewards.
- **FP (Flix Points)**: In‑app points earned by wins; designed to convert to STX via published metrics.
- **Pool Wallet**: Address that aggregates entry fees and funds monthly rewards.

## Notes & Disclaimers

- MVP uses Stacks Testnet APIs for balances. Mainnet support, real payouts, audited contracts, and NFT rewards are on the roadmap.
- Exact FP→STX conversion metrics will be defined and published prior to enablement.

