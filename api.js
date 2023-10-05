// import {filterRecipesByDietType} from "./recipeService";

const form = document.getElementById("recipeApi");
const ingredients = document.getElementById("ingredients");
const recipeResponse = document.getElementById("recipeResponse");
const errorResponse = document.getElementById("errorResponse");

const dietTypes = document.getElementsByTagName("option");
const mealTypes = document.getElementsByName("input");

const API_KEY = "59e199f1b62247779346095f4dfe259e";
const API_KEY_2 = "62efe392f0484ea0b724363f2c26dbfe";

const recipeList = [];
const extendedRecipeList = [];

let mealTypeValue = "";
let dietTypeValue = ""


function getRecipeInformation(recipeList) {

    const recipeIds = recipeList.map(recipe => recipe.id);

    fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds}&apiKey=${API_KEY_2}`)
        .then(response => response.json()).then(recipe => {
        console.log(recipe);
    })
        .catch(error => {
            recipeResponse.textContent = "";
            errorResponse.textContent = `Fetch Error by getting recipe information: ${error.message}`;
        })

    // filterRecipesByDietType(extendedRecipeList);
}

form.addEventListener("submit", (event) => {

    event.preventDefault();
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.value.trim()}&number=10&apiKey=${API_KEY_2}`)
        .then(response =>
            response.json()).then(recipes => {
                recipes.forEach(recipe => {
                    recipeList.push(recipe);
                })
        getRecipeInformation(recipeList);
        recipeResponse.textContent = `Es wurden ${recipes.length} Rezepte gefunden: ${recipeList.map(recipe => recipe.title)}`;
        errorResponse.textContent = "";
    })
        .catch(error => {
            recipeResponse.textContent = "";
            errorResponse.textContent = `Fetch Error by getting recipe: ${error.message}`;
        });

    // mealTypes.forEach(mealType => {
    //     mealType.checked ? mealTypeValue = mealType.value : "";
    // });
    // console.log(`dietType: `, dietTypeValue, '\nmealType: ', mealTypeValue);

    form.reset();
});



// function filterRecipesByDietType(recipeList) {
//     console.log(dietType, mealType);
// }