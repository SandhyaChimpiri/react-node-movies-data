import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CORS_ORIGIN = "https://movies-ms-backend.onrender.com"

function MovieTable() {
    const [movies, setMovies] = useState([]);
    const [msg,setMsg] = useState("");

    const fetchMovies = async () => {
        try {
          const response = await axios.get(`${CORS_ORIGIN}/api/movies`);
          setMovies(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error("Error fetching movies:", error);
          setMovies([]);
        }
      };
      

    useEffect(() => {
        fetchMovies();
    }, []);

    const navigate = useNavigate();

    const handleUpdate = (movie) => {
        
        navigate('/add-movie', { state: { movie } });
    };

    const handleDelete = async (id) => {
        try {
          const response = await axios.delete(`${CORS_ORIGIN}/api/movies/${id}`);
          fetchMovies()
          setMovies((prevMovies) => 
            prevMovies
              .filter((movie) => movie.id !== id)
              .map((movie, index) => ({ ...movie, id: index + 1 })) 
          );
          setMsg(response.data.message);
        } catch (error) {
            console.error("Error deleting movie:", error);
            setMsg("Failed to delete movie");
          }    
          setTimeout(() => {
            setMsg(""); 
          }, 2000);
        }; 
    return (
        <div className="App">
            {msg && <h1>{msg}</h1>}
            <h1 className="head">Movies Data</h1>
                <table border="1" className="table" cellSpacing={2} cellPadding={5}>
                    <thead>
                        <tr>
                            <th>SlNo</th>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Producer</th>
                            <th>Collections</th>
                            <th>ReleaseYear</th>
                            <th colSpan={2}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie) => (
                            <tr key={movie.id}>
                                <td>{movie.id}</td>
                                <td>{movie.title}</td>
                                <td>{movie.director}</td>
                                <td>{movie.producer}</td>
                                <td>{movie.collections}</td>
                                <td>{movie.releaseyear}</td>
                                <td>
                                    <button id="update-btn" onClick={() => handleUpdate(movie)}>Update</button>
                                </td>
                                <td>
                                    <button id="delete-btn" onClick={() => handleDelete(movie.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
}

export default MovieTable;
