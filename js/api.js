const form = document.getElementById("recipeApi");
const ingredients = document.getElementById("ingredients");
const recipeResponse = document.getElementById("recipeResponse");
const errorResponse = document.getElementById("errorResponse");
const dietTypes = document.getElementsByTagName("option");
const mealTypes = document.getElementsByTagName("input");

const API_KEY = "59e199f1b62247779346095f4dfe259e";
const API_KEY_2 = "62efe392f0484ea0b724363f2c26dbfe";
const API_KEY_3  ="230a70bc0bb04fb3ac7c45843d5f4ec8"

let recipesWithInformation = [];
let filteredRecipeList = [];
const recipeList = [];

let mealTypeValue = "";
let dietTypeValue = "";


form.addEventListener("submit", (event) => {

    event.preventDefault();
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.value.trim()}&number=10&apiKey=${API_KEY}`)
        .then(response => response.json())
        .then(recipes => {
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

    determineCheckedMealType();
    determineSelectedDietType();

    filterRecipeListByDietType();

    console.log(`recipeList: `, recipeList, `\ndietType: `, dietTypeValue, '\nmealType: ', mealTypeValue, `\nrecipeListWithInformation: `, recipesWithInformation, `\nfilteredRecipeList: `, filteredRecipeList);

    form.reset();
});

function determineCheckedMealType() {
    for (let i = 0; i < mealTypes.length; i++) {
        if (mealTypes[i].checked) {
            mealTypeValue = mealTypes[i].value;
        }
    }
}

function determineSelectedDietType() {
    for (let i = 0; i < dietTypes.length; i++) {
        if (dietTypes[i].selected) {
            dietTypeValue = dietTypes[i].value;
        }
    }
}

function filterRecipeListByDietType() {
    filteredRecipeList = recipesWithInformation.filter(recipe => {
        recipe.dishTypes.includes(`${mealTypeValue}`);
    });
}

function getRecipeInformation(recipeList) {

    const recipeIds = recipeList.map(recipe => recipe.id);
    fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds}&apiKey=${API_KEY}`)
        .then(response => response.json())
        .then(recipeList => {
            recipesWithInformation = recipeList;
        })
        .catch(error => {
            recipeResponse.textContent = "";
            errorResponse.textContent = `Fetch Error by getting recipe information: ${error.message}`;
        })
}
