import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {

  const [loading, setLoading] = useState(true);
  const [defaultStyle, setDefaultStyle] = useState(false);


  const loadDefaultStyle = () => chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'GET_PAGE_VARIABLES' }, response => {
      setDefaultStyle(response)
      setLoading(false)
    });
  });

  useEffect(() => {
    loadDefaultStyle();
  }, [])


  return (
    <div className="App">
      <div>
        <div>{ loading && 'Carregando...'}</div>
        {!!defaultStyle ? 'Site válido!' : 'inválido' }
      </div>
    </div>
  );
};

export default Popup;
