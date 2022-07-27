let cmbIngredients = new Combo('Ingrédients');
let cmbAppareils = new Combo('Appareils');
let cmbUstensiles = new Combo("Ustensiles");

let ingredients = loadIngredients();
let ustensiles = loadUstensiles();
let appareils = loadAppareils();

cmbIngredients.resize(600);
//let orderedIng = new Map([...ingredients.entries()].sort());

let currentSet = new Set(); // le set des recettes correspondant à la recherche en cours
recipes.forEach(recette => currentSet.add(recette.id));

updateInterfaceWithSet(currentSet);

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
                let recipesTab = ustensiles.get(u)
                if (!recipesTab) {
                    recipesTab = [];
                    ustensiles.set(u, recipesTab)
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
            let recipesTab = appareils.get(recette.appliance)
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
            while (ingredients.forEach((v, k) => {
                if (k.includes(word)) {
                    v.forEach(i => set.add(i));
                }
            }));

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

        updateInterfaceWithSet(inter);
    }

    if (words.length === 0) {
        let recipesSection = document.querySelector(".recipes");
        recipes.forEach(recette => recipesSection.appendChild(new Card(recette).html));
        cmbIngredients.fillContent(ingredients);
        cmbAppareils.fillContent(appareils);
        cmbUstensiles.fillContent(ustensiles);
    }

}

function displaySet(set) {
    currentSet = set;
    let recipesSection = document.querySelector(".recipes");
    recipesSection.innerHTML = "";
    recipes.forEach(recette => {
        if (set.has(recette.id))
            recipesSection.appendChild(new Card(recette).html)
    });
}

function updateInterfaceWithSet(set) {
    displaySet(set);
    cmbIngredients.content = loadIngredients(set);
    cmbIngredients.fillContent(cmbIngredients.content);

    cmbAppareils.content = loadAppareils(set);
    cmbAppareils.fillContent(cmbAppareils.content);

    cmbUstensiles.content = loadUstensiles(set);
    cmbUstensiles.fillContent(cmbUstensiles.content);
}







