import PlayerGameItem from "components/PlayerGameItem.tsx";
import { IPlayerGame } from "types/playerGames.ts"

type Props = {
    playerGames: IPlayerGame[],
}

export default function PlayerGames(props: Props) {
    return (
    <div>
        <h2>Games in progress:</h2>
        <br/>
        {props.playerGames.map((playerGame) => <PlayerGameItem {...playerGame} />
        )}
    </div>)
}