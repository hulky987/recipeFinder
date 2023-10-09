import {getRecipeListFromLocalStorage, storeRecipeListInLocalStorage} from "./localStorageService.js";

const form = document.getElementById("createRecipe");
const addIngredientButton = document.getElementById("add-ingredient");


const createIngredientInput = () => {
    const units = ["g", "kg", "ml", "l", "Stk.", "TL", "EL", "Prise", "Tasse", "Pck.", "Dose",]
    const div = document.createElement("div");
    div.setAttribute("class", "create-ingredients-container");

    const unitSelect = document.createElement("select");
    unitSelect.setAttribute("name", "create-unit");
    unitSelect.setAttribute("class", "create-unit");
    units.forEach(unit => {
        const option = document.createElement("option");
        option.setAttribute("value", unit);
        option.textContent = unit;
        unitSelect.appendChild(option);
    })

    const ingredientInput = document.createElement("input");
    ingredientInput.setAttribute("type", "text");
    ingredientInput.setAttribute("name", "create-ingredient");
    ingredientInput.setAttribute("placeholder", "Zutat");
    ingredientInput.setAttribute("class", "create-ingredient");

    const amountInput = document.createElement("input");
    amountInput.setAttribute("type", "number");
    amountInput.setAttribute("name", "create-amount");
    amountInput.setAttribute("placeholder", "Menge");

    div.appendChild(ingredientInput);
    div.appendChild(amountInput);
    div.appendChild(unitSelect);
    return div;
}
addIngredientButton.addEventListener("click", (event) => {
    const ingredientsContainer = document.getElementById("ingredientsContainer");
    ingredientsContainer.appendChild(createIngredientInput());
})


form.addEventListener("submit", (event) => {
    "use strict"
    event.preventDefault()
    event.stopPropagation()

    // getting the recipes out of the local storage
    const recipeList = getRecipeListFromLocalStorage();
    const units = recipeList.map(recipe => recipe.extendedIngredients.map(ingredient => ingredient.unit))
    console.log(units)
    // getting the values from the form

    const ingredientsContainer = document.getElementsByClassName("create-ingredients-container");
    const extendedIngredients = Array.from(ingredientsContainer).map(element => {
        return {name: element.children[0].value, amount: element.children[1].value, unit: element.children[2].value}
    });
    const title = document.getElementById("title");
    const instructions = document.getElementById("instructions");
    const dietTypeElements = document.querySelectorAll(`input[name="create-diet-type"]:checked`)
    const dietTypes = Array.from(dietTypeElements).map(element => element.value);
    const mealTypeElements = document.querySelectorAll(`input[name="create-meal-type"]:checked`)
    const mealTypes = Array.from(mealTypeElements).map(element => element.value);
    const cookingTime = document.getElementById("cooking-time");
    const summary = document.getElementById("summary");
    const diets = recipeList.map(recipe => recipe.diets)
    const types = recipeList.map(recipe => recipe.dishTypes)
    // creating the recipe object
    const recipe = {
        "title": title.value,
        "summary": summary.value,
        "instructions": instructions.value,
        "diets": dietTypes,
        "dishTypes": mealTypes,
        "extendedIngredients": extendedIngredients,
        "readyInMinutes": cookingTime.value
    }

    console.log(recipe)

    // pushing the recipe into the recipeList and storing it in the local storage
    // recipeList.push(recipe);
    // storeRecipeListInLocalStorage(recipeList);

});
