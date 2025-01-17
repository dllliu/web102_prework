/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");


// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    
    // loop over each item in the data
    for (let i=0; i<games.length; i++){
        const game = games[i];

        const gameCard = document.createElement("div");
        gameCard.classList.add("game-card")

        gameCard.innerHTML = `
            <img src="${game.img}" alt="${game.name}" class="game-image" />
            <h3 class="game-title">${game.name}</h3>
            <p class="game-description">${game.description}</p>
            <p class="game-pledged">${game.pledged}</p>
            <p class="game-goal">${game.goal}</p>
            <p class="game-backers">${game.backers}</p>
        `;

        // Append the game card to the games container
        gamesContainer.appendChild(gameCard);

    }

}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers

const total_contribs = GAMES_JSON.reduce( (acc, game) => {
    return acc + game["backers"];
}, 0);


// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `<p class="total-backers"> ${total_contribs.toLocaleString("en-US")}</p>`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const raised_contribs = GAMES_JSON.reduce( (acc, game) => {
    return acc + game["pledged"];
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `<p class="total-raised"> $${raised_contribs.toLocaleString("en-US")}</p>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const tot_games = GAMES_JSON.reduce( (acc, game) => {
    return acc + 1;
}, 0);
gamesCard.innerHTML = `<p class="total-games"> ${tot_games.toLocaleString("en-US")}</p>`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unmetGames = GAMES_JSON.filter( (games) => {
        return games["pledged"] < games["goal"];
    })

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unmetGames);
}

function filterbyGameName(name) {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let matchingGames = GAMES_JSON.filter( (games) => {
        return games["name"].toLowerCase().includes(name.toLowerCase());
    })

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(matchingGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let metGames = GAMES_JSON.filter( (games) => {
        return games["pledged"] >= games["goal"];
    })


    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(metGames);

}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

document.getElementById('search').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    filterbyGameName(searchQuery);
});


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let numUnfunded = GAMES_JSON.reduce( (acc, game) => {
    return acc + (game["pledged"] < game["goal"] ? 1 : 0);
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${raised_contribs} has been raised for ${tot_games} ${(tot_games == 1 ? "game": "games")}. Currently, ${numUnfunded} ${(numUnfunded == 1 ? "game": "games")} remain unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const pElement = document.createElement("p");

// Set the content of the paragraph element to the template string
pElement.textContent = displayStr;

// Append the new paragraph element to the descriptionContainer
descriptionContainer.appendChild(pElement);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [first, ...others] = sortedGames;
let [f, second, ...thirds] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const pElementFirst = document.createElement("p");
pElementFirst.textContent = first["name"];
firstGameContainer.appendChild(pElementFirst);

// do the same for the runner up item
const pElementSec = document.createElement("p");
pElementSec.textContent = second["name"];
secondGameContainer.appendChild(pElementSec);