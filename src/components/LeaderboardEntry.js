const LeaderboardEntry = ({username, score, isMe}) => {
    return (
        <tr>
            <td>
                {isMe && <b>{username}</b>}
                {!isMe && <>{username}</>}
            </td>
            <td>{score}</td>
        </tr>
    )
}

export default LeaderboardEntry