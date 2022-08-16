// eslint-disable-next-line no-undef
let cmbIngredients = new Combo('Ingrédients');
// eslint-disable-next-line no-undef
let cmbAppareils = new Combo('Appareils');
// eslint-disable-next-line no-undef
let cmbUstensiles = new Combo("Ustensiles");

let allRecipesSet = new Set(); // le set des id de l'ensemble des 50 recettes.
// eslint-disable-next-line no-undef
for (let i = 0; i < recipes.length; i++)
    allRecipesSet.add(i + 1);

let principalSearchSet = new Set(allRecipesSet); // le set des recettes correspondant à la recherche principale en cours.
// au départ, on affiche toutes les recettes
let currentSet = new Set(allRecipesSet); // le set du résultat de la recherche principale filtrée par l'ajout des tags.
let currentTags = { 'ingrédients': [], 'appareils': [], 'ustensiles': [] };

let ingredients = loadIngredients();
let appareils = loadAppareils();
let ustensiles = loadUstensiles();

cmbIngredients.resize(600);

let noresults = document.getElementById('noresults');
updateInterfaceWithSet(allRecipesSet);

let searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", search);


// paramètre : set = un set d'id. de recettes
// Retourne le set des ingrédients utilisés par chacune des recettes du set passé en paramètre.
function loadIngredients(set) {
    if (!set) set = allRecipesSet;
    const ingset = new Set();
    for (let r_id of set) {
        // eslint-disable-next-line no-undef
        let recette = recipes[r_id - 1];
        recette.ingredients.forEach(ing => {
            ingset.add(ing.ingredient.toLowerCase());
        });
    }
    return ingset;
}

// paramètre : set = un set d'id. de recettes
// Retourne le set des ustensiles utilisés par chacune des recettes du set passé en paramètre.
function loadUstensiles(set) {
    if (!set) set = allRecipesSet;
    const ustensiles = new Set();
    for (let r_id of set) {
        // eslint-disable-next-line no-undef
        let recette = recipes[r_id - 1];
        recette.ustensils.forEach(u => {
            ustensiles.add(u.toLowerCase());
        });
    }
    return ustensiles;
}

// paramètre : set = un set d'id. de recettes
// Retourne le set des appareils utilisés par chacune des recettes du set passé en paramètre.
function loadAppareils(set) {
    if (!set) set = allRecipesSet;
    const appareils = new Set();
    for (let r_id of set) {
        // eslint-disable-next-line no-undef
        let recette = recipes[r_id - 1];
        appareils.add(recette.appliance.toLowerCase());
    }
    return appareils;
}

// Fonction de recherche principale 
function search(evt) {
    let searchString = evt.target.value.toLowerCase();
    let words = searchString.split(' ').filter(v => v != '');

    if (words.length === 0) {
        principalSearchSet = new Set(allRecipesSet);
        if (currentTags["ingrédients"].length === 0 && currentTags.appareils.length === 0 && currentTags.ustensiles.length === 0) {
            updateInterfaceWithSet(allRecipesSet);
        } else {
            // eslint-disable-next-line no-undef
            currentSet = filterSet(principalSearchSet);
            updateInterfaceWithSet(currentSet);
        }
        return;
    } else if (words[0].length > 2) {
        principalSearchSet.clear();
        currentSet.clear();
        let recipesSection = document.querySelector(".recipes");
        recipesSection.innerHTML = "";
        // eslint-disable-next-line no-undef
        for (let i = 0; i < recipes.length; i++) {
            let allWordsFoundInRecipe = true;
            let j;
            for (j = 0; j < words.length; j++) {
                // eslint-disable-next-line no-undef
                let ings = recipes[i].ingredients;
                let foundInIngredients = 0;
                for (let k = 0; k < ings.length; k++) {
                    if (ings[k].ingredient.toLowerCase().includes(words[j])) {
                        foundInIngredients = 1;
                        // le j-ème mot de la recherche principale est trouvé dans un des ingrédients
                        // de la recette, inutile de le rechercher dans les ingrédients suivants
                        // quitter le parcours des ingrédients et passer à la suite
                        break; // sur k (les ingrédients)
                    }
                }

                if (foundInIngredients) {
                    // le j-ème mot de la recherche principale a été trouvé dans les ingrédients, inutile de
                    // le rechercher dans le titre ou dans la description
                    // marquer le mot comme trouvé et passer au mot suivant                        
                    continue; // sur j (les mots)
                }

                // continuer la recherche dans le titre
                // eslint-disable-next-line no-undef
                if (recipes[i].name.toLowerCase().includes(words[j])) {
                    // le j-ème mot de la recherche principale a été trouvé dans le titre inutile de
                    // le rechercher dans la description
                    // marquer le mot comme trouvé et passer au mot suivant               
                    continue; // sur j (les mots)
                }

                // continuer la recherche dans la description
                // eslint-disable-next-line no-undef    
                if (recipes[i].description.toLowerCase().includes(words[j])) {
                    // le j-ème mot de la recherche principale a été trouvé dans la description
                    // marquer le mot comme trouvé et passer au mot suivant                                     
                    continue; // sur j (les mots)
                }

                // le j-ème mot de la recherche principale n'a pas été trouvé dans la recette
                allWordsFoundInRecipe = false;
                break; // sur j (les mots)
                //}
            }
            // si tous les mots ont été parcourus et trouvés dans la recette (allWordsFoundInRecipe n'a pas 
            // été mis à false lors du parcours d'un des mots  <=> recherche positive: afficher la recette 
            if (j === words.length && allWordsFoundInRecipe) {
                principalSearchSet.add(i + 1); //recipes[i].id);
                if ((currentTags["ingrédients"].length === 0 && currentTags.appareils.length === 0 && currentTags.ustensiles.length === 0)
                    // eslint-disable-next-line no-undef
                    || recipeRespectsAllTags(i + 1)) {
                    addToInterface(i + 1);  // recipes[i].id);
                    currentSet.add(i + 1);
                }
            }
        }

        // toutes les recettes ont été parcourues et les cards 'positives' affichées et principalSearchSet, currentSet mis à jour    

        if (currentSet.size === 0) {
            noresults.style.display = 'block';
            noresults.textContent = "Aucune recette ne correspond à votre critère... vous pouvez\
    chercher « tarte aux pommes », « poisson », etc. ou supprimer éventuellement des filtres";
            clearCombos();
        } else {
            noresults.style.display = 'none';
            updateCombosWithSet(currentSet);
        }
    }

}

// Crée les Cards des recettes dont l'id. est un élément du set passé en paramètre puis les affiche.
function displaySet(set) {
    let recipesSection = document.querySelector(".recipes");
    recipesSection.innerHTML = "";
    for (let id of set) {
        // eslint-disable-next-line no-undef
        recipesSection.appendChild(new Card(recipes[id - 1]).html);
    }
}

// Affiche les Cards correspondant au set passé en paramètre et met à jour le contenu des combos pour
// qu'il ne corresponde qu'aux recettes du set passé en paramètre.
function updateInterfaceWithSet(set) {
    if (set.size === 0) {
        noresults.style.display = 'block';
        noresults.textContent = "Aucune recette ne correspond à votre critère... vous pouvez\
    chercher « tarte aux pommes », « poisson », etc.";
    } else {
        noresults.style.display = 'none';
    }
    displaySet(set);
    updateCombosWithSet(set);
}

// Ajout individuel d'un recette dont l'id. est passé en paramètre, sans mise à jour correspondante 
// des combos.
function addToInterface(recetteId) {
    let recipesSection = document.querySelector(".recipes");
    // eslint-disable-next-line no-undef
    recipesSection.appendChild(new Card(recipes[recetteId - 1]).html);
    // le contenu des combos n'est mis à jour qu'une fois la recherche principale terminée 
}

// Met à jour le contenu des combos pour qu'il ne corresponde qu'aux 
// recettes du set passé en paramètre.
function updateCombosWithSet(set) {
    if (set === allRecipesSet) {
        cmbIngredients.content = ingredients;
        cmbAppareils.content = appareils;
        cmbUstensiles.content = ustensiles;
    } else {
        cmbIngredients.content = loadIngredients(set);
        cmbAppareils.content = loadAppareils(set);
        cmbUstensiles.content = loadUstensiles(set);
    }
    cmbIngredients.fillContent(cmbIngredients.content);
    cmbAppareils.fillContent(cmbAppareils.content);
    cmbUstensiles.fillContent(cmbUstensiles.content);
}

function clearCombos() {
    cmbIngredients.clear();
    cmbAppareils.clear();
    cmbUstensiles.clear();
    cmbIngredients.close();
    cmbAppareils.close();
    cmbUstensiles.close();
}



