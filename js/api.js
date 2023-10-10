const form = document.getElementById("recipeApi");
const ingredients = document.getElementById("ingredients");
const recipeResponse = document.getElementById("recipeResponse");
const errorResponse = document.getElementById("errorResponse");
const dietTypes = document.getElementsByTagName("option");
const mealTypes = document.getElementsByTagName("input");
const recipeSummary = document.getElementById("recipeSummary");

const API_KEY = "59e199f1b62247779346095f4dfe259e";
const API_KEY_2 = "62efe392f0484ea0b724363f2c26dbfe";
const API_KEY_3  ="230a70bc0bb04fb3ac7c45843d5f4ec8"

let recipesWithInformation = [];
let filteredRecipeList = [];
const recipeList = [];

let mealTypeValue = "";
let dietTypeValue = "";


form.addEventListener("submit", async (event) => {

    event.preventDefault();
    let recipes = [];

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.value.trim()}&number=10&apiKey=${API_KEY_2}`);
        recipes = await response.json();

        recipes.forEach(recipe => {
            recipeList.push(recipe);
        })
        await getRecipeInformation(recipeList);
        // recipeResponse.textContent = `Es wurden ${recipes.length} Rezepte gefunden: ${recipeList.map(recipe => recipe.title)}`;
        await recipesWithInformation.forEach(recipe => {
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
    } catch (error) {
        recipeResponse.textContent = "";
        errorResponse.textContent = `Fetch Error by getting recipe: ${error.message}`;
    }

    determineCheckedMealType();
    determineSelectedDietType();

    await filterRecipeListByDietType();

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

async function filterRecipeListByDietType() {
    filteredRecipeList = recipesWithInformation.filter(recipe => {
        recipe.dishTypes.includes(`${mealTypeValue}`);
    });

    console.log(`recipeList: `, recipeList, `\ndietType: `, dietTypeValue, '\nmealType: ', mealTypeValue, `\nrecipeListWithInformation: `, recipesWithInformation, `\nfilteredRecipeList: `, filteredRecipeList);
}

async function getRecipeInformation(recipeList) {

    const recipeIds = recipeList.map(recipe => recipe.id);

    let recipes = [];

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds}&apiKey=${API_KEY_2}`);
        recipes = await response.json();

        recipesWithInformation = recipes;
    } catch (error) {
        recipeResponse.textContent = "";
        errorResponse.textContent = `Fetch Error by getting recipe information: ${error.message}`;
    }
}

function createSummary(recipe) {

    recipeSummary.innerHTML = "";

    const summaryView = document.createElement("div");
    summaryView.setAttribute("class", "summaryContent");
    summaryView.innerHTML = `<span class="close">&times;</span><img src=${recipe.image}><div>${recipe.title}</div>${recipe.summary}`;

    recipeSummary.appendChild(summaryView);
    recipeSummary.style.display = "block";

    window.onclick = function(event) {
        if (event.target === recipeSummary) {
            recipeSummary.style.display = "none";
        }
    }

    let span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        recipeSummary.style.display = "none";
    }
}


