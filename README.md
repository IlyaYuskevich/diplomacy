# diplomacy

Classic strategic board game.

#### Prerequisites:

1. Download and install Docker Desktop: https://docs.docker.com/desktop/install/mac-install/
2. This project uses Supabase as a database-as-a-service:
   * Create a project in https://supabase.com/;
   * Create four tables: games, players, player_games, moves (see project folder api/types);
   * Create and .env.local using provided template and fill values accordingly to connect to your supabase instance;


Run docker images:

```bash
docker-compose -f ./docker-compose.yaml up -d

backend: http://localhost:8000
frontend: http://localhost:4000
```

To run unit tests on your local machine:

1) install go and run `go mod tidy`.

2) run `go test -v ./...`