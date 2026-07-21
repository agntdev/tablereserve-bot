import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard, mainMenuKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

const WELCOME =
  "Thank you for using TableReserve! We'll collect your booking details below.\n\n" +
  "We will never share your information with third parties. Your data is used solely for table reservation purposes.\n\n" +
  "Tap continue to start your reservation.";

const CONTINUE = "✅ Continue";

composer.callbackQuery("booking:start", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(WELCOME, {
    reply_markup: inlineKeyboard([[inlineButton(CONTINUE, "booking:choose_date")]]),
  });
});

composer.callbackQuery("booking:choose_date", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("📅 Please select the date for your reservation.");
});

composer.callbackQuery("menu:main", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("👋 Welcome! Tap a button below to get started.", {
    reply_markup: mainMenuKeyboard(),
  });
});

export default composer;