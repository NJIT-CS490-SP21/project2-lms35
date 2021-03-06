import {Context as LeaderboardContext, updateLeaderboardAction} from "../context/leaderboard";
import {Context as UserContext} from "../context/user";
import {useContext, useEffect} from "react";
import {getLeaderboardApi} from "../api/api";
import LeaderboardEntry from "./LeaderboardEntry";


const Leaderboard = ({socket}) => {

    const user = useContext(UserContext)
    const {state, dispatch} = useContext(LeaderboardContext)

    const updateLeaderboard = () => getLeaderboardApi().then(data => dispatch(updateLeaderboardAction(data)))

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        updateLeaderboard()
        socket.on('leaderboard', updateLeaderboard);
    }, []);

    return (
        <table>
            <thead>
            <tr>
                <td>Username</td>
                <td>Score</td>
            </tr>
            </thead>
            <tbody>
            {state.players.map((row) =>
                <LeaderboardEntry key={row.username}
                                  username={row.username}
                                  score={row.score}
                                  isMe={row.username === user.state.username}/>
            )}
            </tbody>
        </table>
    )

}

export default Leaderboard