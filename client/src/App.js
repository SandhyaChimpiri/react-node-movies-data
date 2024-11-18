import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddMovie from "./addmovie";
import MovieTable from "./MovieTable";
import HomePage from "./HomePage";
import './App.css';

function App() {
  
  return (
    <Router>
      <div>
        <div className="mainbtns">
          <Link to="/add-movie">
            <button id="btn1">Add Movie</button>
          </Link>
          <Link to="/view-movies">
            <button id="btn2">View Movies Data</button>
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-movie" element={<AddMovie />} />
          <Route path="/view-movies" element={<MovieTable />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;

