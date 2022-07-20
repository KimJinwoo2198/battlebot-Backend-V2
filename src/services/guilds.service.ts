import { ChannelType } from "discord.js"
import { RequestWithGuild } from '@/interfaces/guild.interface';

class GuildsService {
  public getGuildData(req: RequestWithGuild): any {
    return { 
      id: req.guild.id,
      name: req.guild.name,
      memberCount: req.guild.memberCount,
      channels: req.guild.channels.cache.filter(channel => channel.type == ChannelType.GuildText),
      categories: req.guild.channels.cache.filter(categori => categori.type == ChannelType.GuildCategory),
      icon: req.guild.iconURL(),
      roles: req.guild.roles.cache
    };
  }
  
}

export default GuildsService;
