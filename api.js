const form = document.getElementById("recipeApi");
const ingredients = document.getElementById("ingredients");
const recipeResponse = document.getElementById("recipeResponse");
const errorResponse = document.getElementById("errorResponse");

const API_KEY = "59e199f1b62247779346095f4dfe259e";
const API_KEY_2 = "62efe392f0484ea0b724363f2c26dbfe";

const recipeList = [];
const extendedRecipeList = [];

function getRecipeInformation(recipeId) {

    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${API_KEY_2}`)
        .then(response => response.json()).then(recipe => {
            extendedRecipeList.push(recipe);
    })
        .catch(error => {
            recipeResponse.textContent = "";
            errorResponse.textContent = `Fetch Error by getting recipe information: ${error.message}`;
        })
}

form.addEventListener("submit", (event) => {

    event.preventDefault();
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.value.trim()}&apiKey=${API_KEY_2}`)
        .then(response =>
            response.json()).then(recipes => {
                recipes.forEach(recipe => {
                    recipeList.push(recipe);
                    getRecipeInformation(recipe.id);
                })
        recipeResponse.textContent = `Es wurden ${recipes.length} Rezepte gefunden: ${recipeList.map(recipe => recipe.title)}`;
        errorResponse.textContent = "";
    })
        .catch(error => {
            recipeResponse.textContent = "";
            errorResponse.textContent = `Fetch Error by getting recipe: ${error.message}`;
        })

    console.log(extendedRecipeList);

    form.reset()
});