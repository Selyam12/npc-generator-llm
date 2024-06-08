import { COSTANTS, isRequesting, npcGenGPTLib } from "./lib.js";
import { npcGenGPTDataStructure } from "./dataStructures.js";

export class ANPC  {  
    
    static dico_race = {"commoner":"race","npc":"race","monster":"monstertype"}
    static dico_activity = {"commoner":"job","npc":"class","monster":"size"}

    constructor() {    
            if (this.constructor == ANPC) {
              throw new Error("Abstract classes can't be instantiated.");
            }
        
        this.name="";
        this.data = {};
        this.data.details = {};
       
    }

    getType()
    {
        throw new Error("Method 'getType()' must be implemented.");
    }

    getList(category)
    {
        throw new Error("Method 'getList(category)' must be implemented.");
    }

    initQuery() {
        throw new Error("Method 'initQuery()' must be implemented.");
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

    
    parseHTML(npcgen_element)
    {
        this.options.forEach(category => {
            const dialogCategory = npcgen_element.find(`#${category}`);
            this.data.details[category] = this.getSelectedOption(dialogCategory);
        });
        this.data.details["optionalName"] = npcgen_element.find('#name').val();
        //this.data.details.sheet = (type.value === 'commoner') ? 'npc-generator-llm.dialog.subtype.label' : (type.value === 'monster')?'npc-generator-llm.dialog.subtype.type':'npc-generator-llm.dialog.subtype.class';
    }

    getSelectedOption(category) {
        let selectedOption = category.find("option:selected");
        if (selectedOption.val() === 'random') {
            const options = category.find("option:not([value='random'])");
            selectedOption = options.eq(Math.floor(Math.random() * options.length));
        }
        const value = (category.attr('id') === 'race') ? this.getRaceFromSubrace(selectedOption.val()) : selectedOption.val();
        const label = selectedOption.text();
        return { value, label };
    }

    getRaceFromSubrace(npcRace) {
        if (npcRace.includes('-')) npcRace = npcRace.split('-')[0];
        return npcRace
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
