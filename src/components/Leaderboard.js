import {Context as LeaderboardContext, updateLeaderboardAction} from "../context/leaderboard";
import {Context as UserContext} from "../context/user";
import {useContext, useEffect} from "react";
import {getLeaderboardApi} from "../api/api";
import LeaderboardEntry from "./LeaderboardEntry";


const Leaderboard = ({socket}) => {

    const user = useContext(UserContext)
    const {state, dispatch} = useContext(LeaderboardContext)

    useEffect(() => {
        getLeaderboardApi().then(data => dispatch(updateLeaderboardAction(data)))
        socket.on('leaderboard', (data) => {
            dispatch(updateLeaderboardAction(data))
        });
    }, []);

    console.log(state.players)

    return (
        <table>
            <thead>
            <tr>
                <td>Username</td>
                <td>Score</td>
            </tr>
            </thead>
            <tbody>
            {state.players.map((row) => <LeaderboardEntry
                username={row.username}
                score={row.score}
                isMe={row.username === user.username}/>
            )}
            </tbody>
        </table>
    )

}

export default Leaderboard