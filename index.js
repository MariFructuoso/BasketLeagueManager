import mongoose from 'mongoose';
import express from 'express';
import nunjucks from 'nunjucks';


import authRoutes from './routes/auth.js';
import playerRoutes from './routes/players.js';
import teamRoutes from './routes/teams.js';
import matchRoutes from './routes/matches.js'; 


mongoose.connect('mongodb://localhost:27017/basketleaguemanager');



const app = express();

app.set('view engine', 'njk');
nunjucks.configure('views', {
autoescape: true,
express: app
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configurar el nunjucks con import/export
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
app.use('/public', express.static('./public'));

app.use('/players', playerRoutes); 
app.use('/teams', teamRoutes);
app.use('/matches', matchRoutes); 
app.use('/auth', authRoutes);

app.listen(8080);
console.log('Server listening on port 8080');