// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    for(let i=0; i<games.length; i++){
        let div = document.createElement("div");
        div.classList.add("game-card", "fade-in");
        div.innerHTML = `<img src="${games[i].img}" class="game-img"/> <h3>${games[i].name}</h3> <p>${games[i].description}</p> <p>Backers: ${games[i].backers}</p>`;
        gamesContainer.append(div);
    }
}

addGamesToPage(GAMES_JSON);


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");
let totalContributions = GAMES_JSON.reduce((total, current) => total + current.backers, 0);
contributionsCard.innerHTML = totalContributions.toLocaleString();

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
let totalRaised = GAMES_JSON.reduce((total, current) => total + current.pledged, 0);
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
let totalGames = GAMES_JSON.length;
gamesCard.innerHTML = totalGames;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    let unfundedGamesList = GAMES_JSON.filter(game => game.pledged < game.goal);
    addGamesToPage(unfundedGamesList);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);
    let fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    addGamesToPage(GAMES_JSON);
}

//JORDAN: The addButtonTransition and removeButtonTransition functions add 
//a transition effect to the buttons on click, so the user knows which one is selected.

const buttonContainer = document.getElementById("button-container");
const buttons = buttonContainer.querySelectorAll("button")

function addButtonTransition(btn) {
    btn.classList.toggle("button-transition");
}

function removeButtonTransition() {
    buttons.forEach(button =>{
        if(button.classList == "button-transition"){
            button.classList.remove("button-transition");
            return;  //return is used to stop the function as soon as a button with the .button-transition class is removed. As it should only ever belong to one button at a time.
        }
    });
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

unfundedBtn.addEventListener("click", () => {
    removeButtonTransition()
    addButtonTransition(unfundedBtn);
    filterUnfundedOnly();

});
fundedBtn.addEventListener("click", () => {
    removeButtonTransition();
    addButtonTransition(fundedBtn);
    filterFundedOnly();
});
allBtn.addEventListener("click", () => {
    removeButtonTransition();
    addButtonTransition(allBtn);
    showAllGames();
});


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unfundedGamesList = GAMES_JSON.filter(game => game.pledged < game.goal);
let fundedGamesList = GAMES_JSON.filter(game => game.pledged >= game.goal);

//Comment from Jordan: this array was created to store all games that have a funding greater than zero, for the displayString below
let gamesWithFundingList = GAMES_JSON.filter(game => game.pledged > 0);

// create a string that explains the number of unfunded games using the ternary operator

const displayString = unfundedGamesList.length === 1 
? `A total number of <strong>$${totalRaised.toLocaleString()}</strong> has been raised for ${gamesWithFundingList.length} games. Currently, 1 game remains unfunded. We need your help to fund these amazing games!` 
: `A total number of <strong>$${totalRaised.toLocaleString()}</strong> has been raised for ${gamesWithFundingList.length} games. Currently, ${unfundedGamesList.length} games remain unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container

let description = document.createElement("p");
description.innerHTML = displayString;
descriptionContainer.append(description);

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
const [firstGame, secondGame, ...remainingGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let topPledge = document.createElement("h3");
topPledge.innerHTML = firstGame.name;
firstGameContainer.append(topPledge);

// do the same for the runner up item
let runnerUp = document.createElement("h3");
runnerUp.innerHTML = secondGame.name;
secondGameContainer.append(runnerUp);

//Jumping Anchor Logic ==========================================================

const jumpAnchor = document.querySelector(".navigation > a");

function updateJumpAnchor() {
    jumpAnchor.innerText = "View Game";
    jumpAnchor.setAttribute("href", "#game-found");
    jumpAnchor.classList.add("anchor-transition");
}

function resetJumpAnchor() {
    jumpAnchor.setAttribute("href", "#our-games");
    jumpAnchor.classList.remove("anchor-transition");
    jumpAnchor.innerText = "View Our Games";
}

jumpAnchor.addEventListener("click", () => {
    resetJumpAnchor();
});



//Game Search Logic =============================================================
const searchInput = document.getElementById("gameInput");
const navigationDiv = document.querySelector(".navigation");

function highlightGame() {
    const gameTitles = gamesContainer.querySelectorAll(".game-card > h3");
    gameTitles.forEach(gameTitle => {
        if(gameTitle.textContent.toUpperCase() === searchInput.value.toUpperCase()){
            let gameCard = gameTitle.parentElement;
            gameCard.setAttribute("id", "game-found")            
            updateJumpAnchor();
        } 
    });
    
}
//Although I could have gotten all game titles by using GAMES_JSON.map, I chose to collect them directly from the HTML elements, so that I could easily access
//its parent element, and highlight it for the user.

function searchForGame() {
    if(searchInput.value != ""){
        //=======================
        removeButtonTransition();
        addButtonTransition(allBtn);
        showAllGames();
        // The above code ensures that all games are present in the game-container div before the search.
        // Without this, the user would only be able to search for games inside their current filter (Unfunded, Funded, etc)
        highlightGame();
        searchInput.value = '';
    }
}

document.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        searchForGame();
    }
});

navigationDiv.addEventListener("click", (e) => {
    if(e.target.tagName === "BUTTON" || e.target.tagName === "IMG"){
        searchForGame();
    }
    
});
//=========================================================================



