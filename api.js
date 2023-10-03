const form = document.getElementById("recipeApi");
const ingredients = document.getElementById("ingredients");
const recipeResponse = document.getElementById("recipeResponse");
const errorResponse = document.getElementById("errorResponse");

const API_KEY = "5135a9ea59ef4af9803ada6a41024ee7";

const numberOfRecipes = 100;

const titles = [];

form.addEventListener("submit", (event) => {

    event.preventDefault();
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.value.trim()}&number=${numberOfRecipes}&apiKey=${API_KEY}`)
        .then(response =>
            response.json()).then(recipes => {
                recipes.forEach(recipe => titles.push(recipe.title))
        recipeResponse.textContent = `Es wurden ${recipes.length} Rezepte gefunden: ${titles}`;
        errorResponse.textContent = "";
    })
        .catch(error => {
            recipeResponse.textContent = "";
            errorResponse.textContent = `Fetch Error: ${error.message}`;
        })
});