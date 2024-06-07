import { COSTANTS, isRequesting, npcGenGPTLib } from "./lib.js";
import { npcGenGPTDataStructure } from "./dataStructures.js";

export class ANPC  {  
    
    static dico_race = {"commoner":"race","npc":"race","monster":"monstertype"}
    static dico_activity = {"commoner":"job","npc":"class","monster":"size"}

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

    setHtmlElement(npcgen_element)
    {
        let subtypeLabelElement;
        let subtypeSelectElement;
        
        // find last_activity 
        for(const [key, value] of Object.entries(ANPC.dico_activity)) {
            subtypeLabelElement = npcgen_element.find(`label[for='${value}']`);
            subtypeSelectElement = npcgen_element.find(`#${value}`); 
            
            if ( subtypeLabelElement.length  && subtypeSelectElement.length )
                break;
        } 
        
        if ( subtypeLabelElement.length  && subtypeSelectElement.length ){
             // Update the 'for' attribute of the label
            subtypeLabelElement.attr('for', this.options[2]);

            // Update the text content of the label
            const label = game.i18n.localize(`npc-generator-llm.dialog.${ this.options[2]}.label`);
            subtypeLabelElement.text(`${label}:`); 

             // Update the 'id' of the select element
            subtypeSelectElement.attr('id', this.options[2]);
             // Update the 'id' of the select element
            subtypeSelectElement.html(this.generateOptions(this.options[2], true));
        }

        //npcgen_element.find("label[for='subtype']").text(`${label}:`);
        //npcgen_element.find("#subtype").html(this.generateOptions("class", true));
        npcgen_element.find("#cr").html(this.generateOptions('cr', this.type!='commoner'));
    }

    getDialogCategories()
    {
        const categories = this.options.map(category => {
            return { value: category, label: `npc-generator-llm.dialog.${category}.label` }
        });
        const data = categories.map(category => {
            const arg = category.value;
            return { ...category, option: this.getDialogOptions(arg, arg !== 'cr') };
        });

        return data;
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
            label: category === 'cr' ? (Number.isInteger(value) ? value : ANPC.floatToFraction(value)) : localize(category, value),
            translate: typeof value === 'string'
        }));
        if (random) options.unshift({ value: 'random', label: 'npc-generator-llm.dialog.random', translate: true });
        return options;
    }
    
    static floatToFraction(float) {
        const gcd = (a, b) => b ? gcd(b, a % b) : a;
        const g = gcd(Math.round(float * 1000), 1000);
        return `${Math.round(float * 1000) / g}/${1000 / g}`;
    }
}

export class Commoner extends ANPC  {  
    options = ['gender', 'race', 'job', 'alignment', 'cr'];
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

   /*  setHtmlElement(npcgen_element)
    {      
        const label = game.i18n.localize(`npc-generator-llm.dialog.subtype.${('label')}`);
        npcgen_element.find("label[for='subtype']").text(`${label}:`);
        npcgen_element.find("#subtype").html(this.generateOptions("job", true));
        npcgen_element.find("#cr").html(this.generateOptions('cr', false));
    } */

    
}