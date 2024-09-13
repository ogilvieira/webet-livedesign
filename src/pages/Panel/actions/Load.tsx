import React from 'react';
import { Link } from 'react-router-dom';
import style from './Load.module.css'
import logo from '../../../assets/img/logo.png';

const Load: React.FC = () => {
    return (
        <div className={style.stage}>
            <div className={style.logo}>
                <img src={logo} alt="Webet Live Design" />
            </div>
            <div className={style.intro}>
                O que deseja fazer agora?
            </div>
            <div>
                <Link className='button' to="/edit">Novo design</Link>
            </div>
            <div>
                <Link className='button' to="/list">Carregar anterior</Link>
            </div>
            <div className={style.footer}>
                Encontrou um bug? <br/>envie um e-mail para Gilmair Vieira <br/>&lt;<a href="mailto:gil.vieira@servicenet.com.br">gil.vieira@servicenet.com.br</a>&gt;
            </div>
        </div>
    )
}

export default Load;