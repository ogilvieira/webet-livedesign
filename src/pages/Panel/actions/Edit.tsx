import React,{ useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate, useBeforeUnload } from 'react-router-dom';
import { DefaultStyle } from '../../Content/modules/DefaultStyle';
import styles from './Edit.module.css';
import { addData, getStoreDataById, Stores, updateData } from '../../../lib/db';
interface EditProps {
    defaultStyle: DefaultStyle | null;
}

const Edit: React.FC<EditProps> = (AppProps) => {
    const { id } = useParams();
    const [ localVariables, setlocalVariables ] = useState<DefaultStyle['variablesMeta'] | null>(AppProps.defaultStyle?.variablesMeta || null);
    const { defaultStyle } = AppProps;
    const [ name, setName ] = useState(id ? '' : `Projeto ${Math.floor(Math.random() * 99)}`);
    const navigate = useNavigate();
    const [loading, setLoading]= useState<boolean>(true);

    const timerToPutStyle = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleChangeColor = (value: string, mode: string, key: string) => {
        if (localVariables) {
            setlocalVariables({
                ...localVariables,
                [key]: {
                    ...localVariables[key],
                    [mode]: value
                }
            });
        }
    };
    

    const handlePutStyle = () => {
        if (localVariables) {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if(!tabs[0] || !tabs[0].id){ return; }
                chrome.tabs.sendMessage(tabs[0].id, { action: 'PUT_PAGE_STYLE', data: localVariables }, () => {
                    console.log('Style updated')
                });
            });
        }
    };

    const handleRemoveStyle = () => {
        if(timerToPutStyle.current) { clearTimeout(timerToPutStyle.current); }

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if(!tabs[0] || !tabs[0].id){ return; }
            chrome.tabs.sendMessage(tabs[0].id, { action: 'REMOVE_PAGE_STYLE' }, () => {
                console.log('Style removed')
            });
        });
    };    

    interface ProjectData {
        name: string;
        data: DefaultStyle['variablesMeta'] | null;
    }
    
    const getProjectById = async (id: number) => {
        const res = await getStoreDataById<ProjectData>(Stores.Projects, id);
        if(!res) {
            navigate('/');
            return;
        }
        setName(res.name);
        setlocalVariables(res.data || null);
        setLoading(false)
    };

    useEffect(() => {
        if(!id) {
            setlocalVariables(defaultStyle && defaultStyle.variablesMeta ? defaultStyle.variablesMeta : null);
            setLoading(false);
        } else {
            getProjectById(Number(id));
        }
    }, [defaultStyle, id]);

    useEffect(() => {
        if(timerToPutStyle.current) { clearTimeout(timerToPutStyle.current); }
        timerToPutStyle.current = setTimeout(() => {
            handlePutStyle();
        }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localVariables]);

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if( changeInfo.status === 'complete' ) {
            handlePutStyle();
        }   
    });

    const handleSave = async () => {
    
        setLoading(true);
        const id = Date.now();
    
        try {
          const res = await addData(Stores.Projects, {
            id,
            name: name,
            domain: '',
            data: localVariables,
            createdAt: new Date().toISOString()
         });

         navigate(`/edit/${id}`);

        } catch (err: unknown) {
            setLoading(false);
            if (err instanceof Error) {
                throw err.message;
            } else {
                throw 'Something went wrong';
            }
        } 
      };

      const handleUpdate = async () => {
    
        setLoading(true);
   
        try {
          const res = await updateData(Stores.Projects, Number(id), {
            name: name,
            data: localVariables,
         });

        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err.message;
            } else {
                throw 'Something went wrong';
            }
        } finally {
            setLoading(false);
        }
      };

      const handleExit= () => {
        handleRemoveStyle();
        if( id ) {
            navigate('/list');
        } else {
            navigate('/');
        }
      }
    

    return (
        <>

        <header className={styles.header}>
            <div>
                <button className="button is-small is-error" onClick={() => handleExit()}>Sair</button>
            </div>
            <div>
                <input className="input is-small" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div>
                <button className="button is-small" onClick={() => id ? handleUpdate() : handleSave()}>{ id ? 'Salvar' : 'Criar' }</button>
            </div>
            <div>
                <button className="button is-small">Extrair</button>
            </div>
        </header>
        { !loading && localVariables && (<section>
            <table>
                <thead>
                    <tr>
                        <th>Variable</th>
                        <th>Light</th>
                        <th>Dark</th>
                        <th>-</th>
                    </tr>
                </thead>
                <tbody>
             { localVariables && defaultStyle && Object.keys(defaultStyle.variablesMeta).map((key) => (
                defaultStyle.variablesMeta[key].type === 'COLOR' && (<tr key={key}>
                    <td>
                        --{ key }
                    </td>

                    <td>
                        <input type="color" value={ localVariables[key]?.light } onChange={ (e) => handleChangeColor(e.target.value, 'light', key) }/>
                        { (defaultStyle.variablesMeta[key].light !== localVariables[key]?.light) && (<button onClick={() => handleChangeColor(defaultStyle.variablesMeta[key].light, 'light', key)}>Limpar</button>)}
                    </td>
                    <td>
                        <input type="color" value={ localVariables[key]?.dark } onChange={ (e) => handleChangeColor(e.target.value, 'dark', key) }/>
                        { (defaultStyle.variablesMeta[key].dark !== localVariables[key]?.dark) && (<button onClick={() => handleChangeColor(defaultStyle.variablesMeta[key].dark, 'dark', key)}>Limpar</button>)}
                    </td>
                </tr>)
             ))}
                </tbody>
            </table>
        </section>)}
        </>
    )
}

export default Edit;