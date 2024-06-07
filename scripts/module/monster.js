import { COSTANTS, isRequesting, npcGenGPTLib } from "./lib.js";
import { npcGenGPTDataStructure } from "./dataStructures.js";
import { ANPC } from "./commoner.js";

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
                return npcGenGPTDataStructure.monsterList;
            case "size":
                return npcGenGPTDataStructure.sizeList ;
            case "alignment":
                return npcGenGPTDataStructure.alignmentList;
            case "cr":
                return npcGenGPTDataStructure.crList;
        }
    }
   




}