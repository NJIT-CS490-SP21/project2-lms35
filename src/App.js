import './assets/styles/App.css';
import Game from "./views/Game";
import {ContextProvider as GameContextProvider} from "./context/game";
import {ContextProvider as UserContextProvider} from "./context/user";
import {ContextProvider as LeaderboardContextProvider} from "./context/leaderboard";
import io from "socket.io-client";

const socket = io(); // Connects to socket connection

function App() {
    return (
        <GameContextProvider>
            <UserContextProvider>
                <LeaderboardContextProvider>
                    <div className="App">
                        <header className="App-header">
                            <Game socket={socket}/>
                        </header>
                    </div>
                </LeaderboardContextProvider>
            </UserContextProvider>
        </GameContextProvider>
    );
}

export default App;
