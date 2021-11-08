/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useHistory, Link } from 'react-router-dom';

const MyPokemon = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [pokemons, setPokemon] = useState([]);
    const history = useHistory();

    useEffect(() => {
        refreshToken();
        getMyPokemon();
    }, []);

    const axiosJWT = axios.create();

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

    const getMyPokemon = async () => {
        try {
            const response = await axiosJWT.get(`http://localhost:5000/my-pokemon`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPokemon(response.data);
        } catch (error) {
            alert("Terjadi kesalahan.");
            history.push("/");
        }
    }

    const editPoke = async(idPokemon) => {
        try {
            const newName = prompt("Ganti nama menjadi ? ");
            if ( !newName ) return alert("Nama tidak boleh kosong");

            const response = await axiosJWT.patch(`http://localhost:5000/update-pokemon/${idPokemon}`, {
                nama: newName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert(response.data.message);
        } catch (error) {
            console.log(error);
            alert("Terjadi kesalahan")
        }
        document.location = '';
    }

    const lepaskanPoke = async(idPokemon) => {
        try {
            const response = await axiosJWT.delete(`http://localhost:5000/delete-pokemon/${idPokemon}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            alert(response.data.message);
            if ( !response.data.status ) return;
            
        } catch (error) {
            console.log(error);
            alert("Terjadi kesalahan")
        }
        document.location = '';
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
        <div className="container mt-5">
            <div className="columns is-multiline">
                { pokemons.map((pokemon, index) => (
                    <div className="column is-one-quarter-desktop is-half-tablet" key={index}>
                        <div className="card">
                            <div className="card-image">
                                <figure className="image is-3by2">
                                <div style={{padding: 20}}>
                                    <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id_pokemon}.svg`}
                                    alt={pokemon.nama}
                                    />
                                </div>
                                </figure>
                                <div className="card-content is-overlay is-clipped">
                                <span className="tag is-info">
                                #{pokemon.id_pokemon} { pokemon.nama }
                                </span>       
                                </div>
                            </div>
                            <div className="is-justified-center mt-2">
                                <div className="buttons is-centered">
                                    <button onClick={ e => editPoke(pokemon.id) } className="button is-success">Edit</button>
                                    <button onClick={ e => lepaskanPoke(pokemon.id) } className="button is-danger">Lepaskan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) }
            </div>
        </div>
    )
}

export default MyPokemon;