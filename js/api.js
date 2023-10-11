import {getRecipeListFromLocalStorage} from "./localStorageService.js";

const form = document.getElementById("recipeApi");
const ingredients = document.getElementById("ingredients");
let recipeResponse = document.getElementById("recipeResponse");
const errorResponse = document.getElementById("errorResponse");
const dietTypes = document.getElementsByTagName("option");
const mealTypes = document.getElementsByTagName("input");
const recipeSummary = document.getElementById("recipeSummary");

const API_KEY = "59e199f1b62247779346095f4dfe259e";
const API_KEY_2 = "62efe392f0484ea0b724363f2c26dbfe";
const API_KEY_3 = "230a70bc0bb04fb3ac7c45843d5f4ec8"

let recipesWithInformation = getRecipeListFromLocalStorage()
let filteredRecipeList = recipesWithInformation;
let recipeList = [];

let mealTypeValue = "";
let dietTypeValue = "";


form.addEventListener("submit", async (event) => {

    event.preventDefault();

    determineCheckedMealType();
    determineSelectedDietType();

    if (dietTypeValue !== "default") {
        await filterRecipeListByDietType();
    }

    if (mealTypeValue !== "all") {
        await filterRecipeListByMealType();
    }


    recipeResponse.innerHTML = "";
    if (filteredRecipeList.length > 0) {
        filteredRecipeList.forEach(recipe => {
            const recipeImage = document.createElement("img");
            recipeImage.setAttribute("src", `${recipe.image}`);
            recipeImage.setAttribute("class", "recipeImage");
            const recipeItem = document.createElement("div");
            recipeItem.setAttribute("class", "recipeItem");
            recipeItem.addEventListener("click", function () {
                createSummary(recipe);
            });
            recipeItem.innerHTML = `${recipeImage.outerHTML}<div>${recipe.title}</div>`;
            recipeResponse.appendChild(recipeItem);
        })
        errorResponse.textContent = "";
    } else {
        errorResponse.textContent = "No recipes found. Please try it with antoher input."
    }


    console.log(`recipeList: `, recipeList, `\ndietType: `, dietTypeValue, '\nmealType: ', mealTypeValue,
        `\nrecipeListWithInformation: `, recipesWithInformation, `\nfilteredRecipeList: `, filteredRecipeList);

    form.reset();
});

function determineCheckedMealType() {
    for (const element of mealTypes) {
        if (element.checked) {
            mealTypeValue = element.value;
        }
    }
}

function determineSelectedDietType() {
    for (const element of dietTypes) {
        if (element.selected) {
            dietTypeValue = element.value;
        }
    }
}

async function filterRecipeListByDietType() {
    filteredRecipeList = [];
    switch (dietTypeValue) {
        case "vegan":
            filteredRecipeList = recipesWithInformation.filter(recipe => {
                return recipe.vegan;
            });
            break;
        case "vegetarian":
            filteredRecipeList = recipesWithInformation.filter(recipe => {
                return recipe.vegetarian;
            });
            break;
        case "glutenFree":
            filteredRecipeList = recipesWithInformation.filter(recipe => {
                return recipe.glutenFree;
            });
            break;
    }
}

async function filterRecipeListByMealType() {
    filteredRecipeList = filteredRecipeList.filter(recipe => {
        return recipe.dishTypes.includes(`${mealTypeValue}`);
    });
}

async function getRecipeInformation(recipeList) {

    const recipeIds = recipeList.map(recipe => recipe.id);

    let recipes = [];

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds}&apiKey=${API_KEY_3}`);
        recipes = await response.json();

        recipesWithInformation = recipes;
    } catch (error) {
        recipeResponse.textContent = "";
        errorResponse.textContent = `Fetch Error by getting recipe information: ${error.message}`;
    }
}


function getIngredients(recipe) {
    let ingredientNames = [];

    let analyzedInstructions = recipe.analyzedInstructions;
    if (analyzedInstructions) {
        for (const element of analyzedInstructions) {
            let steps = element.steps;
            if (steps) {
                for (const element of steps) {
                    let ingredients = element.ingredients;
                    if (ingredients) {
                        for (const element of ingredients) {
                            let ingredientName = element.name;
                            ingredientNames.push(ingredientName);
                        }
                    }
                }
            }
        }
    }
    return ingredientNames;
}

function createSummary(recipe) {

    recipeSummary.innerHTML = "";

    let ingredientNames = getIngredients(recipe);


    const summaryView = document.createElement("div");
    summaryView.setAttribute("class", "summaryContent");
    summaryView.innerHTML = `<span class="close">&times;</span>
<h1>${recipe.title}</h1><img class="summaryImage" src=${recipe.image} alt=${recipe.title}>
<label>Preparation time:</label><div>${recipe.readyInMinutes} minutes</div>
<label>Ingredients:</label><div>${ingredientNames}</div><label>Instructions:</label><div class="instructions">${recipe.instructions}</div>`;

    recipeSummary.appendChild(summaryView);
    recipeSummary.style.display = "block";

    window.onclick = function (event) {
        if (event.target === recipeSummary) {
            recipeSummary.style.display = "none";
        }
    }

    let span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
        recipeSummary.style.display = "none";
    }
}


