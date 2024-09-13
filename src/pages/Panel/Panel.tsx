import React, { useState, useEffect } from 'react';
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import { initDB } from '../../lib/db';

import { DefaultStyle } from '../Content/modules/DefaultStyle';

import Edit from './actions/Edit';
import List from './actions/List';
import Load from './actions/Load';


import './Panel.css';


const Panel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [canChange, setCanChange] = useState(false);
  const [defaultStyle, setDefaultStyle] = useState<DefaultStyle | null>(null);
  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [tabId, setTabId] = useState<number | null>(null);


  const loadDefaultStyle = () => chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if(!tabs[0] || !tabs[0].id){ return; }
    if( !loading ) { setLoading(true); }
    setTabId(tabs[0].id);
    chrome.tabs.sendMessage(tabs[0].id, { action: 'GET_PAGE_VARIABLES' }, (response: DefaultStyle ) => {
      setDefaultStyle(response)
      setCanChange(!!response)
      setLoading(false)
    });
  });

  const checkPage = () => chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if(!tabs[0] || !tabId){ return; }
    const canChange = tabs[0]?.id === tabId;

    setCanChange(canChange);
  });

  chrome.tabs.onActivated.addListener(async () => {
    
    checkPage();

    if(!loading && !defaultStyle){
      window.close();
      return;
    }    
  });

  const handleInitDB = async () => {
    const status = await initDB();
    setIsDBReady(status);
  };

  const backToOriginalTab = async () => {
    if(!tabId){ return; }
    chrome.tabs.update(tabId, { active: true }, () => { });
  }

  useEffect(() => {
    loadDefaultStyle();
    checkPage();
    handleInitDB();
  }, []);



  return (
    <section className="App">
        { loading && (<div className="float-warning">
          <div>Carregando...</div>
        </div>)}

        {!!defaultStyle && !canChange && (<div className="float-warning">
          <div>
            Site não disponível, retorne par a aba original ou tente desativar e ativar a extensão novamente.
            <br/><br/>
            Dados não salvos serão perdidos.
            <br/><br/>
            <button className="button" onClick={() => backToOriginalTab()}>Retomar design</button></div></div>
          )}

        {(!loading && !defaultStyle) && (<div className="float-warning">
          <div>
            <div>Ops! aparentemente este não é um site compatível... Tente desativar e ativar a extensão novamente.</div>
            <br/><br/>
            <button className="button" onClick={() => loadDefaultStyle()}>Verificar novamente</button>
          </div>
        </div>) }

        {isDBReady && (<MemoryRouter>
          <Routes>
            <Route path="/" element={<Load/>}/>
            <Route path="/edit/:id?" element={<Edit defaultStyle={ defaultStyle }/>}/>
            <Route path="/list" element={<List/>}/>
          </Routes>
        </MemoryRouter>)}
    </section>
  );
};

export default Panel;
