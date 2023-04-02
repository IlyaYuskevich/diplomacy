import { useState, useEffect } from "preact/hooks";

interface PossibleMovesProps {
  origin: string;
}

export default function Counter(props: PossibleMovesProps) {
  const [origin, setOrigin] = useState(props.origin);

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
            console.log(jsonData);
    }()
  }, [origin])
  return (
    <div>
      <p>{origin}</p>
    </div>
  );
}