import { COSTANTS } from "./lib.js";

export class npcGenGPTSettings {
	constructor() {
		this._initSettings();
	}

	_initSettings() {
		const compList = this._getCompendiumList();

		game.settings.register(COSTANTS.MODULE_ID, "hideAlignment", {
			name: game.i18n.localize("npc-generator-llm.settings.hideAlignment.name"),
			hint: game.i18n.localize("npc-generator-llm.settings.hideAlignment.hint"),
			scope: "world",
			config: true,
			default: false,
			type: Boolean
		});
		game.settings.register(COSTANTS.MODULE_ID, "movementUnits", {
			name: game.i18n.localize("npc-generator-llm.settings.movementUnits.name"),
			hint: game.i18n.localize("npc-generator-llm.settings.movementUnits.hint"),
			scope: "world",
			config: true,
			default: false,
			type: Boolean
		});
		game.settings.register(COSTANTS.MODULE_ID, "itemsComp", {
			name: game.i18n.localize("npc-generator-llm.settings.itemsComp.name"),
			hint: game.i18n.localize("npc-generator-llm.settings.itemsComp.hint"),
			scope: "world",
			config: true,
			default: "dnd5e.items",
			type: String,
			choices: compList
		});
		game.settings.register(COSTANTS.MODULE_ID, "spellsComp", {
			name: game.i18n.localize("npc-generator-llm.settings.spellsComp.name"),
			hint: game.i18n.localize("npc-generator-llm.settings.spellsComp.hint"),
			scope: "world",
			config: true,
			default: "dnd5e.spells",
			type: String,
			choices: compList
		});
		game.settings.register(COSTANTS.MODULE_ID, "fuzzyThreshold", {
			name: game.i18n.localize("npc-generator-llm.settings.fuzzyThreshold.name"),
			hint: game.i18n.localize("npc-generator-llm.settings.fuzzyThreshold.hint"),
			scope: "world",
			config: true,
			default: 0.4,
			type: Number,
			range: {
				min: 0,
				max: 1,
				step: 0.1,
			}
		});
		game.settings.register(COSTANTS.MODULE_ID, "LLMEngine", {
			name: game.i18n.localize("npc-generator-llm.settings.LLMEngine.name"),
			hint: game.i18n.localize("npc-generator-llm.settings.LLMEngine.hint"),
			scope: "client",
			config: true,
			default: "Groq",
			type: String,
			choices: {
				"Groq": "Groq",
				"GPT": "GPT"
			}
		});
		game.settings.register(COSTANTS.MODULE_ID, "apiKey_GPT", {
			name: game.i18n.localize("npc-generator-llm.settings.apiKey_GPT.name"),
			hint: game.i18n.localize("npc-generator-llm.settings.apiKey_GPT.hint"),
			scope: "client",
			config: true,
			default: '',
			type: String
		});
		game.settings.register(COSTANTS.MODULE_ID, "apiKey_Groq", {
			name: game.i18n.localize("npc-generator-llm.settings.apiKey_Groq.name"),
			hint: game.i18n.localize("npc-generator-llm.settings.apiKey_Groq.hint"),
			scope: "client",
			config: true,
			default: '',
			type: String
		});
		game.settings.register(COSTANTS.MODULE_ID, "temperature", {
			name: game.i18n.localize("npc-generator-llm.settings.temperature.name"),
			hint: game.i18n.localize("npc-generator-llm.settings.temperature.hint"),
			scope: "world",
			config: true,
			default: 1,
			type: Number,
			range: {
				min: 0,
				max: 2,
				step: 0.01,
			}
		});
		game.settings.register(COSTANTS.MODULE_ID, "top_p", {
    		name: game.i18n.localize("npc-generator-llm.settings.top_p.name"),
    		hint: game.i18n.localize("npc-generator-llm.settings.top_p.hint"),
    		scope: "world",
    		config: true,
			default: 1,
    		type: Number,
			range: {
				min: 0,
				max: 1,
				step: 0.01,
			}
		});
		game.settings.register(COSTANTS.MODULE_ID, "freq_penality", {
    		name: game.i18n.localize("npc-generator-llm.settings.freq_penality.name"),
    		hint: game.i18n.localize("npc-generator-llm.settings.freq_penality.hint"),
    		scope: "world",
    		config: true,
			default: 0,
    		type: Number,
			range: {
				min: 0,
				max: 2,
				step: 0.01,
			}
		});
		game.settings.register(COSTANTS.MODULE_ID, "pres_penality", {
    		name: game.i18n.localize("npc-generator-llm.settings.pres_penality.name"),
    		hint: game.i18n.localize("npc-generator-llm.settings.pres_penality.hint"),
    		scope: "world",
    		config: true,
			default: 0,
    		type: Number,
			range: {
				min: 0,
				max: 2,
				step: 0.01,
			}
		});
	}

	_getCompendiumList() {
		const packs = {};
		game.packs.forEach(comp => {
			const { packageType, packageName, id, label } = comp.metadata;
			let source = '';
			
			switch (packageType) {
				case 'system':
					source = game.i18n.localize("npc-generator-llm.settings.systemSource");
					break;
				case 'world':
					source = game.world.title;
					break;
				case 'module':
					source = game.modules.get(packageName);
					break;
			}
	
			packs[id] = `${label} [${source}]`;
		});
	
		return packs;
	}
	
}
