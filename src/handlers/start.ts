import { Composer, type Context } from "grammy";
import type { Ctx } from "../bot.js";
import { mainMenuKeyboard, registerMainMenuItem } from "../toolkit/index.js";

// Wire the booking and owner dashboard buttons to the /start main menu. Handlers
// wire themselves with .command / .on / .callbackQuery inside their modules; the
// menu buttons live here so owners see every feature's button when they open the
// menu — the handler's actual .command registration is the entry point for a
// slash command, the menu button is a button-first gateway.

registerMainMenuItem({ label: "Book a Table", data: "booking:start", order: 10 });
registerMainMenuItem({ label: "Owner Dashboard", data: "owner:dashboard", order: 20 });

const WELCOME = "👋 Welcome! Tap a button below to get started.";

const composer = new Composer<Ctx>();

composer.command("start", async (ctx) => {
  await ctx.reply(WELCOME, { reply_markup: mainMenuKeyboard() });
});

// "Back to menu" — re-render the main menu in place from any sub-view.
composer.callbackQuery("menu:main", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(WELCOME, { reply_markup: mainMenuKeyboard() });
});

export default composer;