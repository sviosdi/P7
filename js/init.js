function loadIngredients() {
    const ingredients = new Map();
    recipes.forEach(recette => {
        recette.ingredients.forEach(ing => {
            let recipesTab = ingredients.get(ing.ingredient)
            if (!recipesTab) {
                recipesTab = [];
                ingredients.set(ing.ingredient.toLowerCase(), recipesTab)
            }
            recipesTab.push(recette.id);
        });
    });
    return ingredients;
}


function loadUstensiles() {
    const ustensiles = new Map();
    recipes.forEach(recette => {
        recette.ustensils.forEach(u => {
            let recipesTab = ustensiles.get(u)
            if (!recipesTab) {
                recipesTab = [];
                ustensiles.set(u, recipesTab)
            }
            recipesTab.push(recette.id);
        });
    });
    return ustensiles;
}


function loadAppareils() {
    const appareils = new Map();
    recipes.forEach(recette => {
        let recipesTab = appareils.get(recette.appliance)
        if (!recipesTab) {
            recipesTab = [];
            appareils.set(recette.appliance, recipesTab)
        }
        recipesTab.push(recette.id);
    });
    return appareils;
}

function search(evt) {
    let value = evt.target.value;
    if (value.length >= 3) {
        /* rechercher value dans :
            • le titre de la recette
            • la liste des ingrédients
            • la description de la recherche
        */

    }

}


let recipesSection = document.querySelector(".recipes");
recipes.forEach(recette => recipesSection.appendChild(new Card(recette).html));

let searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", search);

//console.log(ustensiles);
//console.log(appareils);


