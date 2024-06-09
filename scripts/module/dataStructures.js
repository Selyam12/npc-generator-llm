export class npcGenGPTDataStructure {
    static categoryList = [ 'gender', 'race', 'subtype', 'alignment', 'cr'];
    static typeList = ['commoner', 'npc','monster'];

    static typeOptions = {
        'commoner':[ 'gender', 'race', 'subtype', 'alignment', 'cr'],
        'npc':[ 'gender', 'race', 'subtype', 'alignment', 'cr'],
        'monster':[ 'gender', 'monsterList',  'alignment', 'cr'],
    }
    
    static genderList = ['male', 'female','None'];
    static raceList = [
        'human',
        'dragonborn',
        'dwarf-common', 'dwarf-hill', 'dwarf-mountain',
        'elf-common', 'elf-high', 'elf-wood', 'drow',
        'gnome-common', 'gnome-forest', 'gnome-rock',
        'halfelf',
        'halfling-common', 'halfling-lightfoot', 'halfling-stout',
        'halforc',       
        'tiefling'
    ];
    static commonerList = [
        'farmer','alchemist', 'baker', 'barkeep', 'blacksmith', 'butcher', 'carpenter',
        'cobbler',  'fisherman', 'guard', 'healer', 'hermit', 'hunter',
        'innkeeper', 'merchant', 'messenger', 'miner', 'scribe', 'tailor'
    ];
    static npcList = [
        'fighter','barbarian', 'bard', 'cleric', 'druid',  'monk',
        'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'
    ];
    static monsterList = [
        'aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental',
        'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze','plant','undead'
    ];
    static alignmentList = ['lg', 'ng', 'cg', 'ln', 'n', 'cn', 'le', 'ne', 'ce'];
    static sizeList =[ "medium", "tiny", "small","large", "huge", "gargantuan"];

    static crList(complete) {
        if (!complete) return [0];
        const cr = [0, 0.125, 0.25, 0.5];
        for (let i = 1; i <= 30; i++) cr.push(i);
        return cr
    }

    static languagesList = [
        "aarakocra", "abyssal", "aquan", "auran", "celestial", "common", 
        "draconic", "druidic", "elvish", "deep", "cant", "giant", "gith",
        "gnoll", "gnomish", "goblin", "halfling", "ignan", "infernal",
        "dwarvish", "orc", "primordial", "sylvan", "undercommon", "terran"
    ];

    static raceData = {
        dragonborn: { movement: { walk: 30 }, size: "med", senses: { darkvision: 0 }, lang: ["common", "draconic"] },
        dwarf: { movement: { walk: 25 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "dwarvish"] },
        elf: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "elvish"] },
        drow: { movement: { walk: 30 }, size: "med", senses: { darkvision: 120 }, lang: ["common", "elvish"] },
        gnome: { movement: { walk: 25 }, size: "sm", senses: { darkvision: 60 }, lang: ["common", "gnomish"] },
        halfelf: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "elvish"] },
        halfling: { movement: { walk: 25 }, size: "sm", senses: { darkvision: 0 }, lang: ["common", "halfling"] },
        halforc: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "orc"] },
        human: { movement: { walk: 30 }, size: "med", senses: { darkvision: 0 }, lang: ["common"] },
        tiefling: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "infernal"] },
    };

    static subtypeData = {
        commoner: { save: { max: 2, pool: ['str', 'dex', 'int', 'wis', 'con', 'cha'] }, skills: { max: 2, pool: ['acr', 'ani', 'arc', 'ath', 'dec', 'his', 'ins', 'inv', 'itm', 'med', 'nat', 'per', 'prc', 'prf', 'rel', 'slt', 'ste', 'sur'] } },
        monster: { save:{max:3, pool: ['str', 'dex', 'int', 'wis', 'con', 'cha']}, spellcasting: {max:1,pool: ['int','wis','cha']}, skills: { max: 5, pool: ['acr', 'ani', 'arc', 'ath', 'dec', 'his', 'ins', 'inv', 'itm', 'med', 'nat', 'per', 'prc', 'prf', 'rel', 'slt', 'ste', 'sur'] } },
        barbarian: { save: ['str', 'con'], skills: { max: 2, pool: ['ani', 'ath', 'itm', 'nat', 'prc', 'sur'] } },
        bard: { save: ['dex', 'cha'], spellcasting: 'cha', skills: { max: 3, pool: ['acr', 'ani', 'arc', 'ath', 'dec', 'his', 'ins', 'inv', 'itm', 'med', 'nat', 'per', 'prc', 'prf', 'rel', 'slt', 'ste', 'sur'] } },
        cleric: { save: ['wis', 'cha'], spellcasting: 'wis', skills: { max: 2, pool: ['his', 'ins', 'med', 'per', 'rel'] } },
        druid: { save: ['int', 'wis'], spellcasting: 'wis', skills: { max: 2, pool: ['ani', 'arc', 'ins', 'med', 'nat', 'prc', 'rel', 'sur'] } },
        fighter: { save: ['str', 'con'], skills: { max: 2, pool: ['acr', 'ani', 'ath', 'itm', 'ins', 'prc', 'sur', 'his'] } },
        monk: { save: ['str', 'dex'], spellcasting: 'wis', skills: { max: 2, pool: ['acr', 'ath', 'ste', 'ins', 'rel', 'his'] } },
        paladin: { save: ['wis', 'cha'], spellcasting: 'cha', skills: { max: 2, pool: ['ath', 'itm', 'ins', 'med', 'per', 'rel'] } },
        ranger: { save: ['str', 'dex'], spellcasting: 'wis', skills: { max: 3, pool: ['ani', 'ath', 'ste', 'inv', 'ins', 'nat', 'prc', 'sur'] } },
        rogue: { save: ['dex', 'int'], lang: ["cant"], skills: { max: 4, pool: ['acr', 'ath', 'ste', 'inv', 'dec', 'itm', 'prf', 'ins', 'prc', 'per', 'slt'] } },
        sorcerer: { save: ['con', 'cha'], spellcasting: 'cha', skills: { max: 2, pool: ['arc', 'dec', 'itm', 'ins', 'per', 'rel'] } },
        warlock: { save: ['wis', 'cha'], spellcasting: 'cha', skills: { max: 2, pool: ['arc', 'inv', 'dec', 'itm', 'nat', 'rel', 'his'] } },
        wizard: { save: ['int', 'wis'], spellcasting: 'int', skills: { max: 2, pool: ['arc', 'inv', 'ins', 'med', 'rel', 'his'] } }
    };
    static monsterData = {
        aberration: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "deep"] },
        beast : { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: [] },
        celestial: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "celestial"] },
        construct: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common"] },
        dragon: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "draconic"] },
        elemental: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common","auran", "aquan","ignan","terran"] },             
        fey: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "elvish"] },
        fiend: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common","abyssal", "infernal"] },
        giant: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "giant"] }, 
        humanoid: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "gnoll", "orc","undercommon", "goblin"] },
        monstrosity: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common", "inferdeepnal"] },
        ooze: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: [] },
        plant: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: [] },
        undead: { movement: { walk: 30 }, size: "med", senses: { darkvision: 60 }, lang: ["common"] }
    }
    

    static skillAbilities = {
        dex: ['acr', 'slt', 'ste'],
        int: ['arc', 'his', 'inv', 'nat', 'rel'],
        wis: ['ani', 'ins', 'med', 'prc', 'sur'],
        cha: ['dec', 'itm', 'per', 'prf']
    };

    static hpDice = { tiny: 4, sm: 6, med: 8, lg: 10, huge: 12, grg: 20 };

    static getGenerateQueryTemplate(options) { 
        return `${game.i18n.format("npc-generator-llm.query.generate", { userQuery: options })}\n{
            "name": "${game.i18n.localize("npc-generator-llm.query.name")}",
            "background": "${game.i18n.localize("npc-generator-llm.query.background")}",
            "appearance": "${game.i18n.localize("npc-generator-llm.query.appearance")}",
            "roleplaying": "${game.i18n.localize("npc-generator-llm.query.roleplaying")}",
            "readaloud": "${game.i18n.localize("npc-generator-llm.query.readaloud")}",
            "items": "${game.i18n.localize("npc-generator-llm.query.equip")} (array)",
            "spells": "${game.i18n.localize("npc-generator-llm.query.spells")} (array)",
        }`
    }

    static getEnhanceQueryTemplate(options) { 
        return `${game.i18n.format("npc-generator-llm.query.enhance", { userQuery: options })}\n{
            "background": "${game.i18n.localize("npc-generator-llm.query.background")}",
            "appearance": "${game.i18n.localize("npc-generator-llm.query.appearance")}",
            "roleplaying": "${game.i18n.localize("npc-generator-llm.query.roleplaying")}",
            "readaloud": "${game.i18n.localize("npc-generator-llm.query.readaloud")}"
        }`
    }
}
