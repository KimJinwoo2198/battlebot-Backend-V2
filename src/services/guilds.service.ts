import {
  ChannelType,
  TextChannel,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  ActionRowBuilder,
  User,
  ButtonComponent,
  GuildMember
} from "discord.js";
import { RequestWithGuild } from "@/interfaces/guild.interface";
import { HttpException } from "@/exceptions/HttpException";
import { VoteItem } from "@interfaces/guild.interface";
import randomstring from "randomstring";
import votesModel from "@/models/vote.model";
import warningModel from "@/models/warning.model";
import ticketModel from "@/models/ticket.model";
import ticketSettingModel from "@/models/ticketSetting.model";
import { ResponseObj } from "@/interfaces/routes.interface";
import customLinkSettingModel from "@/models/customLinkSetting.model";
import verifyModel from "@/models/verify.model";

class GuildsService {
  public async getGuildData(req: RequestWithGuild): Promise<any> {
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
      icon: req.guild.icon,
      roles: req.guild.roles.cache,
      tickets: (await ticketModel.find({guild_id: req.guild.id})).length,
      verifys: (await verifyModel.find({guild_id: req.guild.id, status: "success"})).length,
    };
  }

  public async getGuildMembers(req: RequestWithGuild): Promise<User[]> {
    const users: any[] = [];
    await req.guild.members.fetch();
    req.guild.members.cache.forEach((member) => {
      users.push({
        roles: member.roles.cache,
        joinedTimestamp: member.joinedTimestamp,
        user: member.user,
      });
    });
    return users;
  }

  public async setGuildCustomLink(req: RequestWithGuild): Promise<ResponseObj> {
    if(req.body.type === "custom") {
      if(!req.isPremium) throw new HttpException(400, "커스텀 링크 기능은 프리미엄 전용 기능입니다")
      if(!req.body.path) throw new HttpException(400, "사용할 커스텀 링크를 입력해주세요")
      const isUseing = await customLinkSettingModel.findOne({ path: req.body.path });
      if(isUseing && isUseing.guild_id !== req.guild.id) throw new HttpException(400, "이미 사용 중인 커스텀 링크입니다")
      const customlinkDB = await customLinkSettingModel.findOne({guild_id: req.guild.id, type: "custom"});
      if(!customlinkDB) {
        const customLinkSetting = new customLinkSettingModel()
        customLinkSetting.guild_id = req.guild.id;
        customLinkSetting.path = req.body.path;
        customLinkSetting.type = "custom";
        await customLinkSetting.save().catch(e => {
          if(e) throw new HttpException(500, "커스텀 링크 설정 중 오류가 발생했습니다")
        })
        return { message: `${req.body.path}로 서버 커스텀 링크를 설정했습니다` }
      } else {
        await customlinkDB.updateOne({ $set: { path: req.body.path } });
        return { message: `${req.body.path}로 서버 커스텀 링크를 설정했습니다` }
      }
    }
    if(req.body.type === "random") {
      return {message: "", data: ""}
    }
  }

  public async createTicket(req: RequestWithGuild): Promise<string> {
    const channel = req.guild.channels.cache.get(req.body.channel)
    const categori = req.guild.channels.cache.get(req.body.categori)
    if(!channel || channel.type !== ChannelType.GuildText) throw new HttpException(404, '티켓을 생성할 채널을 찾을 수 없습니다.')
    if(!categori || categori.type !== ChannelType.GuildCategory) throw new HttpException(404, '티켓을 생성할 카테고리를 찾을 수 없습니다.')
    const ticketDB = await ticketSettingModel.findOne({guildId: req.guild.id})
    const embed = new EmbedBuilder()
      .setTitle(req.body.title)
      .setDescription(req.body.description)
      .setColor(req.body.color ? req.body.color : '#2f3136')
    const button = new ButtonBuilder()
      .setLabel(req.body.button ? req.body.button : "티켓 생성하기")
      .setStyle(ButtonStyle.Primary)
      .setEmoji(req.body.emoji ? req.body.emoji : '🎫')
      .setCustomId('create')
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(button)
    if(ticketDB) {
      await ticketSettingModel.updateOne({guildId: req.guild.id}, {$set: {categories: categori.id}})
      await channel.send({embeds: [embed], components: [row]})
      return `티켓 생성 카테고리를 #${categori.name}(으)로 변경하고 #${channel.name} 채널에 티켓을 생성했습니다` 
    } else {
      const ticketSettingDB = new ticketSettingModel()
      ticketSettingDB.guildId = req.guild.id
      ticketSettingDB.categories = categori.id
      const ticketSettingResult = await ticketSettingDB.save().then((data) => {
        return `티켓 생성 카테고리를 #${categori.name}(으)로 설정하고 #${channel.name} 채널에 티켓을 생성했습니다` 
      })
      .catch((e) => {
        if(e) return `티켓 설정을 저장하는 도중 오류가 발생했습니다` 
      })
      return ticketSettingResult;
    }
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
