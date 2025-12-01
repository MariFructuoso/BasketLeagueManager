import mongoose from 'mongoose';
import express from 'express';

mongoose.connect('mongodb://localhost:27017/basketleaguemanager');

import Player from './models/player.js';
import Team from './models/team.js';
import Match from './models/match.js';

const app = express();

app.use(express.json());

app.use('/players', playerRoutes); 
app.use('/teams', teamRoutes);
app.use('/matches', matchRoutes);

app.listen(8080);
console.log('Server listening on port 8080');