import { npcGenGPTSettings } from "./module/settings.js";
import { npcGenGPTGenerateNPC } from "./module/generateNPC.js";
import { npcGenGPTEnhanceNPC } from "./module/enhanceNPC.js";

console.log("NPC Generator (GPT) | Script Loaded"); // Initial log

Hooks.once('ready', () => {
    console.log("NPC Generator (GPT) | Initializing Settings")
    new npcGenGPTSettings();
});

Hooks.on("renderActorDirectory", async (app, html) => {
    console.log("NPC Generator (GPT) | Rendering Actor Directory");
    if (game.user.isGM && app instanceof ActorDirectory) {
        let button = $(`<button class='npc-generator-llm'><i class='fas fa-address-card'></i> ${game.i18n.localize("npc-generator-llm.button")}</button>`)

        button.click(function () {
            new npcGenGPTGenerateNPC().render(true)
        });

        html.find(".directory-header .header-actions").append(button);
    }
});

Hooks.on("getActorSheetHeaderButtons", async (app, buttons) => {
    console.log("NPC Generator (GPT) | Adding Header Buttons");
    if (game.user.isGM && app.object.type === 'npc') {
        buttons.unshift({
            label: 'NGG',
            class: 'npc-generator-llm',
            icon: 'fa-light fa-atom',
            onclick: ev => { new npcGenGPTEnhanceNPC(app.object).render(true) }
        });
    }
});
