let cmbIngredients = new Combo('Ingrédients');
let cmbAppareils = new Combo('Appareils');
let cmbUstensiles = new Combo("Ustensiles");



let globalSearchSet = new Set(); // le set des recettes correspondant à la recherche en cours
recipes.forEach(recette => globalSearchSet.add(recette.id));
const allRecipesSet = new Set(globalSearchSet);
let currentSet = new Set(allRecipesSet);
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
    let searchString = evt.target.value.toLowerCase();
    let words = searchString.split(' ').filter(v => v != '');

    let results = [];
    /* algorithme initial : pour chacun des mots, pour chacune des recettes... et recherche dans les clé des ingrédients et
                            non dans les ingrédients de la recette eux-mêmes.
       inconvénients : obligation de filtrer toutes les recettes avant d'afficher les résultats.
                       il faut calculer l'intersection des résultats séparément.
                            */
    words.forEach((word, idx) => {
        /* si ingredients : '{lait de coco' => [1, 2, 3]}, { .... }, ..
        si word = 'coc' trouvé dans 'lait de coco' alors ajout au set des id. 1, 2 et 3 des recettes correspondantes; */
        if ((idx === 0 && word.length > 2) || idx > 0) {
            let set = new Set();
            ingredients.forEach((v, k) => {
                if (k.includes(word)) {
                    v.forEach(i => set.add(i));
                }
            });

            /* pour chacune des recettes : bouche 'for' car pas de possibilité  
               de stopper une boucle 'forEach' par continue ou break; */
            for (let i = 0; i < recipes.length; i++) {
                /* si 'coc' est trouvé dans le titre de la recette, 'Poulet coco réunionnais" par ex.
                   ajouter alors l'id. de la recette au set. */
                if (recipes[i].name.toLowerCase().includes(word)) {
                    set.add(recipes[i].id); 
                    // inutile de rechercher dans la description, la recette étant déjà ajoutée au set.
                    continue; 
                }
                /* recherche dans la description de la recette */
                if (recipes[i].description.toLowerCase().includes(word)) {
                    set.add(recipes[i].id);
                }

            }
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
    } 

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







