import { ActionsEnumsKeys } from "../../lib/actionsEnums";
import getCurrentVariables from "./modules/DefaultStyle";

interface RequestData {
    action: ActionsEnumsKeys;
    data?: any;
}

chrome.runtime.onMessage.addListener((request: RequestData, _sender, sendResponse) => {
    switch(request.action){
        case "GET_PAGE_VARIABLES":
            const currentVariables = getCurrentVariables();
            sendResponse(currentVariables);
            break;
        default:
            console.error(`[ERROR CONTENT]: request action not found.`)
            sendResponse(null)
            break;
    }
});