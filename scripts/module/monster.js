import { COSTANTS, isRequesting, npcGenGPTLib } from "./lib.js";
import { npcGenGPTDataStructure } from "./dataStructures.js";
import { ANPC } from "./ANPC.js";

export class Monster extends ANPC  {  
    options = ['gender', 'monstertype', 'size', 'alignment', 'cr'];

    constructor() {    
            super()
            this.type = 'monster';
            this.monstertype = npcGenGPTDataStructure.monsterList[0];
            this.size =  npcGenGPTDataStructure.sizeList[0];
            this.gender =npcGenGPTDataStructure.genderList[0];
            this.alignment= npcGenGPTDataStructure.alignmentList[0];
            this.cr = 0;

            this.monsterData ={ save:{max:3, pool: ['str', 'dex', 'int', 'wis', 'con', 'cha']}, spellcasting: {max:1,pool: ['int','wis','cha']}, skills: { max: 5, pool: ['acr', 'ani', 'arc', 'ath', 'dec', 'his', 'ins', 'inv', 'itm', 'med', 'nat', 'per', 'prc', 'prf', 'rel', 'slt', 'ste', 'sur'] } };
    
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
            case "monstertype":
                return npcGenGPTDataStructure.monsterList;
            case "size":
                return npcGenGPTDataStructure.sizeList ;
            case "alignment":
                return npcGenGPTDataStructure.alignmentList;
            case "cr":
                return npcGenGPTDataStructure.crList;
        }
    }
   
    SetLabels()
    {
        this.gender =this.data.details.gender.label;
        this.monstertype=this.data.details.monstertype.label;
        this.size=this.data.details.size.label;
        this.alignment=this.data.details.alignment.label;
        this.cr =this.data.details.cr.label;
    }  
    SetValues()
    {
        this.genderV =this.data.details.gender.value;
        this.monstertypeV=this.data.details.monstertype.value;
        this.sizeV=this.data.details.size.value;
        this.alignmentV=this.data.details.alignment.value;
        this.crV =this.data.details.cr.value;
    }  
    parseHTML(npcgen_element)
    {
        super.parseHTML(npcgen_element);
        this.SetLabels();
        this.SetValues();
        this.data.details["sheet"] =  'npc-generator-llm.dialog.subtype.label' ;

        this.data.abilities = this.generateNpcAbilities(this.monsterData, this.crV);
        this.data.attributes = this.generateNpcAttributes(this.monstertypeV,  this.crV,this.sizeV);
        this.data.skills = this.generateNpcSkills();
        this.data.traits = this.generateNpcTraits(this.monstertypeV,this.sizeV);
        this.data.currency = npcGenGPTLib.getNpcCurrency(this.crV);

        return this.data;
    }

    setHtmlElements(npcgen_element)
    {
        super.setHtmlElements(npcgen_element);
        npcgen_element.find("#cr").html(this.generateOptions('cr', true));

    }

    generateNpcAbilities(npcStats, npcCR) {
        const profAbilities = npcGenGPTLib.getRandomFromPool(npcStats.save.pool, npcStats.save.max);

        const npcAbilities = npcGenGPTLib.getNpcAbilities(profAbilities);
        return npcGenGPTLib.scaleAbilities(npcAbilities, npcCR)
    }
    
    generateNpcAttributes(monstertypeV,  npcCR,npcSize) {
        const raceData = npcGenGPTDataStructure.monsterData[monstertypeV];
        const measureUnits = game.settings.get(COSTANTS.MODULE_ID, "movementUnits") ? 'm' : 'ft';
        return {
            hp: npcGenGPTLib.getNpcHp(npcCR, this.data.abilities.con.value, npcSize),
            ac: npcGenGPTLib.getNpcAC(npcCR),
           // spellcasting: subtypeData[npcSubtype]?.spellcasting && 'int',
            movement: { ...((measureUnits === 'm') ? npcGenGPTLib.convertToMeters(raceData.movement) : raceData.movement), units: measureUnits },
            senses: { ...((measureUnits === 'm') ? npcGenGPTLib.convertToMeters(raceData.senses) : raceData.senses), units: measureUnits }
        }
    }

    generateNpcSkills() {
        const { pool: defaultPool, max } = this.monsterData.skills;
        const pool = npcGenGPTLib.getRandomFromPool(defaultPool, max);

        return pool.reduce((acc, el) => {
            acc[el] = { value: 1, ability: npcGenGPTLib.getSkillAbility(el) };
            return acc;
        }, {});
    }
    generateNpcTraits(monstertypeV,npcSize) {
        const languages = (npcGenGPTDataStructure.monsterData[monstertypeV].lang || []).slice();
        
        return {
            languages: languages,
            size: npcSize
        }
    }
    initQuery() {
        const _optionalName = this.data.details.optionalName;
        const _gender = this.gender;
        const _monstertype = this.monstertype;
        const _size = this.size;
        const _alignment = this.alignment;
        const _cr = this.cr;
        const _bck =  this.data.details.prompt;
        //const { optionalName, gender, race, subtype, alignment } = this.data.details;
        let options;
        if(_bck!="")
            {
            options = `${_gender}, ${_monstertype}, ${_size}, ${_alignment}, challenge rating ${_cr}, knowing that the npc has at least the folling backgroung ${_bck}`;
            }
            else
            {
                options = `${_gender}, ${_monstertype}, ${_size}, ${_alignment}, challenge rating ${_cr}`;
            }
        if (_optionalName) options = `(${game.i18n.localize("npc-generator-llm.query.name")}: ${_optionalName}) ${options}`; 
        return npcGenGPTDataStructure.getGenerateQueryTemplate(options)
    }

    async UpdateActor(actor,details,fakeAlign,bioContent,abilities,attributes,skills,traits,currency)
    {
        await actor.update({
            system: {
                details: {
                    source: details.source,
                    cr: details.cr.value,
                    alignment: fakeAlign,
                    biography: { value: bioContent },
                    type: { value: details.monstertype.value }
                },
                traits: { size: details.size.value, languages: { value: traits.languages } },
                abilities: abilities,
                attributes: {
                    hp: attributes.hp,
                    'ac.value': attributes.ac,
                    movement: attributes.movement,
                    senses: attributes.senses,
                    spellcasting: attributes.spellcasting
                },
                skills: skills,
                currency: currency
            }
        });
    }
}