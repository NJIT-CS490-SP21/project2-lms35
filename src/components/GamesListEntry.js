const GameListEntry = ({status, player_x, player_o, winner, onClickJoin}) => {

    const statusSwitch = (status) => {
        switch (status) {
            case 'waiting_for_players':
                return 'Waiting for Players'
            case 'running':
                return 'Running'
            case 'finished':
                return 'Finished'
            default:
                return 'Unknown'
        }
    }

    return (
        <tr>
            <td>
                {player_x !== null && player_x}
                {player_x === null && '--'}
            </td>
            <td>
                {player_o !== null && player_o}
                {player_o === null && '--'}
            </td>
            <td>{statusSwitch(status)}</td>
            <td>
                {winner !== null && winner}
                {winner === null && '--'}
            </td>
            <td>
                <button onClick={onClickJoin}>
                    Join!
                    {/*{status === 'waiting_for_players' && player_o === null && <>Play!</>}*/}
                    {/*{status === 'running' && <>Spectate!</>}*/}
                </button>
            </td>
        </tr>
    )
}

export default GameListEntry