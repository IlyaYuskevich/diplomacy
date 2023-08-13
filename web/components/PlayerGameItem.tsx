import { IPlayerGame, selectedPlayerGame } from "../types/playerGames.ts"

export default function PlayerGameItem(props: IPlayerGame) {

    return <div>
        <div>{props.country}</div>
        <form action={`http://localhost:4000/${props.id}`}>
            <button class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white" type="submit">Continue</button>
        </form>
    </div>
}