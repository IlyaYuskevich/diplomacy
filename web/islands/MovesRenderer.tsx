import { IMove, MoveType, moves } from "../types/moves.ts";

export default function MovesRenderer() {

    function moveFormatter(move: IMove) {
        switch (move.type) {
            case MoveType.Move:
                return `${move.unitType} ${move.origin}-${move.to}`
            case MoveType.Retreat:
                return `${move.unitType} ${move.origin}-${move.to}`
            case MoveType.Support:
                return `${move.unitType} ${move.origin} S ${move.from}-${move.to}`
            case MoveType.Convoy:
                return `${move.unitType} ${move.origin} C ${move.from}-${move.to}`
            case MoveType.Defend:
                return `${move.unitType} ${move.origin} Defends`
            case MoveType.Build:
                return `${move.unitType} ${move.origin} Builds`
            case MoveType.Destroy:
                return `${move.unitType} ${move.origin} Disbands`
        }
    }
    
    return (
        <div class="bg-red-900 text-white rounded-lg p-3 text-center">
            {moves.value.map(move => 
                <p>{moveFormatter(move)}</p>
                )
            }
        </div>
    )
}