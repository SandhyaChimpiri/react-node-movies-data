import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AddMovie = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const movieEdit = useMemo(() => location.state?.movie || {}, [location.state]);

    const [movie, setMovie] = useState({
        title: "",
        director: "",
        producer: "",
        collections: "",
        releaseyear: ""
    });

    useEffect(() => {
        if (movieEdit) 
            setMovie(movieEdit);
    }, [movieEdit]);

    const [showMsg, setShowMsg] = useState(false);
    const [msg, setMsg] = useState('');
    const handleChange = (e) => {
        setMovie({ ...movie, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (movieEdit.id) {
            await axios.put(`http://localhost:5000/api/movies/${movieEdit.id}`, movie);
            setMsg('Movie updated successfully!');
            setShowMsg(true);
            setTimeout(()=>{
                setMsg("");
                navigate("/view-movies");
            },1000)
            
        } else {
            try{
            await axios.post("http://localhost:5000/api/movies", movie);
            setMsg('Movie added successfully!');
            setShowMsg(true);
        setMovie({title:"",director:"",producer:"",collections:"",releaseyear:""});
    }
    catch (error) {
        if (error.response || error.response.status === 409) {
            setMsg("Movie already exists"); 
            setShowMsg(true);
            setMovie({title:"",director:"",producer:"",collections:"",releaseyear:""});
        }  
    }
    finally{
        setTimeout(()=>{
            setMsg("");
            navigate("/add-movie");
        },3000)
    }
    }
       
    };

    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Enter Movie Title" value={movie.title} onChange={handleChange} required /><br /><br />
                <input type="text" name="director" placeholder="Enter Movie Director Name" value={movie.director} onChange={handleChange} required /><br /><br />
                <input type="text" name="producer" placeholder="Enter Movie Producer Name" value={movie.producer} onChange={handleChange} required /><br /><br />
                <input type="text" name="collections" placeholder="Enter Movie Collections" value={movie.collections} onChange={handleChange} required /><br /><br />
                <input type="text" name="releaseyear" placeholder="Enter Released year of Movie" value={movie.releaseyear} onChange={handleChange} required /><br /><br />
                <button type="submit">{movieEdit.id ? "Update Movie" : "Add Movie"}</button>
            </form>
            <h1>{showMsg && <div>{msg}</div>}</h1>
        </div>
    );
};

export default AddMovie;
