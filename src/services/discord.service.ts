import { client } from "@/utils/discord";
import { Request } from "express";

class DiscordService {
  public getCachesData(req: Request): any {
    return {
      servers: client.guilds.cache.size,
      users: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
    };
  }
}

export default DiscordService;
