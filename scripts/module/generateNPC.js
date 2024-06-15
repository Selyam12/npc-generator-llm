import { COSTANTS, isRequesting, npcGenGPTLib } from "./lib.js";
import { npcGenGPTDataStructure } from "./dataStructures.js";
//import { ANPC } from "./commoner.js";
import { NPCFactory} from "./npcFactory.js"
export class npcGenGPTGenerateNPC extends Application {
    constructor() {
        super();
        this.data = {};
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: COSTANTS.MODULE_ID,
            title: game.i18n.localize("npc-generator-llm.dialog.title"),
            template: `modules/${COSTANTS.MODULE_ID}/templates/${COSTANTS.TEMPLATE.DIALOG}`,
            width: 300,
            height: 370
        });
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('#type').change(this.changeDialogCategory.bind(this));
        html.find('#npcGenGPT_create-btn').click(this.initGeneration.bind(this));
    }

    async getData(options) {
        const data = await super.getData(options);
        
        data.type =  { value: "type", label: `npc-generator-llm.dialog.type.label`, option: npcGenGPTLib.getDialogOptions('type',false) };
        data.category =   NPCFactory.createInstance('commoner').getDialogCategories();
        return data;
    }

    changeDialogCategory() {
        const npcType = this.element.find('#type option:selected').val();
        const npc = NPCFactory.createInstance(npcType);
        
        npc.setHtmlElements(this.element);
    }

    async initGeneration() {
        if (isRequesting) {
            ui.notifications.warn(`${COSTANTS.LOG_PREFIX} ${game.i18n.localize("npc-generator-llm.status.wait")}`);
            return;
        }

        const npc = this.generateDialogData();

        const button = this.element.find('#npcGenGPT_create-btn');
        button.text(game.i18n.localize("npc-generator-llm.dialog.buttonPending"));

        const llm = game.settings.get(COSTANTS.MODULE_ID, "LLMEngine")
        let responseData;
        if (llm == "GPT"){
            responseData = await npcGenGPTLib.callAIGPT(npc.initQuery());
        }
        if(llm == "Groq"){
            responseData = await npcGenGPTLib.callAIGroq(npc.initQuery());
        }
        if(llm == "Mistral"){
            responseData = await npcGenGPTLib.callAIMistral(npc.initQuery());
        }

        button.text(game.i18n.localize("npc-generator-llm.dialog.button"));

        if (responseData) {
            npc.mergeGptData(responseData);
            npc.createNPC();
            this.close();
        }
    }

    generateDialogData() {
        this.data.details = {};

        const npcType = this.element.find('#type option:selected').val();
        const npc = NPCFactory.createInstance(npcType);   

       npc.parseHTML(this.element);

       return npc;
    }
}
