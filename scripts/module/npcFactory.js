import { ANPC,Commoner } from "./commoner.js";
import {NPC} from "./npc.js"
import {Monster} from "./monster.js"
export class NPCFactory
{

static AllTypes = {'commoner':Commoner,"npc":NPC,"monster":Monster}

static createInstance(typeString) {
    const TypeClass = NPCFactory.AllTypes[typeString];
    if (TypeClass) {
        return new TypeClass();
    } else {
        throw new Error(`Unknown type: ${typeString}`);
    }
}

}