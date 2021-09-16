const Scrim = require('../models/scrim');
const User = require('../models/user');
const mongoose = require('mongoose');
const { MONGODB_URI } = require('../utils/constants');
const connect = require('../db/connection');
const generatePassword = require('../utils/generatePassword');
const toIsoString = require('../utils/toIsoString');

// seed users first before running this
const main = async () => {
  let users = await User.find();

  if (users.length < 0) {
    return console.error(
      'Error: no users found, please seed or create users first.'
    );
  }

  const firstFivePlayers = [...users].slice(0, 5);
  const secondFivePlayers = [...users].slice(-5);

  const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];

  const teamOne = firstFivePlayers.map((user, idx) => ({
    role: roles[idx],
    team: { name: 'teamOne' },
    _user: {
      ...user,
    },
  }));

  const teamTwo = secondFivePlayers.map((user, idx) => ({
    role: roles[idx],
    team: { name: 'teamTwo' },
    _user: {
      ...user,
    },
  }));

  let today = new Date();

  let scrims = [
    {
      createdBy: users[0],
      teamOne,
      teamTwo,
      lobbyHost: users[2],
      lobbyPassword: await generatePassword(),
      gameStartTime: Date.now(),
      title: `${users[0].name}'s scrim`,
      lobbyName: 'Scrim 1 Custom Game (NA)',
      lobbyHost: users[0],
      teamWon: 'Team 2 (Red Side)',
    },

    {
      createdBy: users[2],
      teamOne: teamTwo,
      teamTwo: teamOne,
      lobbyHost: users[4],
      lobbyPassword: await generatePassword(),
      gameStartTime: toIsoString(
        new Date(today.setHours(today.getHours() + 1))
      ), // 1 hour from seed time
      title: `${users[2].name}'s scrim`,
      lobbyName: 'Scrim 1 Custom Game (NA)',
      lobbyHost: users[2],
      teamWon: 'Team 2 (Red Side)',
    },
  ];

  await Scrim.insertMany(scrims);

  console.log(`seeded ${scrims.length} scrims!`);
};

const run = async () => {
  connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  await main();
  await mongoose.connection.close();
};

run();
