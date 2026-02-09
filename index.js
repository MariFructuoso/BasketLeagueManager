import mongoose from 'mongoose';
import express from 'express';
import nunjucks from 'nunjucks';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser'; 
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import playerRoutes from './routes/players.js';
import teamRoutes from './routes/teams.js';
import matchRoutes from './routes/matches.js'; 


mongoose.connect('mongodb://localhost:27017/basketleaguemanager');

const app = express();

const bootstrapPath = fileURLToPath(new URL('./node_modules/bootstrap/dist', import.meta.url));
const publicPath = fileURLToPath(new URL('./public', import.meta.url));

app.set('view engine', 'njk');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

app.use(cookieParser());

app.use('/bootstrap', express.static(bootstrapPath));
app.use('/public', express.static(publicPath));

app.use('/players', playerRoutes); 
app.use('/teams', teamRoutes);
app.use('/matches', matchRoutes); 
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.redirect('/public/index.html');
});

app.listen(8080);
console.log('Server listening on port 8080');