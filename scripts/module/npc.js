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
    SetLabels()
    {
        this.gender =this.data.details.gender.label;
        this.race=this.data.details.race.label;
        this.class=this.data.details.class.label;
        this.alignment=this.data.details.alignment.label;
        this.cr =this.data.details.cr.label;
    }  
    SetValues()
    {
        this.genderV =this.data.details.gender.value;
        this.raceV=this.data.details.race.value;
        this.classV=this.data.details.class.value;
        this.alignmentV=this.data.details.alignment.value;
        this.crV =this.data.details.cr.value;
    }  
    parseHTML(npcgen_element)
    {
        super.parseHTML(npcgen_element);
        this.SetLabels();
        this.SetValues();
        this.data.details["sheet"] =  'npc-generator-llm.dialog.subtype.class';

        this.data.abilities = this.generateNpcAbilities(this.classV, this.crV);
        this.data.attributes = this.generateNpcAttributes(this.raceV,  this.crV);
        this.data.skills = this.generateNpcSkills(this.raceV, this.classV);
        this.data.traits = this.generateNpcTraits(this.raceV);
        this.data.currency = npcGenGPTLib.getNpcCurrency(this.crV);

        return this.data;
    }
    setHtmlElements(npcgen_element)
    {
        super.setHtmlElements(npcgen_element);
        npcgen_element.find("#cr").html(this.generateOptions('cr', true));

    }

    generateNpcAbilities(_class, npcCR) {
        const npcStats = this.classData[_class];
        const profAbilities =  npcStats.save;
        const npcAbilities = npcGenGPTLib.getNpcAbilities(profAbilities);
        return npcGenGPTLib.scaleAbilities(npcAbilities, npcCR)
    }
    generateNpcSkills(npcRace, npcClass) {
        const { pool: defaultPool, max } = this.classData[npcClass].skills;
        const pool = (npcRace === 'elf' || npcRace === 'drow')
            ? npcGenGPTLib.getRandomFromPool(defaultPool.filter(skill => skill !== 'prc'), max).concat('prc')
            : npcGenGPTLib.getRandomFromPool(defaultPool, max);

        return pool.reduce((acc, el) => {
            acc[el] = { value: 1, ability: npcGenGPTLib.getSkillAbility(el) };
            return acc;
        }, {});
    }

    initQuery() {
        const _optionalName = this.data.details.optionalName;
        const _gender = this.gender;
        const _race = this.race;
        const _class = this.class;
        const _alignment = this.alignment;
        const _cr = this.cr;
        const _bck =  this.data.details.prompt;
        //const { optionalName, gender, race, subtype, alignment } = this.data.details;
        let options;
        if(_bck!="")
            {
            options = `${_gender}, ${_race}, ${_class}, ${_alignment}, challenge rating ${_cr}, ${game.i18n.localize("npc-generator-llm.query.hint")} ${_bck}`;
            }
            else
            {
                options = `${_gender}, ${_race}, ${_class}, ${_alignment}, challenge rating ${_cr}`;
            }
        if (_optionalName) options = `(${game.i18n.localize("npc-generator-llm.query.name")}: ${_optionalName}) ${options}`; 
        return npcGenGPTDataStructure.getGenerateQueryTemplate(options)
    }
 
}