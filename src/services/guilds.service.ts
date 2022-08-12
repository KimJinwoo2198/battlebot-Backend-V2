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
import ticketSettingModel from "@/models/ticketSetting.model";
import { ResponseObj } from "@/interfaces/routes.interface";
import customLinkSettingModel from "@/models/customLinkSetting.model";
import verifyModel from "@/models/verify.model";
import sendMessage from "@/utils/message";
import { KAKAO_MESSAGE_TEMPLATE } from "@/interfaces/message.interface";
import { generateRandomNumber } from "@/utils/util";
import verifyPhoneModel from "@/models/verifyPhone.model";
import { DeleteCustomLink } from "@/dtos/guilds.dto";

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
      tickets: (await ticketModel.find({ guild_id: req.guild.id })).length,
      verifys: (
        await verifyModel.find({ guild_id: req.guild.id, status: "success" })
      ).length,
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

  public async getGuildRoles(req: RequestWithGuild): Promise<User[]> {
    const roles: any[] = [];
    await req.guild.roles.fetch();
    req.guild.roles.cache.forEach((role) => {
      roles.push({
        id: role.id,
        icon: role.icon,
        color: role.color,
        name: role.name,
        members: role.members.size,
      });
    });
    return roles;
  }

  public async getGuildTickets(req: RequestWithGuild): Promise<any> {
    const tickets = await ticketModel.find({ guildId: req.guild.id });
    return tickets;
  }

  public async getGuildVerifys(req: RequestWithGuild): Promise<any> {
    const tickets = await verifyModel.find({ guildId: req.guild.id });
    return tickets;
  }

  public async setGuildCustomLink(req: RequestWithGuild): Promise<ResponseObj> {
    if (req.body.type === "custom") {
      if (!req.isPremium)
        throw new HttpException(400, req.t("customlink.onlyPremium"));
      if (!req.body.path)
        throw new HttpException(400, req.t("customlink.inputUse"));
      const isUseing = await customLinkSettingModel.findOne({
        path: req.body.path,
      });
      if (isUseing && isUseing.guild_id !== req.guild.id)
        throw new HttpException(400, req.t("customlink.already"));
      const customlinkDB = await customLinkSettingModel.findOne({
        guild_id: req.guild.id,
        type: "custom",
      });
      if (!customlinkDB) {
        const customLinkSetting = new customLinkSettingModel();
        customLinkSetting.guild_id = req.guild.id;
        customLinkSetting.path = req.body.path;
        customLinkSetting.option = req.body.option;
        customLinkSetting.type = "custom";
        customLinkSetting.useage = 0
        await customLinkSetting.save().catch((e) => {
          if (e) throw new HttpException(500, req.t("customlink.error"));
        });
        return { message: `${req.body.path}${req.t("customlink.setting")}` };
      } else {
        await customlinkDB.updateOne({ $set: { path: req.body.path } });
        return { message: `${req.body.path}${req.t("customlink.setting")}` };
      }
    } else if (req.body.type === "random") {
      const path = randomstring.generate({ length: 8 });
      const customLinkSetting = new customLinkSettingModel();
      customLinkSetting.guild_id = req.guild.id;
      customLinkSetting.path = path;
      customLinkSetting.option = req.body.option;
      customLinkSetting.type = "random";
      customLinkSetting.useage = 0
      await customLinkSetting.save().catch((e) => {
        if (e) throw new HttpException(500, req.t("customlink.error"));
      });
      return { message: `${path}${req.t("customlink.setting")}` };
    }
  }

  public async getGuildCustomLink(req: RequestWithGuild): Promise<any> {
    const customlink = await customLinkSettingModel.findOne({
      guild_id: req.guild.id,
      type: "custom",
    });
    const randomlink = await customLinkSettingModel.find({
      guild_id: req.guild.id,
      type: "random",
    });
    return {
      custom: customlink,
      random: randomlink,
    };
  }

  public async deleteGuildCustomLink(req: RequestWithGuild): Promise<any> {
    const { path } = req.body as DeleteCustomLink
    const deleteCount = await customLinkSettingModel.deleteMany({path: {$in: path}})
    return {
      count: deleteCount.deletedCount
    };
  }

  public async createTicket(req: RequestWithGuild): Promise<string> {
    const channel = req.guild.channels.cache.get(req.body.channel);
    const categori = req.guild.channels.cache.get(req.body.categori);
    if (!channel || channel.type !== ChannelType.GuildText)
      throw new HttpException(404, req.t("ticket.notFoundChannel"));
    if (!categori || categori.type !== ChannelType.GuildCategory)
      throw new HttpException(404, req.t("ticket.notFoundCategori"));
    const ticketDB = await ticketSettingModel.findOne({
      guildId: req.guild.id,
    });
    const embed = new EmbedBuilder()
      .setTitle(req.body.title)
      .setDescription(req.body.description)
      .setColor(req.body.color ? req.body.color : "#2f3136");
    const button = new ButtonBuilder()
      .setLabel(req.body.button ? req.body.button : req.t("ticket.makeButton"))
      .setStyle(ButtonStyle.Primary)
      .setEmoji(req.body.emoji ? req.body.emoji : "🎫")
      .setCustomId("create");
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    if (ticketDB) {
      await ticketSettingModel.updateOne(
        { guildId: req.guild.id },
        { $set: { categories: categori.id } }
      );
      await channel.send({ embeds: [embed], components: [row] });
      return req.t("ticket.changeCategori", {
        categori: categori.name,
        channel: channel.name,
      });
    } else {
      const ticketSettingDB = new ticketSettingModel();
      ticketSettingDB.guildId = req.guild.id;
      ticketSettingDB.categories = categori.id;
      const ticketSettingResult = await ticketSettingDB
        .save()
        .then(() => {
          return req.t("ticket.settingCategori", {
            categori: categori.name,
            channel: channel.name,
          });
        })
        .catch((e) => {
          if (e) return req.t("error");
        });
      return ticketSettingResult;
    }
  }

  public async getGuildMember(req: RequestWithGuild): Promise<any> {
    const user = req.guild.members.cache.get(req.params.userId as string);
    if (!user) throw new HttpException(404, req.t("notFoundUser"));
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
    if (!user) throw new HttpException(404, req.t("notFoundUser"));
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
      .catch(() => {
        throw new HttpException(500, req.t("warning.error"));
      });
    return saveData;
  }

  public async verifyPhone(req: RequestWithGuild): Promise<any> {
    if (!req.isPremium)
      throw new HttpException(403, req.t("verifyPhone.onlyPremium"));
    const user = await req.guild.members.fetch(req.body.userId);
    if (!user) throw new HttpException(404, req.t("verifyPhone.notFoundUser"));
    const verifyNumber = generateRandomNumber(5);
    const verifyToken = randomstring.generate({ length: 25 });
    const verfiyPhoneDB = new verifyPhoneModel({
      user_id: user.id,
      guild_id: req.guild.id,
      verfiyKey: verifyNumber,
      status: "open",
      token: verifyToken,
      phoneNumber: req.body.phoneNumber,
    });
    await verfiyPhoneDB.save().catch(() => {
      throw new HttpException(500, req.t("dataSaveError"));
    });
    try {
      await sendMessage(
        req.body.phoneNumber,
        KAKAO_MESSAGE_TEMPLATE.VERIFY_MESSAGE,
        {
          "#{이름}": user.user.username,
          "#{인증번호}": verifyNumber,
        }
      );
    } catch (e) {
      throw new HttpException(500, e.message);
    }
    return {
      token: verifyToken,
      phoneNumber: req.body.phoneNumber,
    };
  }

  public async voteData(req: RequestWithGuild): Promise<string> {
    const { channel, voteTitle, voteItems } = req.body;
    const voteChannel = req.guild.channels.cache.get(channel) as TextChannel;
    if (!voteChannel)
      throw new HttpException(400, req.t("vote.notFoundChannel"));
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
      if (err) throw new HttpException(500, req.t("vote.error"));
    });
    return req.t("vote.settingChannel", { channel: voteChannel.name });
  }
}

export default GuildsService;
