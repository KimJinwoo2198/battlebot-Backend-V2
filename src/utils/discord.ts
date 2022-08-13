import { Client } from "discord.js";
import { REST } from "@discordjs/rest"

export const client = new Client({intents: [130815]})

export const discordRest = new REST().setToken(process.env.BOT_TOKEN)