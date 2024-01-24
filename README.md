# diplomacy

Classic strategic board game.

## Prerequisites:

This project uses Supabase as a database-as-a-service:
* Create a project in https://supabase.com/;
* Create four tables: games, players, player_games, moves (see project folder api/types);
* Create and .env.local using provided template and fill values accordingly to connect to your supabase instance;


## Usage:

Install deno code extension for your favorite IDE and enable it for current workspace.

Start the project:

```
deno task start --allow-env --allow-read
```

This will watch the project directory and restart as necessary.