// BasketLeagueManager (ESM + Mongoose)

// Importaciones
import mongoose from 'mongoose';
import Player from '../models/player.js';
import Team from '../models/team.js';
import Tournament from '../models/tournament.js';
import Match from '../models/match.js';

const MONGO_URI = "mongodb://localhost:27017/basketleaguemanager";

async function main() {
  await mongoose.connect(MONGO_URI);

  // Limpieza
  await Promise.all([
    Match.deleteMany({}),
    Tournament.deleteMany({}),
    Team.deleteMany({}),
    Player.deleteMany({}),
  ]);

  // =================
  // PLAYERS
  // =================
  
  const playersData = [
    // â€”â€”â€” EspaÃ±a (ACB)
    { nickname: 'sllull',   name: 'Sergio Llull',           country: 'ES', birthDate: new Date('1987-11-15'), role: 'Base' },
    { nickname: 'wtavares', name: 'Walter Tavares',         country: 'CV', birthDate: new Date('1992-03-22'), role: 'PÃ­vot' },
    { nickname: 'rfern',    name: 'Rudy FernÃ¡ndez',         country: 'ES', birthDate: new Date('1985-04-04'), role: 'Escolta' },

    { nickname: 'aabrines', name: 'Ãlex Abrines',           country: 'ES', birthDate: new Date('1993-08-01'), role: 'Escolta' },
    { nickname: 'nlapro',   name: 'NicolÃ¡s LaprovÃ­ttola',   country: 'AR', birthDate: new Date('1990-01-31'), role: 'Base' },
    { nickname: 'jvesely',  name: 'Jan VeselÃ½',             country: 'CZ', birthDate: new Date('1990-04-24'), role: 'Ala-pÃ­vot' },

    { nickname: 'mhoward',  name: 'Markus Howard',          country: 'US', birthDate: new Date('1999-03-03'), role: 'Escolta' },
    { nickname: 'tsedek',   name: 'Tadas Sedekerskis',      country: 'LT', birthDate: new Date('1998-01-17'), role: 'Alero' },

    { nickname: 'adiaz',    name: 'Alberto DÃ­az',           country: 'ES', birthDate: new Date('1994-04-23'), role: 'Base' },
    { nickname: 'kperry',   name: 'Kendrick Perry',         country: 'ME', birthDate: new Date('1992-12-23'), role: 'Base' },

    { nickname: 'bdublj',   name: 'Bojan DubljeviÄ‡',        country: 'ME', birthDate: new Date('1991-10-24'), role: 'PÃ­vot' },
    { nickname: 'vclaver',  name: 'VÃ­ctor Claver',          country: 'ES', birthDate: new Date('1988-08-30'), role: 'Alero' },

    { nickname: 'mhuertas', name: 'Marcelinho Huertas',     country: 'BR', birthDate: new Date('1983-05-25'), role: 'Base' },
    { nickname: 'gsherma',  name: 'Giorgi Shermadini',      country: 'GE', birthDate: new Date('1989-04-02'), role: 'PÃ­vot' },
    { nickname: 'ssalin',   name: 'Sasu Salin',             country: 'FI', birthDate: new Date('1991-06-11'), role: 'Escolta' },

    // â€”â€”â€” Europa (EuroLeague/EuroCup â€” muestra)
    { nickname: 'vspan',    name: 'Vasileios Spanoulis',    country: 'GR', birthDate: new Date('1982-08-07'), role: 'Escolta' },
    { nickname: 'sloukas',  name: 'Kostas Sloukas',         country: 'GR', birthDate: new Date('1990-01-15'), role: 'Base' },

    { nickname: 'calathes', name: 'Nick Calathes',          country: 'US', birthDate: new Date('1989-02-07'), role: 'Base' },
    { nickname: 'lpapapet', name: 'Ioannis Papapetrou',     country: 'GR', birthDate: new Date('1994-03-30'), role: 'Alero' },

    { nickname: 'vmicic',   name: 'Vasilije Micic',         country: 'RS', birthDate: new Date('1994-01-13'), role: 'Base' },
    { nickname: 'lclyburn', name: 'Will Clyburn',           country: 'US', birthDate: new Date('1990-05-17'), role: 'Alero' },

    { nickname: 'mkleiza',  name: 'Keenan Evans',           country: 'US', birthDate: new Date('1996-08-23'), role: 'Escolta' },
    { nickname: 'larkin',   name: 'Shane Larkin',           country: 'US', birthDate: new Date('1992-10-02'), role: 'Base' },

    { nickname: 'melli',    name: 'Nicolo Melli',           country: 'IT', birthDate: new Date('1991-01-26'), role: 'Ala-pÃ­vot' },
    { nickname: 'teodosic', name: 'Milos Teodosic',         country: 'RS', birthDate: new Date('1987-03-19'), role: 'Base' },

    { nickname: 'pantarz',  name: 'Kevin Punter',           country: 'US', birthDate: new Date('1993-06-25'), role: 'Escolta' },
    { nickname: 'leday',    name: 'Zach LeDay',             country: 'US', birthDate: new Date('1994-05-30'), role: 'Ala-pÃ­vot' },

    { nickname: 'nedovic',  name: 'Nemanja Nedovic',        country: 'RS', birthDate: new Date('1991-06-16'), role: 'Escolta' },
    { nickname: 'campazzo', name: 'Facundo Campazzo',       country: 'AR', birthDate: new Date('1991-03-23'), role: 'Base' },

    { nickname: 'obst',     name: 'Andreas Obst',           country: 'DE', birthDate: new Date('1996-07-13'), role: 'Escolta' },
    { nickname: 'theis',    name: 'Daniel Theis',           country: 'DE', birthDate: new Date('1992-04-04'), role: 'PÃ­vot' },

    { nickname: 'james',    name: 'Mike James',             country: 'US', birthDate: new Date('1990-08-18'), role: 'Escolta' },
    { nickname: 'okobo',    name: 'Elie Okobo',             country: 'FR', birthDate: new Date('1997-10-23'), role: 'Base' },

    { nickname: 'uptas',    name: 'Edgaras Ulanovas',       country: 'LT', birthDate: new Date('1992-07-07'), role: 'Alero' },
    { nickname: 'motiej',   name: 'Donatas Motiejunas',     country: 'LT', birthDate: new Date('1990-09-20'), role: 'PÃ­vot' },

    { nickname: 'baldwin',  name: 'Wade Baldwin IV',        country: 'US', birthDate: new Date('1996-03-29'), role: 'Escolta' },
    { nickname: 'lorenzo',  name: 'Lorenzo Brown',          country: 'US', birthDate: new Date('1990-08-26'), role: 'Base' },
  ];

  const players = await Player.insertMany(playersData);
  const P = Object.fromEntries(players.map(pl => [pl.nickname, pl])); // Ã­ndice por nickname

  // =============
  // TEAMS
  // =============
  
  const teamsData = [
    // EspaÃ±a (ACB)
    { name: 'Real Madrid',        foundedAt: new Date('1931-03-22') },
    { name: 'FC Barcelona',       foundedAt: new Date('1926-06-24') },
    { name: 'Baskonia',           foundedAt: new Date('1959-01-01') },
    { name: 'Unicaja',            foundedAt: new Date('1977-01-01') },
    { name: 'Valencia Basket',    foundedAt: new Date('1986-09-27') },
    { name: 'Lenovo Tenerife',    foundedAt: new Date('1939-01-01') },

    // Europa (EuroLeague / EuroCup)
    { name: 'Olympiacos',         foundedAt: new Date('1931-01-01') },
    { name: 'Panathinaikos',      foundedAt: new Date('1919-01-01') },
    { name: 'FenerbahÃ§e',         foundedAt: new Date('1913-01-01') },
    { name: 'Anadolu Efes',       foundedAt: new Date('1976-01-01') },
    { name: 'Maccabi Tel Aviv',   foundedAt: new Date('1932-01-01') },
    { name: 'Virtus Bologna',     foundedAt: new Date('1929-01-01') },
    { name: 'Partizan Belgrade',  foundedAt: new Date('1945-01-01') },
    { name: 'Crvena zvezda',      foundedAt: new Date('1945-01-01') },
    { name: 'ALBA Berlin',        foundedAt: new Date('1989-01-01') },
    { name: 'Bayern Munich',      foundedAt: new Date('1946-01-01') },
    { name: 'AS Monaco',          foundedAt: new Date('1928-01-01') },
    { name: 'Å½algiris Kaunas',    foundedAt: new Date('1944-01-01') },
  ];

  const teams = await Team.insertMany(teamsData);
  const T = Object.fromEntries(teams.map(t => [t.name, t]));

  // Roster mÃ­nimo por equipo (player + joinDate + active)
  const join = new Date('2023-09-01');
  const rosterUpdates = [
    // EspaÃ±a
    ['Real Madrid',      ['sllull','wtavares','rfern']],
    ['FC Barcelona',     ['aabrines','nlapro','jvesely']],
    ['Baskonia',         ['mhoward','tsedek']],
    ['Unicaja',          ['adiaz','kperry']],
    ['Valencia Basket',  ['bdublj','vclaver']],
    ['Lenovo Tenerife',  ['mhuertas','gsherma','ssalin']],
    // Europa
    ['Olympiacos',       ['vspan','sloukas']],
    ['Panathinaikos',    ['calathes','lpapapet']],
    ['Anadolu Efes',     ['larkin','lclyburn']],
    ['FenerbahÃ§e',       ['vmicic','melli']],      
    ['Maccabi Tel Aviv', ['baldwin','lorenzo']],
    ['Virtus Bologna',   ['teodosic','melli']],
    ['Partizan Belgrade',['pantarz','leday']],
    ['Crvena zvezda',    ['nedovic','teodosic']],
    ['ALBA Berlin',      ['obst','theis']],
    ['Bayern Munich',    ['theis','obst']],
    ['AS Monaco',        ['james','okobo']],
    ['Å½algiris Kaunas',  ['uptas','motiej']],
  ];

  await Promise.all(
    rosterUpdates.map(([teamName, nicks]) =>
      Team.updateOne(
        { _id: T[teamName]._id },
        {
          $set: {
            roster: nicks.map(nk => ({
              player: P[nk]?._id,
              joinDate: join,
              active: true,
            })).filter(r => r.player), // evita nulos si algÃºn nick faltara
          },
        }
      )
    )
  );

  // =====================
  // TOURNAMENTS
  // =====================
  const tournaments = await Tournament.insertMany([
    {
      title: 'Liga ACB',
      year: 2025,
      season: 'Autumn',
      organizer: 'ACB',
      teams: [
        T['Real Madrid']._id, T['FC Barcelona']._id, T['Baskonia']._id,
        T['Unicaja']._id, T['Valencia Basket']._id, T['Lenovo Tenerife']._id,
      ],
    },
    {
      title: 'EuroLeague',
      year: 2025,
      season: 'Autumn',
      organizer: 'Euroleague Basketball',
      teams: [
        T['Real Madrid']._id, T['FC Barcelona']._id, T['Baskonia']._id,
        T['Olympiacos']._id, T['Panathinaikos']._id, T['FenerbahÃ§e']._id,
        T['Anadolu Efes']._id, T['Maccabi Tel Aviv']._id, T['Virtus Bologna']._id,
        T['Partizan Belgrade']._id, T['Crvena zvezda']._id, T['ALBA Berlin']._id,
        T['Bayern Munich']._id, T['AS Monaco']._id, T['Å½algiris Kaunas']._id,
      ],
    },
    {
      title: 'EuroCup',
      year: 2025,
      season: 'Autumn',
      organizer: 'Euroleague Basketball',
      teams: [
        T['Valencia Basket']._id, T['Unicaja']._id, T['Lenovo Tenerife']._id,
        T['ALBA Berlin']._id, T['Bayern Munich']._id,
      ],
    },
  ]);
  const TO = Object.fromEntries(tournaments.map(t => [t.title, t]));

  // ===============
  // MATCHES 
  // ===============
  const matchesData = [
    // â€”â€”â€” ACB
    {
      tournament: TO['Liga ACB']._id,
      date: new Date('2025-10-05T18:00:00Z'),
      stage: 'Group',
      homeTeam: T['Real Madrid']._id,
      awayTeam: T['Valencia Basket']._id,
      homeScore: 88,
      awayScore: 79,
      playerStats: [
        { player: P['sllull']._id,   team: T['Real Madrid']._id,    points: 17, assists: 6, rebounds: 3, steals: 1, fouls: 2, mvp: true },
        { player: P['wtavares']._id, team: T['Real Madrid']._id,    points: 14, assists: 1, rebounds: 11, steals: 0, fouls: 3 },
        { player: P['bdublj']._id,   team: T['Valencia Basket']._id, points: 16, assists: 2, rebounds: 7, steals: 0, fouls: 3 },
        { player: P['vclaver']._id,  team: T['Valencia Basket']._id, points: 9,  assists: 2, rebounds: 5, steals: 2, fouls: 2 },
      ],
    },
    {
      tournament: TO['Liga ACB']._id,
      date: new Date('2025-10-06T18:30:00Z'),
      stage: 'Group',
      homeTeam: T['FC Barcelona']._id,
      awayTeam: T['Unicaja']._id,
      homeScore: 84,
      awayScore: 81,
      playerStats: [
        { player: P['nlapro']._id,  team: T['FC Barcelona']._id, points: 21, assists: 8, rebounds: 2, steals: 1, fouls: 2, mvp: true },
        { player: P['aabrines']._id,team: T['FC Barcelona']._id, points: 12, assists: 1, rebounds: 3, steals: 1, fouls: 2 },
        { player: P['adiaz']._id,   team: T['Unicaja']._id,       points: 7,  assists: 7, rebounds: 4, steals: 2, fouls: 3 },
        { player: P['kperry']._id,  team: T['Unicaja']._id,       points: 19, assists: 5, rebounds: 3, steals: 1, fouls: 4 },
      ],
    },

    // â€”â€”â€” EuroLeague
    {
      tournament: TO['EuroLeague']._id,
      date: new Date('2025-10-10T19:00:00Z'),
      stage: 'Group',
      homeTeam: T['Olympiacos']._id,
      awayTeam: T['Real Madrid']._id,
      homeScore: 76,
      awayScore: 80,
      playerStats: [
        { player: P['vspan']?._id,  team: T['Olympiacos']._id,   points: 16, assists: 5, rebounds: 3, steals: 1, fouls: 2 },
        { player: P['sloukas']._id, team: T['Olympiacos']._id,   points: 12, assists: 7, rebounds: 2, steals: 2, fouls: 2 },
        { player: P['sllull']._id,  team: T['Real Madrid']._id,  points: 15, assists: 4, rebounds: 2, steals: 1, fouls: 2, mvp: true },
        { player: P['wtavares']._id,team: T['Real Madrid']._id,  points: 11, assists: 1, rebounds: 12, steals: 0, fouls: 3 },
      ].filter(Boolean),
    },
    {
      tournament: TO['EuroLeague']._id,
      date: new Date('2025-10-11T19:30:00Z'),
      stage: 'Group',
      homeTeam: T['Anadolu Efes']._id,
      awayTeam: T['FC Barcelona']._id,
      homeScore: 85,
      awayScore: 87,
      playerStats: [
        { player: P['larkin']._id,    team: T['Anadolu Efes']._id,  points: 24, assists: 6, rebounds: 3, steals: 1, fouls: 2 },
        { player: P['lclyburn']._id,  team: T['Anadolu Efes']._id,  points: 18, assists: 2, rebounds: 6, steals: 1, fouls: 3 },
        { player: P['nlapro']._id,    team: T['FC Barcelona']._id,  points: 20, assists: 7, rebounds: 3, steals: 2, fouls: 2, mvp: true },
        { player: P['aabrines']._id,  team: T['FC Barcelona']._id,  points: 14, assists: 1, rebounds: 4, steals: 1, fouls: 2 },
      ],
    },

    // â€”â€”â€” EuroCup
    {
      tournament: TO['EuroCup']._id,
      date: new Date('2025-10-15T18:00:00Z'),
      stage: 'Group',
      homeTeam: T['Valencia Basket']._id,
      awayTeam: T['ALBA Berlin']._id,
      homeScore: 90,
      awayScore: 82,
      playerStats: [
        { player: P['bdublj']._id,  team: T['Valencia Basket']._id, points: 22, assists: 3, rebounds: 8, steals: 0, fouls: 3, mvp: true },
        { player: P['vclaver']._id, team: T['Valencia Basket']._id, points: 10, assists: 2, rebounds: 6, steals: 1, fouls: 2 },
        { player: P['obst']._id,    team: T['ALBA Berlin']._id,     points: 17, assists: 2, rebounds: 3, steals: 1, fouls: 2 },
      ],
    },
  ];

  await Match.insertMany(matchesData);

  console.log('Seed completado');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error en seed:', err?.message);
  process.exit(1);
});