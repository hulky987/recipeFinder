import {getRecipeListFromLocalStorage} from "./localStorageService.js";

const form = document.getElementById("recipeApi");
const ingredients = document.getElementById("ingredients");
let recipeResponse = document.getElementById("recipeResponse");
const errorResponse = document.getElementById("errorResponse");
const dietTypes = document.getElementsByTagName("option");
const mealTypes = document.getElementsByTagName("input");
const recipeSummary = document.getElementById("recipeSummary");
const formTimeFilter = document.getElementById("formTimeFilter");
const filterTime = document.getElementsByName("filterInMinutes");
const timeFilterDiv = document.getElementById("timeFilter");

const API_KEY = "59e199f1b62247779346095f4dfe259e";
const API_KEY_2 = "62efe392f0484ea0b724363f2c26dbfe";
const API_KEY_3 = "230a70bc0bb04fb3ac7c45843d5f4ec8"

let recipesWithInformation = getRecipeListFromLocalStorage()
let filteredRecipeList = [];

let mealTypeValue = "";
let dietTypeValue = "";
let filterTimeValue = 500;

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (ingredients.value.trim() !== "") {
        await filterRecipeListByIngredients(recipesWithInformation);
        // await filterRecipeListByIngredientsNew(recipesWithInformation);

    } else {
        filteredRecipeList = recipesWithInformation;
    }


    determineCheckedMealType();
    determineSelectedDietType();

    if (dietTypeValue !== "default") {
        await filterRecipeListByDietType();
    }

    if (mealTypeValue !== "all") {
        await filterRecipeListByMealType();
    }


    showFilteredRecipes(filteredRecipeList);


    console.log(`dietType: `, dietTypeValue, '\nmealType: ', mealTypeValue,
        `\nrecipeListWithInformation: `, recipesWithInformation, `\nfilteredRecipeList: `, filteredRecipeList);

    form.reset();
});

function showFilteredRecipes(list) {

    recipeResponse.innerHTML = "";
    if (list.length > 0) {
        list.forEach(recipe => {
            const recipeImage = document.createElement("img");
            recipeImage.setAttribute("src", `${recipe.image}`);
            recipeImage.setAttribute("class", "recipeImage");
            const recipeItem = document.createElement("div");
            recipeItem.setAttribute("class", "recipeItem");
            recipeItem.addEventListener("click", function () {
                createSummary(recipe);
            });
            recipeItem.innerHTML = `${recipeImage.outerHTML}<div class="itemDescription">${recipe.title}</div>`;
            recipeResponse.appendChild(recipeItem);
        })
        errorResponse.textContent = "";
    } else {
        errorResponse.textContent = "No recipes found. Please try it with another input."
    }

    timeFilterDiv.style.display = "block";
}


// async function filterRecipeListByIngredientsNew(recipeList) {
//     filteredRecipeList = [];
//     const ingredientsToFilter = ingredients.value.split(",");
//     console.log(ingredientsToFilter)
//     for (const recipe of recipeList) {
//         let recipeIngredients = [];
//         let extendedIngredients = recipe.extendedIngredients;
//         if (extendedIngredients) {
//             for (const ingredient of extendedIngredients) {
//                 let ingredientName = ingredient.name.toLowerCase();
//                 recipeIngredients.push(ingredientName);
//             }
//             console.log(recipeIngredients)
//             let containsAllIngredients = ingredientsToFilter.every(ingredient => recipeIngredients.includes(ingredient.toLowerCase().trim()||`${ingredient.toLowerCase().trim()}s`));
//
//             if (containsAllIngredients) {
//                 filteredRecipeList.push(recipe);
//             }
//         }
//     }
// }

async function filterRecipeListByIngredients(recipeList) {
    filteredRecipeList = [];
    const ingredientsToFilter = ingredients.value.split(",");
    for (const recipe of recipeList) {
        let analyzedInstructions = recipe.analyzedInstructions;
        if (analyzedInstructions) {
            for (const element of analyzedInstructions) {
                let instruction = element;
                let recipeIngredients = [];

                let steps = instruction.steps;
                if (steps) {
                    for (const element of steps) {
                        let ingredients = element.ingredients;
                        if (ingredients) {
                            for (const element of ingredients) {
                                let ingredientName = element.name.toLowerCase();
                                recipeIngredients.push(ingredientName);
                            }
                        }
                    }
                }

                let containsAllIngredients = ingredientsToFilter.every(ingredient => recipeIngredients.includes(ingredient.toLowerCase().trim()));

                if (containsAllIngredients) {
                    filteredRecipeList.push(recipe);
                }
            }
        }
    }
}

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

// async function getRecipeInformation(recipeList) {
//
//     const recipeIds = recipeList.map(recipe => recipe.id);
//
//     let recipes = [];
//
//     try {
//         const response = await fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds}&apiKey=${API_KEY_3}`);
//         recipes = await response.json();
//
//         recipesWithInformation = recipes;
//     } catch (error) {
//         recipeResponse.textContent = "";
//         errorResponse.textContent = `Fetch Error by getting recipe information: ${error.message}`;
//     }
// }

function getIngredients(recipe) {
    let ingredients = []
    let extendedIngredients = recipe.extendedIngredients;
    extendedIngredients.forEach(ingredient => {
        let ingredientName = ` ${ingredient.amount} ${ingredient.unit} ${ingredient.name}`
        ingredients.push(ingredientName)
    })
    return ingredients;
}

//
// function getIngredients(recipe) {
//     let ingredientNames = [];
//
//     let analyzedInstructions = recipe.analyzedInstructions;
//     if (analyzedInstructions) {
//         for (const element of analyzedInstructions) {
//             let steps = element.steps;
//             if (steps) {
//                 for (const element of steps) {
//                     let ingredients = element.ingredients;
//                     if (ingredients) {
//                         for (const element of ingredients) {
//                             let ingredientName = element.name;
//                             ingredientNames.push(ingredientName);
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return ingredientNames;
// }

function createSummary(recipe) {

    recipeSummary.innerHTML = "";

    let ingredients = getIngredients(recipe)

    const summaryView = document.createElement("div");
    summaryView.setAttribute("class", "summaryContent");
    summaryView.innerHTML = `<span class="close">&times;</span>
<h1>${recipe.title}</h1><img class="summaryImage" width="556px" height="370px" src=${recipe.image} alt=${recipe.title}>
<label>Preparation time:</label><div>${recipe.readyInMinutes} minutes</div><br/>
<label>Ingredients:</label><div>${ingredients}</div><br/><label>Instructions:</label><div class="instructions">${recipe.instructions}</div><br/>
<label>Summary</label><div>${recipe.summary}</div>`;

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


formTimeFilter.addEventListener("submit", async (event) => {
    event.preventDefault();

    determineCheckedFilterTime();
    await filterRecipeListByPreparationTime();

    showFilteredRecipes(filteredRecipeList);

    formTimeFilter.reset();
});

async function filterRecipeListByPreparationTime() {
    filteredRecipeList = filteredRecipeList.filter(recipe => {
        return recipe.readyInMinutes <= filterTimeValue;
    });
}

function determineCheckedFilterTime() {
    for (const element of filterTime) {
        if (element.checked) {
            filterTimeValue = element.value;
        }
    }
}


