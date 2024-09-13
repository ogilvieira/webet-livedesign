import MAP_VARIABLES from '../../data/MapVariables';

const getPropertyValue = (style: CSSStyleDeclaration, propName: string): string => {
    const propValue = (style.getPropertyValue(propName) || '').trim().toLowerCase();

    if(!propValue) {
        return propValue;
    }

    if(propValue.startsWith("linear-gradient")) {
        return propValue;
    }

    if( propValue.startsWith("var(") ) {
        const propValueSafe = propValue.replace(/(var\(|\)|,.*$)/g, "");
        return getPropertyValue(style, propValueSafe);
    }

    return propValue;
}

const getTypeVarByValue = (val: string): string => {

    if( /^#[0-9A-F]{6}[0-9a-f]{0,2}$/i.test(val) ) {
        return "COLOR"
    }

    if( val.startsWith('linear-gradient') ) {
        return "GRADIENT"
    }

    if( val.startsWith('url') ) {
        return "IMAGE"
    }

    return "NONE"

}

const getFLatMap = (variable: string): string => {
    for(const key in MAP_VARIABLES as { [key: string]: string[] }) {
        
        if(MAP_VARIABLES[key].includes(variable)) {
            return key+"."+variable;
        }
    }

    return "-";
}

const getPropSafe = (str = ''): string => {
    return str.replace("--", "");
}

export type DefaultStyle = {
    siteKey: string,
    variablesMeta: { [key: string]: { light: boolean, dark: boolean, flatMap: string }; },
    variables: { [key: string]: { [key: string] : { cssVar: string, cssValue: string, type: string } } }
}

const getCurrentVariables = (): DefaultStyle | null => {
    const style = Array.from(document.styleSheets)
        .filter(
            sheet => sheet.href && /\/themes\/[^\/]+\/variables(?:\.[a-f0-9]+)?\.css$/.test(sheet.href || '')
        ).shift();

    if(!style) { return null; }
    
    const result: { [key: string]: { [key: string] : any } } = {};

    const keys: { [key: string]: string; } = {
        'body': 'light',
        'body.is-dark-mode': 'dark'
    };

    const variablesMeta: { [key: string]: { light: boolean, dark: boolean, flatMap: string }; } = {};

    for (const [_, cssStyleRule] of Object.entries(style.cssRules)) {
        if( !(cssStyleRule instanceof CSSStyleRule) ) { continue; }
        const key = keys[cssStyleRule.selectorText] || '';
        if (key && !result[key]) { result[key] = {}; }

        for( const [_, prop] of Object.entries(cssStyleRule.style) ) {
            if(!prop || !prop.startsWith("--")){ continue; }

            const val = getPropertyValue(cssStyleRule.style, prop);           
            if(!val) {  continue;  }

            const propSafe = getPropSafe(prop);

            if(!variablesMeta[propSafe]) {
                variablesMeta[propSafe] = { 
                    dark: (key === 'dark'), 
                    light: (key === 'light'),
                    flatMap: getFLatMap(propSafe)
                };
            } else if(key === 'dark' || key === 'light') {
                variablesMeta[propSafe][key] = true;
            }

            result[key][propSafe] = {
                cssVar: prop,
                cssValue: val,
                type: getTypeVarByValue(val),
            };
        }
    }

    return {
        siteKey: window.location.host,
        variablesMeta: variablesMeta,
        variables: result
    }
}

export default getCurrentVariables;