import { IPlayerGame } from "../utils/playerGames.ts"

export default function PlayerGameItem(props: IPlayerGame) {
    return <div className="playerGamePicker">
        <div>{props.country}</div>
        <form action={`http://localhost:4000/${props.games.id}/`}>
            <button type="submit">Continue</button>
        </form>
    </div>
}