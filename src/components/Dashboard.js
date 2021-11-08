/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useHistory, Link } from 'react-router-dom';

const Dashboard = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [pokemons, setPokemon] = useState([]);
    const [users, setUsers] = useState([]);
    const history = useHistory();

    useEffect(() => {
        refreshToken();
        getPokemon();
    }, []);

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

    const getPokemon = async () => {
        try {
            const response = await axios.get('http://localhost:5000/pokemon');
            if ( !response.data.message ) {
                setPokemon(response.data);
            } else {
                history.push("/");
            }
        } catch (error) {
            if ( error.response ) {
                history.push("/");
            }
        }
    }

    const axiosJWT = axios.create();

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
        <div className="container mt-5">
            <div className="columns is-multiline">
                { pokemons.map((pokemon, index) => (
                    <div className="column is-one-quarter-desktop is-half-tablet" key={pokemon.nama}>
                        <div className="card">
                            <div className="card-image">
                                <figure className="image is-3by2">
                                <div style={{padding: 20}}>
                                    <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
                                    alt={pokemon.nama}
                                    />
                                </div>
                                </figure>
                                <div className="card-content is-overlay is-clipped">
                                <span className="tag is-info">
                                    { pokemon.nama }
                                </span>       
                                </div>
                            </div>
                            <footer className="card-footer">
                                <Link to={`/details/${pokemon.id}`} className="card-footer-item">
                                #{pokemon.id}
                                </Link>
                            </footer>
                        </div>
                    </div>
                )) }
                 
            </div>
        </div>
    )
}

export default Dashboard