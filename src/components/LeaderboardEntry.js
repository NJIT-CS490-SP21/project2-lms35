const LeaderboardEntry = ({username, score, isMe}) => {
    return (
        <tr>
            <td>
                {isMe && <b style={{color: "gold"}}>🤡&nbsp;{username}&nbsp;🤡</b>}
                {!isMe && <>{username}</>}
            </td>
            <td>
                {isMe && <b style={{color: "gold"}}>{score}</b>}
                {!isMe && <>{score}</>}
            </td>
        </tr>
    )
}


export default LeaderboardEntry