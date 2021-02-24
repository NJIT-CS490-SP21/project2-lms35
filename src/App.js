import './assets/styles/App.css';
import Game from "./views/Game";
import {ContextProvider as GameContextProvider} from "./context/game";
import {ContextProvider as UserContextProvider} from "./context/user";
import io from "socket.io-client";

const socket = io(); // Connects to socket connection

function App() {
    return (
        <GameContextProvider>
            <UserContextProvider>
                <div className="App">
                    <header className="App-header">
                        <Game socket={socket}/>
                    </header>
                </div>
            </UserContextProvider>
        </GameContextProvider>
    );
}

export default App;
