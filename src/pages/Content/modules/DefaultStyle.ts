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
    variablesMeta: { [key: string]: { 
        light: string, 
        dark: string, 
        flatMap: string,
        type: string
    }}
}

export const getCurrentVariables = (): DefaultStyle | null => {
    const style = Array.from(document.styleSheets)
        .filter(
            sheet => sheet.href && /\/themes\/[^\/]+\/variables(?:\.[a-f0-9]+)?\.css$/.test(sheet.href || '')
        ).shift();

    if(!style) { return null; }
    
    const keys: { [key: string]: string; } = {
        'body': 'light',
        'body.is-dark-mode': 'dark'
    };

    const variablesMeta: { [key: string]: { light: string, dark: string, flatMap: string, type: string }; } = {};

    for (const [_, cssStyleRule] of Object.entries(style.cssRules)) {
        
        if( !(cssStyleRule instanceof CSSStyleRule) ) { continue; }
        const key = keys[cssStyleRule.selectorText] || '';

        for( const [_, prop] of Object.entries(cssStyleRule.style) ) {
            if(!prop || !prop.startsWith("--")){ 
                continue; 
            }

            const val = getPropertyValue(cssStyleRule.style, prop);           
            if(!val) {
                continue;  
            }

            const propSafe = getPropSafe(prop);
            const type = getTypeVarByValue(val);

            if(!variablesMeta[propSafe]) {
                variablesMeta[propSafe] = { 
                    dark: val,
                    light: val,
                    type,
                    flatMap: getFLatMap(propSafe)
                };
            } else if(key === 'dark' || key === 'light') {
                variablesMeta[propSafe][key] = val;
            }
        }
    }

    return {
        siteKey: window.location.host,
        variablesMeta 
    }
}

export const getStyleByVariables = (variables: DefaultStyle['variablesMeta']): string => {

    let styleObj = { light: '', dark: ''};

    for(const key in variables) {
        if(variables[key].type === 'COLOR') {
            styleObj.light += ` --${key}: ${variables[key].light};`;
            styleObj.dark += ` --${key}: ${variables[key].dark};`;
        }
    }

    const style = `
        body {
            ${styleObj.light}
        }

        body.is-dark-mode {
            ${styleObj.dark}
        }
    `;

    return style;

}

export default getCurrentVariables;