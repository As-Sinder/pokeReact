import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            API: 'https://pokeapi.co/api/v2/pokemon/',
            pokemon: [],
        }

        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    handleSearchChange(event) {
        if (event.target.value.length > 1) {
            let toDisplay = this.state.pokemon.filter(pok => {
                return pok.name.includes(event.target.value);
            })
            this.setState(state => ({ pokemonDisplay: toDisplay }))
        }
        else {
            this.setState(state => ({ pokemonDisplay: state.pokemon }));
        }
    }

    async componentDidMount() {
        const result = await axios.get(this.state.API);
        this.setState(state => ({ pokemon: result.data['results'] }));
        this.setState(state => ({ pokemonDisplay: state.pokemon }))
    };

    render() {
        let searchBar = <input type="text" placeholder="Search..." value={this.state.searchValue} onChange={this.handleSearchChange} />

        return (
            <div>
                {searchBar}
                { this.state.pokemonDisplay ? (
                    <div>
                        {this.state.pokemonDisplay.map(pokemon => (
                            <Pokemon name={pokemon.name} url={pokemon.url}/>
                        ))}
                </div> ) : 
                    ( <p>Loading</p>)
                }
            </div>
        );
    }
}

class Pokemon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            url: props.url,
            isOpen: false,
            types: [],
            attack: -1,
            defense: -1,
            hp: -1,
            speed: -1,
            special_attack: -1,
            special_defense: -1
        };

        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        const pokemonIndex = this.state.url.split('/')[this.state.url.split('/').length - 2];
        const detailsUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`;
        const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;

        const res = await axios.get(detailsUrl);
        res.data.stats.map(stat => {
            switch (stat.stat.name) {
                case 'hp':
                    this.setState(state => ({ hp: stat['base_stat'] }))
                    break;
                case 'attack':
                    this.setState(state => ({ attack: stat['base_stat'] }))
                    break;
                case 'defense':
                    this.setState(state => ({ defense: stat['base_stat'] }))
                    break;
                case 'speed':
                    this.setState(state => ({ speed: stat['base_stat'] }))
                    break;
                case 'special-attack':
                    this.setState(state => ({ special_attack: stat['base_stat'] }))
                    break;
                case 'special-defense':
                    this.setState(state => ({ special_defense: stat['base_stat'] }))
                    break;
                default:
                    break;
            }
        })
        
        const types = res.data.types.map(type => type.type.name);
        this.setState(state => ({ types: <li>{types}</li> }))
        this.setState(state => ({ imageUrl: imageUrl, pokemonIndex: pokemonIndex }));
    }

    handleClick(event) {
        if (this.state.isOpen) {
            this.setState(state => ({ isOpen: false }))
        }
        else {
            this.setState(state => ({ isOpen: true }))
        }
    }

    render() {
        let details = '';
        if (this.state.isOpen) {
            details =  ( <div><img src={this.state.imageUrl} /> 
            <h3>Stats:</h3>
            <ul>
                <li>HP: {this.state.hp}</li>
                <li>Attack: {this.state.attack}</li>
                <li>Defense: {this.state.defense}</li>
                <li>Speed: {this.state.speed}</li>
                <li>Special attack: {this.state.special_attack}</li>
                <li>Special defense: {this.state.special_defense}</li>
            </ul>
            <h3>Types:</h3>
            <ul>
                { this.state.types }
            </ul>    
                </div>)
        }

        return (
            <div>
                <p onClick={this.handleClick}>{this.state.name}</p>
                {details}
            </div>
        );
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
);
