import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DefaultStyle } from '../../Content/modules/DefaultStyle';

interface EditProps {
    defaultStyle: DefaultStyle | null;
}

const Edit: React.FC<EditProps> = (AppProps) => {
    const { id } = useParams();
    const [themeMode, setThemeMode] = useState('light')
    const { defaultStyle } = AppProps;

    const handleChangeColor = (event) => {
        console.info("CHANGE COLOR")
    };

    return (
        <>
            <nav>
                <ul>
                    <li>
                        <button onClick={() => setThemeMode('light')}>Light</button>
                    </li>
                    <li>
                        <button onClick={() => setThemeMode('dark')}>Dark</button>
                    </li>
                </ul>
            </nav>
            <table>
            {defaultStyle && defaultStyle?.variablesMeta && Object.keys(defaultStyle?.variablesMeta).map((variable) => {
                return (
                    <tr key={variable}>
                        <td>
                            { variable }
                        </td>
                        <td>
                            { defaultStyle.variables[themeMode][variable].type === 'COLOR' && (<input type="color" value={ defaultStyle.variables[themeMode][variable].cssValue } onChange={() => handleChangeColor()} />)}
                        </td>
                        <td>
                            <button>Reset</button>
                        </td>
                    </tr>
                )
            })}
            </table>
        </>
    )
}

export default Edit;