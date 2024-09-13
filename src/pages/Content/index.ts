import { ActionsEnumsKeys } from "../../lib/actionsEnums";
import { getCurrentVariables, getStyleByVariables } from "./modules/DefaultStyle";
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
        case "PUT_PAGE_STYLE":
            (() => {
                const $elStyle = document.getElementById('webet-live-design-style');
                const style = getStyleByVariables(request.data);
    
                if( !$elStyle) {
                    const $style = document.createElement('style');
                    $style.id = 'webet-live-design-style'
    
                    $style.innerHTML = style;
                    document.head.appendChild($style);
                    return;
                }
    
                $elStyle.innerHTML = style;
            })()
            break;
        case "REMOVE_PAGE_STYLE":
            (() => {
                const $elStyle = document.getElementById('webet-live-design-style');
                if($elStyle) { $elStyle.remove(); }    
            })()
            break;
        default:
            console.error(`[ERROR CONTENT]: request action not found.`)
            sendResponse(null)
            break;
    }
});