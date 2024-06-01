import { COSTANTS, isRequesting, npcGenGPTLib } from "./lib.js";
import { npcGenGPTDataStructure } from "./dataStructures.js";
import { ANPC } from "./commoner.js";

export class Monster extends ANPC  {  
    static options = ['gender', 'monstertype', 'size', 'alignment', 'cr'];

    constructor() {    
            super()
            this.type = 'monster';
            this.monstertype = npcGenGPTDataStructure.monsterList[0];
            this.size =  npcGenGPTDataStructure.sizeList[0];
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
                return Monster.options;
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

        const label_size = game.i18n.localize(`npc-generator-llm.dialog.subtype.${( 'size' )}`);
        npcgen_element.find("label[for='subtype']").text(`${label_size}:`);
        npcgen_element.find("#subtype").html(this.generateOptions("size", true));

        npcgen_element.find("#cr").html(this.generateOptions('cr', true));
    }




}