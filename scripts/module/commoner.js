import { COSTANTS, isRequesting, npcGenGPTLib } from "./lib.js";
import { npcGenGPTDataStructure } from "./dataStructures.js";

export class ANPC  {  

    constructor() {    
            if (this.constructor == ANPC) {
              throw new Error("Abstract classes can't be instantiated.");
            }
               
        this.data = {};
    }

    getType()
    {
        throw new Error("Method 'getType()' must be implemented.");
    }

    getList(category)
    {
        throw new Error("Method 'getList()' must be implemented.");
    }

    setHtmlElement(npcgen)
    {
        throw new Error("Method 'setHtmlElement()' must be implemented.");
    }

    generateOptions(data, random)  {
        return this.getDialogOptions(data, random).map(subtype => {
            if (subtype.translate) subtype.label = game.i18n.localize(subtype.label);
            return `<option value="${subtype.value}">${subtype.label}</option>`;
        }).join('');
    };

    getDialogOptions(category, random) {
        const list = this.getList(category);
        const localize = (cat, val) => `npc-generator-llm.dialog.${cat}.${val}`;
        const options = (typeof list === 'function' ? list(random) : list).map(value => ({
            value,
            label: category === 'cr' ? (Number.isInteger(value) ? value : this.floatToFraction(value)) : localize(category, value),
            translate: typeof value === 'string'
        }));
        if (random) options.unshift({ value: 'random', label: 'npc-generator-llm.dialog.random', translate: true });
        return options;
    }
    
    
}

export class Commoner extends ANPC  {  
    static options = ['gender', 'race', 'job', 'alignment', 'cr'];
    constructor() {    
            super()
            this.type = 'commoner';
            this.race = npcGenGPTDataStructure.raceList[0];
            this.job = npcGenGPTDataStructure.commonerList[0];
            this.gender =npcGenGPTDataStructure.genderList[0];
            this.alignment= npcGenGPTDataStructure.alignmentList[0];
            this.cr = 0;
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
                return Commoner.options;
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

    setHtmlElement(npcgen_element)
    {      
        const label = game.i18n.localize(`npc-generator-llm.dialog.subtype.${('label')}`);
        npcgen_element.find("label[for='subtype']").text(`${label}:`);
        npcgen_element.find("#subtype").html(this.generateOptions("job", true));
        npcgen_element.find("#cr").html(this.generateOptions('cr', false));
    }
}