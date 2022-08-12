let cmbIngredients = new Combo('Ingrédients');
let cmbAppareils = new Combo('Appareils');
let cmbUstensiles = new Combo("Ustensiles");

let allRecipesSet = new Set(); // le set de l'ensemble des 50 recettes.
for (let i = 0; i < recipes.length; i++)
    allRecipesSet.add(i + 1);

let principalSearchSet = new Set(allRecipesSet); // le set des recettes correspondant à la recherche principale en cours.
// au départ, on affiche toutes les recettes
let currentSet = new Set(allRecipesSet);  // le set du résultat de la recherche principale filtrée par l'ajout des tags.
let currentTags = { 'ingrédients': [], 'appareils': [], 'ustensiles': [] };

let ingredients = loadIngredients(); 
let ustensiles = loadUstensiles();
let appareils = loadAppareils();

cmbIngredients.resize(600);
//let orderedIng = new Map([...ingredients.entries()].sort());

updateInterfaceWithSet(allRecipesSet);

let searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", search);

// Paramètre : set = un Set d'id. de recettes.
// Retourne un set dont les éléments sont les ingrédients des recettes dont l'id. appartient 
// au set passé en paramètre.
function loadIngredients(set) {
    if (!set) set = allRecipesSet;
    const ingMap = new Map();
    for (let r_id of set) {
        let recette = recipes[r_id - 1];
        recette.ingredients.forEach(ing => {
            let key = ing.ingredient.toLowerCase();
            let recipesTab = ingMap.get(key)
            if (!recipesTab) {
                recipesTab = [];
                ingMap.set(key, recipesTab);
            }
            recipesTab.push(recette.id);
        });
    }
    return ingMap;
}

// Paramètre : set = un Set d'id. de recettes.
// Retourne un set dont les éléments sont les ustensiles des recettes dont l'id. appartient 
// au set passé en paramètre.
function loadUstensiles(set) {
    if (!set) set = allRecipesSet;
    const ustMap = new Map();
    for (let r_id of set) {
        let recette = recipes[r_id - 1];
        recette.ustensils.forEach(u => {
            let key = u.toLowerCase();
            let recipesTab = ustMap.get(key)
            if (!recipesTab) {
                recipesTab = [];
                ustMap.set(key, recipesTab);
            }
            recipesTab.push(recette.id);
        });
    }
    return ustMap;
}

// Paramètre : set = un Set d'id. de recettes.
// Retourne un set dont les éléments sont les appareils des recettes dont l'id. appartient 
// au set passé en paramètre.
function loadAppareils(set) {
    if (!set) set = allRecipesSet;
    const appMap = new Map();
    for (let r_id of set) {
        let recette = recipes[r_id - 1];
        let key = recette.appliance.toLowerCase();
        let recipesTab = appMap.get(key);
        if (!recipesTab) {
            recipesTab = [];
            appMap.set(key, recipesTab)
        }
        recipesTab.push(recette.id);
    }
    return appMap;
}

/* Fonction de recherche principale */
function search(evt) {
    // console.time('principalSearch');
    let searchString = evt.target.value.toLowerCase();
    let words = searchString.split(' ').filter(v => v != '');

    if (words.length === 0) {
        principalSearchSet = new Set(allRecipesSet);       
        // prendre l'intersection avec les tags
        if (currentTags["ingrédients"].length === 0 && currentTags.appareils.length === 0 && currentTags.ustensiles.length === 0) {
            updateInterfaceWithSet(principalSearchSet);
        } else {
            currentSet = interWithTags();
            updateInterfaceWithSet(currentSet);
        }
        return;
    } else if (words[0].length > 2) {
        principalSearchSet.clear();
        currentSet.clear();
        let recipesSection = document.querySelector(".recipes");
        recipesSection.innerHTML = "";

        for (let i = 0; i < recipes.length; i++) {
            let allWordsFoundInRecipe = true;
            let j;
            for (j = 0; j < words.length; j++) {
                let ings = recipes[i].ingredients;
                let foundIfIngredients = 0;
                for (let k = 0; k < ings.length; k++) {
                    if (ings[k].ingredient.toLowerCase().includes(words[j])) {
                        foundIfIngredients = 1;
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
                    continue; // sur j (les mots)
                }

                // continuer la recherche dans la description

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
                if ((currentTags["ingrédients"].length === 0 && currentTags.appareils.length === 0 && currentTags.ustensiles.length === 0) || recipeRespectsAllTags(i + 1)) {
                    addToInterface(i + 1);
                    currentSet.add(i + 1);
                }
            }
        }
        // toutes les recettes ont été parcourues et les cards 'positives' affichées       

        if (currentSet.size === 0) {
            document.querySelector(".recipes").innerHTML = "";
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

// Crée les Cards des recettes dont l'id. est passé en paramètre et les ajoute à l'interface
function displaySet(set) {
    let recipesSection = document.querySelector(".recipes");
    recipesSection.innerHTML = "";
    for (let id of set) {
        recipesSection.appendChild(new Card(recipes[id - 1]).html);
    }
}

// Ajoute toutes les recettes du set passé en paramètre à l'interface puis met à jour les combos.
function updateInterfaceWithSet(set) {
    let noresults = document.getElementById('noresults');
    noresults.style.display = set.size != 0 ? 'none' : 'block';
    displaySet(set);
    updateCombosWithSet(set);
}

// Ajoute individuellement la recette dont l'id. est passé en paramètre à l'interface, sans mettre à jour le 
// contenu des combos.
function addToInterface(recetteId) {
    let recipesSection = document.querySelector(".recipes");
    recipesSection.appendChild(new Card(recipes[recetteId - 1]).html);
    // le contenu des combos n'est mis à jour qu'une fois la recherche principale terminée 
}

// Met à jour le contenu des combos pour qu'il ne reflète que les recettes dont l'id. appartient 
// au set passé en paramètre.
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
    cmbAppareils.close();
}




