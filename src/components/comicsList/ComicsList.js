import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoaging, setNewItemLoaging] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoaging(false) : setNewItemLoaging(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(charEnded => [...comicsList, ...newComicsList]);
        setNewItemLoaging(newItemLoaging => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {

        return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
        )}
    )
        
        return (
            <ul className="comics__grid">
            {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoaging ? <Spinner/> : null;

    return (
        <div className='comics__list'>
            {errorMessage}
            {spinner}
            {items}
            <button
                className='button button_main button__long'
                disabled={newItemLoaging}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className='inner'>load more</div>
            </button>
        </div>
    )
}

export default ComicsList;