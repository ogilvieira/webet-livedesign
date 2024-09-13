import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import style from './List.module.css';
import { getStoreData, deleteData, Stores, Project } from '../../../lib/db';

const List: React.FC = () => {

    const [projects, setProjects] = useState<Project[]|[]>([]);


    const handleGetProjects = async () => {
        const projects = await getStoreData<Project>(Stores.Projects);
        setProjects(projects);
    };

    useEffect(() => {
        handleGetProjects();
    }, [])

    const handleRemove = async ( id: number ) => {
        const confirm = window.confirm('Deseja realmente remover este projeto?');
        if(!confirm){ return; }
        try {
            await deleteData(Stores.Projects, id);
            handleGetProjects();    
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
        <header className={style.header}>
            <div>
                <Link className="button is-small is-error" to="/">Sair</Link>
            </div>
            <div>
                {projects.length} projetos encontrados.
            </div>
        </header>

        <section className={style.listProjeto}>
            { !projects || !projects.length && (
                <div className={style.notFound}>
                    <h2>Nenhum projeto encontrado.</h2>
                    <Link to="/edit" className="button is-primary">Criar novo projeto</Link>
                </div>
            )}

            { projects.length > 0 && projects.map((project) => (
                <div key={`${project.id}`} className={style.cardProjeto}>
                    <Link to={`/edit/${project.id}`} className={style.cardProjetoId}><strong>#{''+project.id}</strong></Link>
                    <Link to={`/edit/${project.id}`} className={style.cardProjetoName}>{ project.name }</Link>
                    <div>
                        <div className={style.cardProjetoDate}>{ project.createdAt }</div>
                        <div><button className="button is-small" onClick={() => handleRemove(project.id)}>Remover</button></div>
                    </div>
                </div>))}

        </section>
        </>
    )
}

export default List;