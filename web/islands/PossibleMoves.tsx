import { useState, useEffect } from "preact/hooks";

interface PossibleMovesProps {
  origin: string;
}

export default function PossibleMoves(props: PossibleMovesProps) {
  const [origin, setOrigin] = useState(props.origin);
  const [adjacentProvinces, setAdjacentProvinces] = useState<{[key: string]: string}>({});

  useEffect(() => {
    void async function getMoves() {
        const response = await fetch("http://localhost:8000/get-possible-moves", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
                body: JSON.stringify({province: origin}),
            });
            const jsonData = await response.json();
            setAdjacentProvinces(jsonData)
    }()
  }, [origin, setAdjacentProvinces])



  return (
    <div>
      <p>{origin}</p>
      {Object.keys(adjacentProvinces).map((key: string) => <button onClick={() => setOrigin(key)}>{adjacentProvinces[key]}</button>)}
    </div>
  );
}