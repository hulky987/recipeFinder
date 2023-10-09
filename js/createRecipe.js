import {getRecipeListFromLocalStorage,storeRecipeListInLocalStorage} from "./localStorageService.js";
const form = document.getElementById("createRecipe");



form.addEventListener("submit", (event) => {
    "use strict"
    event.preventDefault()
    event.stopPropagation()

    // getting the recipes out of the local storage
    const recipeList = getRecipeListFromLocalStorage();

    // getting the values from the form
    const ingredients = document.getElementById("create-ingredients");
    const title = document.getElementById("title");
    const instructions = document.getElementById("instructions");
    const dietType = document.getElementById("create-diet-type");
    const mealType = document.getElementById(`create-meal-type`);
    const cookingTime = document.getElementById("cooking-time");
    console.log(ingredients.value, title.value,  instructions.value, dietType.value, mealType.value)

    // creating the recipe object
    const recipe = {
        "title": title.value,
        "analyzedInstructions": instructions.value,
        "diets": dietType.value,
        "mealType": mealType.value,
        "extendedIngredients": ingredients.value.split(","),
        "cookingMinutes": cookingTime.value
    }


    // pushing the recipe into the recipeList and storing it in the local storage
    recipeList.push(recipe);
    storeRecipeListInLocalStorage(recipeList);

});
