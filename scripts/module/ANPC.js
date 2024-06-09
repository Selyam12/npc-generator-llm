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
        this.options = [];
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
    
    setHtmlElements(npcgen_element)
    {
        this.setHtmlElement_activity(npcgen_element);
        this.setHtmlElement_race(npcgen_element);
    }
    setHtmlElement_activity(npcgen_element)
    {
        let subtypeLabelElement;
        let subtypeSelectElement;
        const index  =2;
        // find last_activity 
        for(const [key, value] of Object.entries(ANPC.dico_activity)) {
            subtypeLabelElement = npcgen_element.find(`label[for='${value}']`);
            subtypeSelectElement = npcgen_element.find(`#${value}`); 
            
            if ( subtypeLabelElement.length  && subtypeSelectElement.length )
                break;
        } 
        
        if ( subtypeLabelElement.length  && subtypeSelectElement.length ){
             // Update the 'for' attribute of the label
            subtypeLabelElement.attr('for', this.options[index]);

            // Update the text content of the label
            const label = game.i18n.localize(`npc-generator-llm.dialog.${ this.options[index]}.label`);
            subtypeLabelElement.text(`${label}:`); 

             // Update the 'id' of the select element
            subtypeSelectElement.attr('id', this.options[index]);
             // Update the 'id' of the select element
            subtypeSelectElement.html(this.generateOptions(this.options[index], true));
        }

    }

    setHtmlElement_race(npcgen_element)
    {
        let subtypeLabelElement;
        let subtypeSelectElement;
        const index = 1;

        // find last_activity 
        for(const [key, value] of Object.entries(ANPC.dico_race)) {
            subtypeLabelElement = npcgen_element.find(`label[for='${value}']`);
            subtypeSelectElement = npcgen_element.find(`#${value}`); 
            
            if ( subtypeLabelElement.length  && subtypeSelectElement.length )
                break;
        } 
        
        if ( subtypeLabelElement.length  && subtypeSelectElement.length ){
             // Update the 'for' attribute of the label
            subtypeLabelElement.attr('for', this.options[index]);

            // Update the text content of the label
            const label = game.i18n.localize(`npc-generator-llm.dialog.${ this.options[index]}.label`);
            subtypeLabelElement.text(`${label}:`); 

             // Update the 'id' of the select element
            subtypeSelectElement.attr('id', this.options[index]);
             // Update the 'id' of the select element
            subtypeSelectElement.html(this.generateOptions(this.options[index], true));
        }

    }
    
    parseHTML(npcgen_element)
    {
        this.options.forEach(category => {
            const dialogCategory = npcgen_element.find(`#${category}`);
            this.data.details[category] = this.getSelectedOption(dialogCategory);
        });
        this.data.details["optionalName"] = npcgen_element.find('#name').val();
        this.data.details["prompt"] = npcgen_element.find('#background').val();
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

    mergeGptData(gptData) {
        const { name: gptName, spells, items, appearance, background, roleplaying, readaloud } = gptData;
        this.data.name = gptName;
        this.data.spells = spells;
        this.data.items = items;
        this.data.details = {
            ...this.data.details,
            source: "NPC Generator (GPT)",
            biography: {
                appearance: appearance,
                background: background,
                roleplaying: roleplaying,
                readaloud: readaloud
            }
        };
    }

    async createNPC() {
        try {
            const { abilities, attributes, details, name, skills, traits, currency } = this.data;
            const fakeAlign = (game.settings.get(COSTANTS.MODULE_ID, "hideAlignment")) ? game.i18n.localize("npc-generator-llm.sheet.unknown") : details.alignment.label;
            const bioContent = await npcGenGPTLib.getTemplateStructure(COSTANTS.TEMPLATE.SHEET, this.data);

            const actor = await Actor.create({ name: name, type: "npc" });
            this.UpdateActor(actor,details,fakeAlign,bioContent,abilities,attributes,skills,traits,currency)

            let comp = npcGenGPTLib.getSettingsPacks();
            npcGenGPTLib.addItemstoNpc(actor, comp.items, this.data.items);
            npcGenGPTLib.addItemstoNpc(actor, comp.spells, this.data.spells);

            actor.sheet.render(true);

            //this.close();
            ui.notifications.info(`${COSTANTS.LOG_PREFIX} ${game.i18n.format("npc-generator-llm.status.done", { npcName: name })}`);
        } catch (error) {
            console.error(`${COSTANTS.LOG_PREFIX} Error during NPC creation:`, error);
            ui.notifications.error(`${COSTANTS.LOG_PREFIX} ${game.i18n.localize("npc-generator-llm.status.error3")}`);
        }
    }

    async UpdateActor(actor,details,fakeAlign,bioContent,abilities,attributes,skills,traits,currency)
    {
        await actor.update({
            system: {
                details: {
                    source: details.source,
                    cr: details.cr.value,
                    alignment: fakeAlign,
                    race: details.race.label,
                    biography: { value: bioContent },
                    type: { value: 'custom', custom: details.race.label }
                },
                traits: { size: traits.size, languages: { value: traits.languages } },
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
