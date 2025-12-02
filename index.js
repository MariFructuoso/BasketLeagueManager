import mongoose from 'mongoose';
import express from 'express';

mongoose.connect('mongodb://localhost:27017/basketleaguemanager');

import playerRoutes from './routes/players.js';
/* import teamRoutes from './routes/teams.js';
import matchRoutes from './routes/matches.js'; */

const app = express();

app.use(express.json());

app.use('/players', playerRoutes); 
/* app.use('/teams', teamRoutes);
app.use('/matches', matchRoutes); */

app.listen(8080);
console.log('Server listening on port 8080');