const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const mysql = require("mysql");  
const bodyParser = require('body-parser');
const util = require('node:util');
const PORT = process.env.PORT || 5000;
const app = express();
const path = require("path");

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tiger',
    database: 'movies_db'
});

db.query = util.promisify(db.query);

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL connected");
});

app.get('/api/movies', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM movies');
        res.json(results);
    } catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

app.post('/api/movies', (req, res) => {
    const newMovie = req.body;
    console.log('Received new movie:', newMovie);  
    if (!newMovie.title || !newMovie.director || !newMovie.producer || !newMovie.collections || !newMovie.releaseyear) {
        return res.status(400).json({ error: 'All fields are required' });
    }
   const sql = 'INSERT INTO movies (title, director, producer, collections, releaseyear) VALUES (?, ?, ?, ?, ?)';
   const values = [newMovie.title, newMovie.director, newMovie.producer, newMovie.collections, newMovie.releaseyear];
    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error inserting movie:', err);
            return res.status(500).json({ error: 'Failed to save movie' });
        }
        res.status(201).json({ id: results.insertId, ...newMovie }); 
    });
});

app.put("/api/movies/:id",(req,res)=>{
    const {id} = req.params;
    const {title,director,producer,collections,releaseyear} = req.body;
    db.query("UPDATE movies SET title=?,director=?,producer=?,collections=?,releaseyear=? WHERE id = ?",
        [title,director,producer,collections,releaseyear,id],
        (err,result)=>{
            if(err){
                console.log("Error in updating data")
                res.status(500).send(err);
            }
            else {
                console.log("Movie data updated...")
                res.send(result);
            }
        }
    )
})

app.delete("/api/movies/:id", (req, res) => {
    const { id } = req.params;
    
    db.query("DELETE FROM movies WHERE id = ?", [id], (error, results) => {
        if (error) {
            console.log("Error deleting movie:", error);
            return res.status(500).json({ message: "Failed to delete movie" });
        }

        db.query('SET @count = 0', (error) => {
            if (error) return res.status(500).json({ message: "Error resetting count" });

            db.query('UPDATE movies SET id = (@count := @count + 1) ORDER BY id', (error) => {
                if (error) return res.status(500).json({ message: "Error reordering IDs" });

                db.query('SELECT MAX(id) + 1 AS next_id FROM movies', (error, results) => {
                    if (error) return res.status(500).json({ message: "Error getting next ID" });

                    const nextId = results[0].next_id || 1;
                    db.query(`ALTER TABLE movies AUTO_INCREMENT = ${nextId}`, (error) => {
                        if (error) return res.status(500).json({ message: "Error updating AUTO_INCREMENT" });

                        res.json({
                            message: "Movie deleted and IDs are reordered successfully"
                        });
                    });
                });
            });
        });
    });
});

app.listen(process.env.PORT || PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})