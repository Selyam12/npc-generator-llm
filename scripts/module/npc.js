import { COSTANTS, isRequesting, npcGenGPTLib } from "./lib.js";
import { npcGenGPTDataStructure } from "./dataStructures.js";
import { ANPC } from "./commoner.js";

export class NPC extends ANPC  {  
    static options = ['gender', 'race', 'class', 'alignment', 'cr'];

    constructor() {    
            super()
            this.type = 'npc';
            this.race = npcGenGPTDataStructure.raceList[0];
            this.class = npcGenGPTDataStructure.npcList[0];
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
                return NPC.options;
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
    setHtmlElement(npcgen_element)
    {
        // const generateOptions = (data, random) => {
        //     return npc.getDialogOptions(data, random).map(subtype => {
        //         if (subtype.translate) subtype.label = game.i18n.localize(subtype.label);
        //         return `<option value="${subtype.value}">${subtype.label}</option>`;
        //     }).join('');
        // };
        const label = game.i18n.localize(`npc-generator-llm.dialog.subtype.${( 'class' )}`);
        npcgen_element.find("label[for='subtype']").text(`${label}:`);
        npcgen_element.find("#subtype").html(this.generateOptions("class", true));
        npcgen_element.find("#cr").html(this.generateOptions('cr', true));
    }




}