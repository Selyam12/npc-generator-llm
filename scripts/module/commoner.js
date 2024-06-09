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
    SetLabels()
    {
        this.gender =this.data.details.gender.label;
        this.race=this.data.details.race.label;
        this.job=this.data.details.job.label;
        this.alignment=this.data.details.alignment.label;
        this.cr =this.data.details.cr.label;
    }  
    SetValues()
    {
        this.genderV =this.data.details.gender.value;
        this.raceV=this.data.details.race.value;
        this.jobV=this.data.details.job.value;
        this.alignmentV=this.data.details.alignment.value;
        this.crV =this.data.details.cr.value;
    }  
    parseHTML(npcgen_element)
    { 
        super.parseHTML(npcgen_element);
        this.SetLabels();
        this.SetValues();
        this.data.details["sheet"] =  'npc-generator-llm.dialog.subtype.label' ;

        this.data.abilities = this.generateNpcAbilities(this.abilityData, this.crV);
        this.data.attributes = this.generateNpcAttributes(this.raceV,  this.crV);
        this.data.skills = this.generateNpcSkills(this.raceV);
        this.data.traits = this.generateNpcTraits(this.raceV);
        this.data.currency = npcGenGPTLib.getNpcCurrency(this.crV);

        return this.data;
    }

    setHtmlElements(npcgen_element)
    {
        super.setHtmlElements(npcgen_element);
        npcgen_element.find("#cr").html(this.generateOptions('cr', false));

    }

    generateNpcAbilities(npcStats, npcCR) {
        const profAbilities = npcGenGPTLib.getRandomFromPool(npcStats.save.pool, npcStats.save.max);

        const npcAbilities = npcGenGPTLib.getNpcAbilities(profAbilities);
        return npcGenGPTLib.scaleAbilities(npcAbilities, npcCR)
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

    

    initQuery() {
        const _optionalName = this.data.details.optionalName;
        const _gender = this.gender;
        const _race = this.race;
        const _job = this.job;
        const _alignment = this.alignment;
        const _cr = this.cr;
        //const { optionalName, gender, race, subtype, alignment } = this.data.details;
        let options = `${_gender}, ${_race}, ${_job}, ${_alignment}, challenge rating ${_cr}`;
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