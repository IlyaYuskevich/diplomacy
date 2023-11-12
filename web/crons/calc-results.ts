import { Cron } from "croner";

const job : Cron = new Cron("* * * * * *", () => {
    console.log("This will run every second.");
});
