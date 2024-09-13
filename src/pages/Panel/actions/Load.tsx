import React from 'react';
import { Link } from 'react-router-dom';

const Load: React.FC = () => {
    return (
        <div>
            <div>
                <Link to="/load">Carregar</Link>
            </div>
            <div>
                <Link to="/edit">Novo design</Link>
            </div>
        </div>
    )
}

export default Load;