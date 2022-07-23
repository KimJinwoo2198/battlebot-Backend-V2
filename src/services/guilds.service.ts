import {
  ChannelType,
  TextChannel,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  ActionRowBuilder,
  User,
} from "discord.js";
import { RequestWithGuild } from "@/interfaces/guild.interface";
import { HttpException } from "@/exceptions/HttpException";
import { VoteItem } from "@interfaces/guild.interface";
import randomstring from "randomstring";
import votesModel from "@/models/vote.model";
import warningModel from "@/models/warning.model";
import ticketModel from "@/models/ticket.model";

class GuildsService {
  public getGuildData(req: RequestWithGuild): any {
    return {
      id: req.guild.id,
      name: req.guild.name,
      memberCount: req.guild.memberCount,
      channels: req.guild.channels.cache.filter(
        (channel) => channel.type == ChannelType.GuildText
      ),
      categories: req.guild.channels.cache.filter(
        (categori) => categori.type == ChannelType.GuildCategory
      ),
      icon: req.guild.iconURL(),
      roles: req.guild.roles.cache,
    };
  }

  public async getGuildMembers(req: RequestWithGuild): Promise<User[]> {
    const users: User[] = [];
    await req.guild.members.fetch();
    req.guild.members.cache.forEach((member) => {
      users.push(member.user);
    });
    return users;
  }

  public async setGuildCustomLink(req: RequestWithGuild): Promise<string> {
    const users: User[] = [];
    await req.guild.members.fetch();
    req.guild.members.cache.forEach((member) => {
      users.push(member.user);
    });
    return 'ads';
  }

  public async getGuildMember(req: RequestWithGuild): Promise<any> {
    const user = req.guild.members.cache.get(req.params.userId as string);
    if (!user) throw new HttpException(404, "찾을 수 없는 유저입니다");
    const warningDB = await warningModel
      .find({ guildId: req.guild.id, userId: user.id })
      .sort({ published_date: -1 })
      .limit(5);
    const ticketDB = await ticketModel
      .find({ guildId: req.guild.id, userId: user.id })
      .sort({ published_date: -1 })
      .limit(5);
    const warnings: any[] = [];
    warningDB.forEach((warning) => {
      const manager = req.guild.members.cache.get(warning.managerId);
      warnings.push({ warning: warning, manager: manager.user || null });
    });
    return {
      user: user.user,
      ticket: ticketDB,
      warning: warnings,
      roles: user.roles.cache,
      metadata: {
        nickname: user.nickname,
        joinedAt: user.joinedAt,
        premiumSince: user.premiumSince,
        voice: user.voice,
      },
    };
  }

  public async addGuildMemberWarning(req: RequestWithGuild): Promise<string> {
    const user = req.guild.members.cache.get(req.params.userId as string);
    if (!user) throw new HttpException(404, "찾을 수 없는 유저입니다");
    const warnAdded = new warningModel({
      reason: req.body.reason,
      guildId: req.guild.id,
      userId: user.id,
      managerId: req.user.id,
    });
    const saveData = await warnAdded
      .save()
      .then((data) => {
        return data._id;
      })
      .catch((e) => {
        throw new HttpException(500, "경고 추가 도중 오류가 발생했습니다");
      });
    return saveData;
  }

  public async voteData(req: RequestWithGuild): Promise<string> {
    const { channel, voteTitle, voteItems } = req.body;
    const voteChannel = req.guild.channels.cache.get(channel) as TextChannel;
    if (!voteChannel)
      throw new HttpException(400, "투표를 진행하시는 채널을 찾지 못했습니다");
    const buttonsList: ButtonBuilder[] = [];
    const items: VoteItem[] = [];
    voteItems.forEach((el) => {
      const itemId = randomstring.generate({ length: 25 });
      items.push({
        item_id: itemId,
        item_name: el,
        vote: 0,
      });
      const button = new ButtonBuilder()
        .setCustomId("vote_" + itemId)
        .setLabel(el)
        .setStyle(ButtonStyle.Primary);
      buttonsList.push(button);
    });
    const embed = new EmbedBuilder()
      .setDescription(voteTitle)
      .setColor("#2f3136");
    let msg: Message;
    if (buttonsList.length >= 5) {
      msg = await voteChannel.send({
        embeds: [embed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            buttonsList.slice(0, 4)
          ),
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            buttonsList.slice(4, 9)
          ),
        ],
      });
    } else {
      msg = await voteChannel.send({
        embeds: [embed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            buttonsList.slice(0, 4)
          ),
        ],
      });
    }
    const voteDB = new votesModel();
    voteDB.message_id = msg.id;
    voteDB.guild_id = req.guild.id;
    voteDB.vote_items = items;
    voteDB.status = "open";
    voteDB.save((err) => {
      if (err) throw new HttpException(500, "투표 설정중 오류가 발생했습니다");
    });
    return `#${voteChannel.name}에 투표 메시지가 설정되었습니다`;
  }
}

export default GuildsService;
