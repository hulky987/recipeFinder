import {MockData} from "./MockData.js";



function getRecipeListFromLocalStorage() {
    const recipeList = window.localStorage.getItem("recipeList");

    if(!recipeList) {
        window.localStorage.setItem("recipeList", JSON.stringify(MockData));
        return MockData;
    }

    return JSON.parse(recipeList);
}

function storeRecipeListInLocalStorage(recipeList) {
    window.localStorage.setItem("recipeList", JSON.stringify(recipeList));
}


// console.log("RecipeList", recipeList);
export  { getRecipeListFromLocalStorage, storeRecipeListInLocalStorage}