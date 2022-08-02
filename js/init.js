let cmbIngredients = new Combo('Ingrédients');
let cmbAppareils = new Combo('Appareils');
let cmbUstensiles = new Combo("Ustensiles");



let globalSearchSet = new Set(); // le set des recettes correspondant à la recherche en cours
recipes.forEach(recette => globalSearchSet.add(recette.id));
const allRecipesSet = new Set(globalSearchSet);
let currentSet = new Set(allRecipesSet);
let resultSet = new Set();
let currentTags = { 'ingrédients': [], 'appareils': [], 'ustensiles': [] };

let ingredients = loadIngredients();
let ustensiles = loadUstensiles();
let appareils = loadAppareils();
cmbIngredients.resize(600);
//let orderedIng = new Map([...ingredients.entries()].sort());

cmbIngredients.content = ingredients;
cmbIngredients.fillContent(cmbIngredients.content);
cmbAppareils.content = appareils;
cmbAppareils.fillContent(cmbAppareils.content);
cmbUstensiles.content = ustensiles;
cmbUstensiles.fillContent(cmbUstensiles.content);
displaySet(currentSet);

let searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", search);

function loadIngredients(set) {
    if (!set) set = allRecipesSet;
    const ingredients = new Map();
    for (let r_id of set) {
        let recette = recipes[r_id - 1];
        recette.ingredients.forEach(ing => {
            let recipesTab = ingredients.get(ing.ingredient.toLowerCase())
            if (!recipesTab) {
                recipesTab = [];
                ingredients.set(ing.ingredient.toLowerCase(), recipesTab)
            }
            recipesTab.push(recette.id);
        });
    }
    return ingredients;
}

function loadUstensiles(set) {
    if (!set) set = allRecipesSet;
    const ustensiles = new Map();
    for (let r_id of set) {
        let recette = recipes[r_id - 1];
        recette.ustensils.forEach(u => {
            let recipesTab = ustensiles.get(u.toLowerCase())
            if (!recipesTab) {
                recipesTab = [];
                ustensiles.set(u.toLowerCase(), recipesTab)
            }
            recipesTab.push(recette.id);
        });
    }
    return ustensiles;
}

function loadAppareils(set) {
    if (!set) set = allRecipesSet;
    const appareils = new Map();
    for (let r_id of set) {
        let recette = recipes[r_id - 1];
        let recipesTab = appareils.get(recette.appliance.toLowerCase());
        if (!recipesTab) {
            recipesTab = [];
            appareils.set(recette.appliance.toLowerCase(), recipesTab)
        }
        recipesTab.push(recette.id);
    }
    return appareils;
}


let resultMap = new Map();

/* Fonction de recherche principale */
function search(evt) {
    currentSet.clear();
    let searchString = evt.target.value.toLowerCase();

    let words = searchString.split(' ').filter(v => v != '');

    for (let i = 0; i < recipes.length; i++) {
        let allWordsFoundInRecipe = true;
        let j;
        for (j = 0; j < words.length; j++) {
            if ((j === 0 && words[j].length > 2) || j > 0) {
                let ings = recipes[i].ingredients;
                let foundIfIngredients = 0;
                for (let k = 0; k < ings.length; k++) {
                    if (ings[k].ingredient.includes(words[j])) {
                        found = 1;
                        // le j-ème mot de la recherche principale est trouvé dans un des ingrédients
                        // de la recette, inutile de le rechercher dans les ingrédients suivants
                        // quitter le parcours des ingrédients et passer à la suite
                        break; // sur k (les ingrédients)
                    }
                };

                if (foundIfIngredients) {
                    // le j-ème mot de la recherche principale a été trouvé dans les ingrédients, inutile de
                    // le rechercher dans le titre ou dans la description
                    // marquer le mot comme trouvé et passer au mot suivant                        
                    continue; // sur j (les mots)
                }

                // continuer la recherche dans le titre

                if (recipes[i].name.toLowerCase().includes(words[j])) {
                    // le j-ème mot de la recherche principale a été trouvé dans le titre inutile de
                    // le rechercher dans la description
                    // marquer le mot comme trouvé et passer au mot suivant
                    // results[j] = 1;                
                    continue; // sur j (les mots)
                }

                // continuer la recherche dans la description

                if (recipes[i].description.toLowerCase().includes(words[j])) {
                    // le j-ème mot de la recherche principale a été trouvé dans la description
                    // marquer le mot comme trouvé et passer au mot suivant
                    // results[j] = 1;                    
                    continue; // sur j (les mots)
                }

                // le j-ème mot de la recherche principale n'a pas été trouvé dans la recette
                allWordsFoundInRecipe = false;
                break; // sur j (les mots)
            }
        }
        // si tous les mots ont été parcourus et trouvés dans la recette (allWordsFoundInRecipe n'a pas 
        // été mis à false lors du parcours d'un des mots  <=> recherche positive: afficher la recette 
        if (words.length !== 0 && words[0].length > 2 && j === words.length && allWordsFoundInRecipe) {
            addToInterface(recipes[i].id);
        } 

    };

    if (words.length !== 0 && words[0].length > 2)
        globalSearchSet = new Set(resultSet);
    //updateInterfaceWithSet(globalSearchSet);

    if (globalSearchSet.size === 0) {
        document.querySelector(".recipes").innerHTML = "";
        
        noresults.style.display = 'block';
        noresults.textContent = "Aucune recette ne correspond à votre critère... vous pouvez\
    chercher « tarte aux pommes », « poisson », etc."
    } else {
        noresults.style.display = 'none';
    }

    if (words.length === 0) {
        let noresults = document.getElementById('noresults');
        noresults.style.display = 'none';
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
    for (let id of set) {
        recipesSection.appendChild(new Card(recipes[id - 1]).html);
    }
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

function addToInterface(recetteId) {
    let recipesSection = document.querySelector(".recipes");
    if (resultSet.size === 0) {
        recipesSection.innerHTML = "";
        currentSet = resultSet;
    }
    currentSet.add(recetteId);
    recipesSection.appendChild(new Card(recipes[recetteId - 1]).html);
    cmbIngredients.content = loadIngredients(currentSet);
    cmbIngredients.fillContent(cmbIngredients.content);

    cmbAppareils.content = loadAppareils(currentSet);
    cmbAppareils.fillContent(cmbAppareils.content);

    cmbUstensiles.content = loadUstensiles(currentSet);
    cmbUstensiles.fillContent(cmbUstensiles.content);
}





