import './assets/styles/App.css';
import io from 'socket.io-client';
import React from 'react';
import { ContextProvider as GamesContextProvider } from './context/games';
import { ContextProvider as GameContextProvider } from './context/game';
import { ContextProvider as UserContextProvider } from './context/user';
import { ContextProvider as LeaderboardContextProvider } from './context/leaderboard';
import Login from './views/Login';

const socket = io(); // Connects to socket connection

function App() {
  return (
    <GamesContextProvider>
      <GameContextProvider>
        <UserContextProvider>
          <LeaderboardContextProvider>
            <div className="App">
              <header className="App-header">
                <Login socket={socket} />
              </header>
            </div>
          </LeaderboardContextProvider>
        </UserContextProvider>
      </GameContextProvider>
    </GamesContextProvider>
  );
}

export default App;
