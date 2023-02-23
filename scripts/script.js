// API for top 100 games
const top100URL = "https://steamspy.com/api.php?request=top100in2weeks";

axios.get(top100URL).then((response) => {
  console.log(response);
});

// Steam Game IDs
const gamesList = [
  {
    name: "Terraria",
    id: 105600,
  },
  {
    name: "Counter-Strike: Global Offensive",
    id: 730,
  },
  {
    name: "Dota 2",
    id: 570,
  },
  {
    name: "Hogwarts Legacy",
    id: 990080,
  },
  {
    name: "Lost Ark",
    id: 1599340,
  },
  {
    name: "Apex Legends",
    id: 1172470,
  },
  {
    name: "PUBG",
    id: 578080,
  },
  {
    name: "Destiny 2",
    id: 1085660,
  },
];

// Steam API - ISSUES WITH CORS
// USING A PLUGIN ON CHROME TO BYPASS CORS ISSUES
const currentPlayerCountURL =
  "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=";

// const headers = {
//   //   "Content-Type": "application/x-www-form-urlencoded",
// };

// Function to obtain current player counts for each game in array

// let playGame = new Promise((resolve, reject) => {
//   getPlayerCounts();

//   const getPlayerCounts = () => {
//     gamesList.forEach((game) => {
//       axios
//         .get(currentPlayerCountURL + game.id, {
//           headers: headers,
//         })
//         .then((response) => {
//           //   console.log(response);
//           game.playerCount = response.data.response.player_count;
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
//     return resolve();

//     return reject();
//   };
// });

// make an empty array of promises to use for Promise.all
const gameScore = document.querySelector(".game__score");
let score = 0;
gameScore.textContent = `Score: ${score}`;

const promiseArray = [];

gamesList.forEach((game) => {
  promiseArray.push(axios.get(currentPlayerCountURL + game.id));
});

// We use Promise.all because we only want to do things once all promises have completed
Promise.all(promiseArray).then((responses) => {
  // responses is an array of objects for each game id we sent

  gamesList.forEach((game, index) => {
    game.playerCount = responses[index].data.response.player_count;
  });

  // gamesList is now updated with player counts!
  let randomGames = getRandomGames();
  let knownGame = randomGames[0];
  let unknownGame = randomGames[1];

  console.log(knownGame);
  console.log(unknownGame);

  // GAME 1 - LEFT, STATS SHOWN
  const gameKnownName = document.querySelector(".game__name--known");
  gameKnownName.textContent = knownGame.name;

  let gamePlayers = document.querySelector(".game__players");
  gamePlayers.textContent = knownGame.playerCount;

  // background image
  const gameKnownBox = document.querySelector(".game--known");
  gameKnownBox.style.background = `linear-gradient(0deg, #32323299, #32323299), url('https://steamcdn-a.akamaihd.net/steam/apps/${knownGame.id}/header.jpg') center/cover`;

  // GAME 2 - RIGHT, STATS HIDDEN
  const gameUnknownName = document.querySelector(".game__name--unknown");
  gameUnknownName.textContent = unknownGame.name;

  // background image
  const gameUnknownBox = document.querySelector(".game--unknown");
  gameUnknownBox.style.background = `linear-gradient(0deg, #32323299, #32323299), url('https://steamcdn-a.akamaihd.net/steam/apps/${unknownGame.id}/header.jpg') center/cover`;

  // BUTTONS
  const moreButton = document.querySelector(".btn--more");
  const lessButton = document.querySelector(".btn--less");

  moreButton.addEventListener("click", () => {
    if (unknownGame.playerCount >= knownGame.playerCount) {
      playerIsRight();
    } else {
      // run failure function
      console.log("Game Over!");
    }
  });

  lessButton.addEventListener("click", () => {
    if (unknownGame.playerCount <= knownGame.playerCount) {
      playerIsRight();
    } else {
      // run failure function
      console.log("Game Over!");
    }
  });

  const playerIsRight = () => {
    // update score
    score += 1;
    gameScore.textContent = `Score: ${score}`;

    // swap games
    knownGame = unknownGame;
    gameKnownName.textContent = knownGame.name;
    gamePlayers.textContent = knownGame.playerCount;
    gameKnownBox.style.background = `linear-gradient(0deg, #32323299, #32323299), url('https://steamcdn-a.akamaihd.net/steam/apps/${knownGame.id}/header.jpg') center/cover`;

    // get a new unknown game
    randomGames = getRandomGames();
    unknownGame = randomGames[1];

    // make sure the unknown game is not the same as the known game
    if (unknownGame.id === knownGame.id) {
      unknownGame = randomGames[0];
    }

    gameUnknownName.textContent = unknownGame.name;
    gameUnknownBox.style.background = `linear-gradient(0deg, #32323299, #32323299), url('https://steamcdn-a.akamaihd.net/steam/apps/${unknownGame.id}/header.jpg') center/cover`;
  };
});

// Random game selector function
const getRandomGames = () => {
  let random1 = Math.floor(Math.random() * gamesList.length);
  let random2 = Math.floor(Math.random() * gamesList.length);

  // Make sure that the 2 random numbers are different
  if (random2 === random1) {
    while (random2 === random1) {
      random2 = Math.floor(Math.random() * gamesList.length);
    }
  }

  let game1 = gamesList[random1];
  let game2 = gamesList[random2];

  return [game1, game2];
};
