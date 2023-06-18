import PlayerGameItem from "../components/PlayerGameItem.tsx";
import { IPlayerGame } from "../utils/playerGames.ts"

type Props = {
    playerGames: IPlayerGame[],
}

export default function PlayerGames(props: Props) {
    return <div>
        {props.playerGames.map((playerGame) => <PlayerGameItem {...playerGame} />
        )}
    </div>
}