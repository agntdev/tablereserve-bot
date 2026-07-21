import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard, mainMenuKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

const DASHBOARD =
  "📊 Owner Dashboard\n\n" +
  "Today's remaining capacity: Loading…\n\n" +
  "Next upcoming reservations:\n" +
  "• No reservations today\n\n" +
  "Tap an action below:";

const VIEW_RESERVATIONS = "📋 View Reservations";
const CONFIGURE_SETTINGS = "⚙️ Configure Settings";
const VIEW_CAPACITY = "📊 View Today's Capacity";

composer.callbackQuery("owner:dashboard", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(DASHBOARD, {
    reply_markup: inlineKeyboard([
      [
        inlineButton(VIEW_RESERVATIONS, "owner:reservations"),
        inlineButton(CONFIGURE_SETTINGS, "owner:settings"),
      ],
      [inlineButton(VIEW_CAPACITY, "owner:capacity")],
      [inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

composer.callbackQuery("owner:reservations", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(" upcoming reservations", {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to dashboard", "owner:dashboard")]]),
  });
});

composer.callbackQuery("owner:settings", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Configure your restaurant's settings", {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to dashboard", "owner:dashboard")]]),
  });
});

composer.callbackQuery("owner:capacity", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Today's remaining capacity: Loading...", {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to dashboard", "owner:dashboard")]]),
  });
});

composer.callbackQuery("menu:main", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("👋 Welcome! Tap a button below to get started.", {
    reply_markup: mainMenuKeyboard(),
  });
});

export default composer;