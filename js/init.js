let cmbIngredients = new Combo('Ingrédients');
let cmbAppareils = new Combo('Appareils');
let cmbUstensiles = new Combo("Ustensiles");

let ingredients = loadIngredients();
let ustensiles = loadUstensiles();
let appareils = loadAppareils();
cmbIngredients.resize(600);
//let orderedIng = new Map([...ingredients.entries()].sort());

let globalSearchSet = new Set(); // le set des recettes correspondant à la recherche en cours
recipes.forEach(recette => globalSearchSet.add(recette.id));
const allRecipesSet = new Set(globalSearchSet);
let currentSet = new Set(globalSearchSet);
let currentTags = { 'ingrédients': [], 'appareils': [], 'ustensiles': [] };

updateInterfaceWithSet(globalSearchSet);

let searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", search);

function loadIngredients(set) {
    const ingredients = new Map();
    recipes.forEach(recette => {
        if (!set || set.has(recette.id)) {
            recette.ingredients.forEach(ing => {
                let recipesTab = ingredients.get(ing.ingredient.toLowerCase())
                if (!recipesTab) {
                    recipesTab = [];
                    ingredients.set(ing.ingredient.toLowerCase(), recipesTab)
                }
                recipesTab.push(recette.id);
            });
        }
    });
    return ingredients;
}

function loadUstensiles(set) {
    const ustensiles = new Map();
    recipes.forEach(recette => {
        if (!set || set.has(recette.id)) {
            recette.ustensils.forEach(u => {
                let recipesTab = ustensiles.get(u.toLowerCase())
                if (!recipesTab) {
                    recipesTab = [];
                    ustensiles.set(u.toLowerCase(), recipesTab)
                }
                recipesTab.push(recette.id);
            });
        }
    });
    return ustensiles;
}

function loadAppareils(set) {
    const appareils = new Map();
    recipes.forEach(recette => {
        if (!set || set.has(recette.id)) {
            let recipesTab = appareils.get(recette.appliance.toLowerCase());
            if (!recipesTab) {
                recipesTab = [];
                appareils.set(recette.appliance.toLowerCase(), recipesTab)
            }
            recipesTab.push(recette.id);
        }
    });
    return appareils;
}


let resultMap = new Map();

function search(evt) {
    let searchString = evt.target.value.toLowerCase();
    let words = searchString.split(' ').filter(v => v != '');

    let results = [];

    words.forEach((word, idx) => {
        if ((idx === 0 && word.length > 2) || idx > 0) {
            let set = new Set();
            ingredients.forEach((v, k) => {
                if (k.includes(word)) {
                    v.forEach(i => set.add(i));
                }
            });

            recipes.forEach(recette => {
                if (recette.name.toLowerCase().includes(word)) {
                    set.add(recette.id);
                }

                if (recette.description.toLowerCase().includes(word)) {
                    set.add(recette.id);
                }
            });

            results.push(set);
        }
    });

    if (results.length > 0) {
        let inter = new Set();
        for (let e of results[0]) {
            let found = true;
            for (let i = 1; i < results.length; i++) {
                if (!results[i].has(e)) {
                    found = false;
                    break;
                }
            }
            if (found)
                inter.add(e);
        }
        globalSearchSet = inter;
        updateInterfaceWithSet(inter);
        let noresults = document.getElementById('noresults');
        if (inter.size === 0) {
            noresults.style.display = 'block';
            noresults.textContent = "Aucune recette ne correspond à votre critère... vous pouvez\
        chercher « tarte aux pommes », « poisson », etc."
        } else {
            noresults.style.display = 'none';
        }
    } /*else {
        console.log("no results")
        if (words[0] && words[0].length > 2) {
            document.getElementById('noresults').textContent = "Aucune recette ne correspond à votre critère... vous pouvez\
        chercher « tarte aux pommes », « poisson », etc."
        }
    }*/

    if (words.length === 0) {
        globalSearchSet = new Set(allRecipesSet);
        currentSet = new Set(globalSearchSet);
        let recipesSection = document.querySelector(".recipes");
        recipes.forEach(recette => recipesSection.appendChild(new Card(recette).html));
        cmbIngredients.fillContent(ingredients);
        cmbAppareils.fillContent(appareils);
        cmbUstensiles.fillContent(ustensiles);
    }

}

function displaySet(set) {
    let recipesSection = document.querySelector(".recipes");
    recipesSection.innerHTML = "";
    recipes.forEach(recette => {
        if (set.has(recette.id))
            recipesSection.appendChild(new Card(recette).html)
    });
}

function updateInterfaceWithSet(set) {
    if (set.size === 0) currentSet = globalSearchSet;
    else currentSet = set;
    displaySet(currentSet);
    cmbIngredients.content = loadIngredients(currentSet);
    cmbIngredients.fillContent(cmbIngredients.content);

    cmbAppareils.content = loadAppareils(currentSet);
    cmbAppareils.fillContent(cmbAppareils.content);

    cmbUstensiles.content = loadUstensiles(currentSet);
    cmbUstensiles.fillContent(cmbUstensiles.content);
}







