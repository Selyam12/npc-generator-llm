import { COSTANTS, isRequesting, npcGenGPTLib } from "./lib.js";
import { npcGenGPTDataStructure } from "./dataStructures.js";
import { ANPC } from "./ANPC.js";
export class NPC extends ANPC  {  
    options = ['gender', 'race', 'class', 'alignment', 'cr'];

    constructor() {    
            super()
            this.type = 'npc';
            this.race = npcGenGPTDataStructure.raceList[0];
            this.class = npcGenGPTDataStructure.npcList[0];
            this.gender =npcGenGPTDataStructure.genderList[0];
            this.alignment= npcGenGPTDataStructure.alignmentList[0];
            this.cr = 0;

            this.classData = {
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
    }

    getType()
    {
        return this.type;
    }

    getList(category)
    {
        switch(category)
        {
            case this.type:
                return this.options;
            case "gender":
                return npcGenGPTDataStructure.genderList;
            case "race":
                return npcGenGPTDataStructure.raceList;
            case "class":
                return npcGenGPTDataStructure.npcList ;
            case "alignment":
                return npcGenGPTDataStructure.alignmentList;
            case "cr":
                return npcGenGPTDataStructure.crList;
        }
    }
    
    parseHTML(npcgen_element)
    {
        super.parseHTML(npcgen_element);

        this.details["sheet"] =  'npc-generator-llm.dialog.subtype.class';
        this.data.abilities = this.generateNpcAbilities(this.abilityData, this.details.cr.value);
        this.data.attributes = this.generateNpcAttributes(this.details.race.value,  this.details.cr.value);
        this.data.skills = this.generateNpcSkills(race.value, subtype.value);
        this.data.traits = this.generateNpcTraits(race.value, subtype.value);
        this.data.currency = npcGenGPTLib.getNpcCurrency(cr.value);

        return this.data;
    }

    generateNpcAbilities(_class, npcCR) {
        const npcStats = this.classData[_class];
        const profAbilities =  npcStats.save;
        const npcAbilities = npcGenGPTLib.getNpcAbilities(profAbilities);
        return npcGenGPTLib.scaleAbilities(npcAbilities, npcCR)
    }

}