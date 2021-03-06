import './assets/styles/App.css';
import Game from "./views/Game";
import {ContextProvider as GamesContextProvider} from "./context/games.js";
import {ContextProvider as GameContextProvider} from "./context/game.js";
import {ContextProvider as UserContextProvider} from "./context/user.js";
import {ContextProvider as LeaderboardContextProvider} from "./context/leaderboard";
import io from "socket.io-client";
import GamesList from "./views/GamesList";

const socket = io(); // Connects to socket connection

function App() {
    return (
        <GamesContextProvider>
            <GameContextProvider>
                <UserContextProvider>
                    <LeaderboardContextProvider>
                        <div className="App">
                            <header className="App-header">
                                <GamesList socket={socket}/>
                            </header>
                        </div>
                    </LeaderboardContextProvider>
                </UserContextProvider>
            </GameContextProvider>
        </GamesContextProvider>
    );
}

export default App;
