import { COSTANTS, isRequesting, npcGenGPTLib } from "./lib.js";
import { npcGenGPTDataStructure } from "./dataStructures.js";
import { ANPC } from "./commoner.js";

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
    




}