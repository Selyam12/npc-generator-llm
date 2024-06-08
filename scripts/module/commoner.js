import { COSTANTS, isRequesting, npcGenGPTLib } from "./lib.js";
import { npcGenGPTDataStructure } from "./dataStructures.js";
import { ANPC } from "./ANPC.js";
export class Commoner extends ANPC  {  
    options = ['gender', 'race', 'job', 'alignment', 'cr'];
    constructor() {    
            super()
            this.type = 'commoner';
            this.gender =npcGenGPTDataStructure.genderList[0];
            this.race = npcGenGPTDataStructure.raceList[0];
            this.job = npcGenGPTDataStructure.commonerList[0];
            this.alignment= npcGenGPTDataStructure.alignmentList[0];
            this.cr = 0;

            this.abilityData={ save: { max: 2, pool: ['str', 'dex', 'int', 'wis', 'con', 'cha'] }, skills: { max: 2, pool: ['acr', 'ani', 'arc', 'ath', 'dec', 'his', 'ins', 'inv', 'itm', 'med', 'nat', 'per', 'prc', 'prf', 'rel', 'slt', 'ste', 'sur'] } };
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
            case "job":
                return npcGenGPTDataStructure.commonerList;
            case "alignment":
                return npcGenGPTDataStructure.alignmentList;
            case "cr":
                return npcGenGPTDataStructure.crList;
        }
    }
    SetPorperties()
    {
        this.gender =this.data.details.gender.label;
        this.race=this.data.details.race.label;
        this.job=this.data.details.job.label;
        this.alignment=this.data.details.alignment.label;
        this.cr =this.data.details.cr.label;
    }  
    parseHTML(npcgen_element)
    { 
        super.parseHTML(npcgen_element);
        this.SetPorperties();
        this.data.details["sheet"] =  'npc-generator-llm.dialog.subtype.label' ;

        this.data.abilities = this.generateNpcAbilities(this.abilityData, this.cr);
        this.data.attributes = this.generateNpcAttributes(this.race,  this.cr);
        this.data.skills = this.generateNpcSkills(this.race);
        this.data.traits = this.generateNpcTraits(this.race);
        this.data.currency = npcGenGPTLib.getNpcCurrency(this.cr);

        return this.data;
    }

    generateNpcAbilities(npcStats, npcCR) {
        const profAbilities = npcGenGPTLib.getRandomFromPool(npcStats.save.pool, npcStats.save.max);

        const npcAbilities = npcGenGPTLib.getNpcAbilities(profAbilities);
        return npcGenGPTLib.scaleAbilities(npcAbilities, npcCR)
    }

    generateNpcAttributes(npcRace,  npcCR) {
        const raceData = npcGenGPTDataStructure.raceData[npcRace];
        const measureUnits = game.settings.get(COSTANTS.MODULE_ID, "movementUnits") ? 'm' : 'ft';
        return {
            hp: npcGenGPTLib.getNpcHp(npcCR, this.data.abilities.con.value, raceData.size),
            ac: npcGenGPTLib.getNpcAC(npcCR),
           // spellcasting: subtypeData[npcSubtype]?.spellcasting && 'int',
            movement: { ...((measureUnits === 'm') ? npcGenGPTLib.convertToMeters(raceData.movement) : raceData.movement), units: measureUnits },
            senses: { ...((measureUnits === 'm') ? npcGenGPTLib.convertToMeters(raceData.senses) : raceData.senses), units: measureUnits }
        }
    }

    generateNpcSkills(npcRace) {
        const { pool: defaultPool, max } = this.abilityData.skills;
        const pool = (npcRace === 'elf' || npcRace === 'drow')
            ? npcGenGPTLib.getRandomFromPool(defaultPool.filter(skill => skill !== 'prc'), max).concat('prc')
            : npcGenGPTLib.getRandomFromPool(defaultPool, max);

        return pool.reduce((acc, el) => {
            acc[el] = { value: 1, ability: npcGenGPTLib.getSkillAbility(el) };
            return acc;
        }, {});
    }

    generateNpcTraits(npcRace) {
        const languages = (npcGenGPTDataStructure.raceData[npcRace].lang || []).slice();
        if (npcRace === 'human' || npcRace === 'halfelf') {
            languages.push(npcGenGPTLib.getRandomFromPool(npcGenGPTDataStructure.languagesList.filter(lang => !languages.includes(lang)), 1)[0]);
        }
        return {
            languages: languages,
            size: npcGenGPTDataStructure.raceData[npcRace].size
        }
    }

    initQuery() {
        const _optionalName = this.data.details.optionalName;
        const _gender = this.gender;
        const _race = this.race;
        const _job = this.job;
        const _alignment = this.alignment;
        const _cr = this.cr;
        //const { optionalName, gender, race, subtype, alignment } = this.data.details;
        let options = `${_gender}, ${_race}, ${_job}, ${_alignment},challenge rating ${_cr}`;
        if (_optionalName) options = `(${game.i18n.localize("npc-generator-llm.query.name")}: ${_optionalName}) ${options}`; 
        return npcGenGPTDataStructure.getGenerateQueryTemplate(options)
    }

    /* getGenerateQueryTemplate(options) { 
        return `${game.i18n.format("npc-generator-llm.query.generate", { userQuery: options })}\n{
            "name": "${game.i18n.localize("npc-generator-llm.query.name")}",
            "background": "${game.i18n.localize("npc-generator-llm.query.background")}",
            "appearance": "${game.i18n.localize("npc-generator-llm.query.appearance")}",
            "roleplaying": "${game.i18n.localize("npc-generator-llm.query.roleplaying")}",
            "readaloud": "${game.i18n.localize("npc-generator-llm.query.readaloud")}",
            "items": "${game.i18n.localize("npc-generator-llm.query.equip")} (array)",
            "spells": "${game.i18n.localize("npc-generator-llm.query.spells")} (array)",
        }`
    } */
   /*  setHtmlElement(npcgen_element)
    {      
        const label = game.i18n.localize(`npc-generator-llm.dialog.subtype.${('label')}`);
        npcgen_element.find("label[for='subtype']").text(`${label}:`);
        npcgen_element.find("#subtype").html(this.generateOptions("job", true));
        npcgen_element.find("#cr").html(this.generateOptions('cr', false));
    } */

    
}