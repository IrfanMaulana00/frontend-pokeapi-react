/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useHistory, useParams, Link } from 'react-router-dom';

const Details = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [pokemon, setPokemon] = useState('');
    const [pokeName, setPokeName] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [pokeTypes, setPokeTypes] = useState('');
    const [abilities, setAbilities] = useState('');
    const [effectAbilities, setEffectAbilities] = useState([]);
    const [evolusi, setEvolusi] = useState([]);
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        refreshToken();
        getPokemonById();
    }, []);

    const axiosJWT = axios.create();

    function toFeet(meters) {
        const realFeet = (meters * 0.3937) / 12;
        const feet = Math.floor(realFeet);
        const inches = Math.round((realFeet - feet) * 12);
        return feet + '′' + inches + '´´';
    }

    const formatHeight = height => {
        return `${toFeet(height * 10)} (${height / 10}m)`;
    };

    const formatWeight = weight => {
        const lbs = Math.floor(weight * 22.046) / 100;
        return `${lbs} lbs  (${weight / 10}kg)`;
    };

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                history.push("/");
            }
        }
    }

    const getPokemonById = async() => {
        try {
            const response = await axios.get(`http://localhost:5000/pokemon/${id}`);
            setPokemon(response.data.data);
            setPokeName( response.data.data.forms[0].name );
            setHeight( response.data.data.height );
            setWeight( response.data.data.weight );
            setPokeTypes( response.data.data.types.map(e => e.type.name).join(", ") );
            setAbilities( response.data.data.abilities.map(e => e.ability.name).join(", ") );
            setEffectAbilities( response.data.ability );
            setEvolusi( response.data.imgEvolusi );
        } catch (error) {
            console.log(error);
            if ( error.response ) {
                history.push("/");
            }
        }
    }

    const tangkap = async () => {
        try {
            const response = await axiosJWT.get(`http://localhost:5000/tangkap/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if ( !response.data.status ) return alert(response.data.message);
            alert(response.data.message);
            history.push("/my-pokemon");
        } catch (error) {
            alert("Terjadi kesalahan.");
            //history.push("/dashboard");
        }
    }
    
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return (
        <Fragment>
            <div className="container mt-5">
                <div className="columns is-mobile">
                    <div className="column">
                    <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`}
                        width="250px"
                        alt="random"
                    /></div>
                    <div className="column">
                        <h1 className="subtitle is-1 is-capitalized" >{ pokeName }</h1>
                        <div className="columns">
                            <div className="column">Height</div>
                            <div className="column">{ formatHeight(height) }</div>
                        </div>
                        <div className="columns">
                            <div className="column">Weight</div>
                            <div className="column">{ formatWeight(weight) }</div>
                        </div>
                        <div className="columns">
                            <div className="column">Type</div>
                            <div className="column">
                                <div className="tags">{ pokeTypes }</div>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">Abilities</div>
                            <div className="column">{ abilities }</div>
                        </div>
                        <div className="column">
                            <button onClick={ tangkap } className="button is-link">Tangkap</button>
                        </div>
                    </div>
                </div>
                <div className="notification is-light mb-10">
                    <span className="subtitle is-4 is-capitalized" ><b>Abilities</b></span>
                    { effectAbilities.map((efek, index) => (
                        <p key={index}><b>{ efek.name } : </b> {efek.details}</p>
                    )) }
                    <hr />
                    <span className="subtitle is-4 is-capitalized" ><b>Evolution</b></span>
                    <div className="card-content is-flex is-horizontal-center" style={{justifyContent: "center"}}>
                        { evolusi.map((img, index) => (
                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${img.split("/").at(-2)}.png`}
                                key={index}
                            />
                        )) }
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Details;