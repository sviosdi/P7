

class Combo {
    constructor(placeholder) {
        let combo = document.createElement('div');
        let style = placeholder.toLowerCase().substring(0, 3);
        combo.setAttribute('class', `combo closed ${style}`);
        let input = document.createElement('input');
        input.setAttribute('type', "text");
        input.setAttribute('placeholder', placeholder);
        let chevron = document.createElement('div');
        chevron.classList.add('chevron');
        chevron.addEventListener('click', evt => {
            if (combo.classList.contains('closed'))
                this.open();
            else this.close();

        });
        input.addEventListener('input', this.search.bind(this));
        let i = document.createElement('i');
        i.setAttribute('class', 'fa-solid fa-chevron-down');
        chevron.appendChild(i);
        let menu = document.createElement('div');
        menu.setAttribute('class', 'combo-menu');
        combo.appendChild(input);
        combo.appendChild(chevron);
        combo.appendChild(menu);
        document.getElementById('combos').appendChild(combo);
        this._html = combo;
        this._menu = menu;
        this._input = input;
        this._chevron = i;
        this._type = placeholder.toLowerCase();
        this.resize(300);
    }

    get html() {
        return this._html;
    }

    resize(width) {
        this._input.style.width = width + "px";
        this._menu.style.width = width + "px";
    }

    open() {
        this._html.classList.replace('closed', 'opened');
        this._chevron.classList.replace('fa-chevron-down', 'fa-chevron-up');
    }

    close() {
        this._html.classList.replace('opened', 'closed');
        this._chevron.classList.replace('fa-chevron-up', 'fa-chevron-down');
    }

    isOpen() {
        return this._html.classList.contains('opened');
    }

    clear() {
        this._menu.innerHTML = "";
    }

    /* content : Map dont les clés (ingrédients, appareils ou ustensiles) ont pour valeur associée le tableau
                 des seuls id. de recettes actuellement affichées. 
                 Cette fonction remplit le menu du combo et gère le 'click' sur chacun des éléments qui le remplissent.
    */
    /*
        maintenant : Content un set qui ne contient que les ingrédients | appareils | ustensiles concernés par les
        recettes actuellement affichées.
    */
    fillContent(set) {
        this._menu.innerHTML = "";
        for (let key of set) {
            let a = document.createElement('a');
            a.textContent = key;
            a.addEventListener('click', (evt => {
                // fonction de filtrage ici
                // updateInterfaceWithSet(new Set(v));                
                updateInterfaceWithSet(fiterSetWithTag(key, this._type));
                let tags = document.getElementById("tags");
                let div = document.createElement('div');
                div.classList.add(`tag-${this._type.slice(0, 3)}`);
                currentTags[this._type].push(key);
                let span = document.createElement('span');
                let i = document.createElement('i');
                i.setAttribute('class', 'fa-regular fa-circle-xmark');
                span.textContent = key;
                div.appendChild(span);
                div.appendChild(i);
                tags.appendChild(div);
                i.addEventListener('click', evt => {
                    // suppression du tab sélectionné
                    currentTags[this._type].splice(currentTags[this._type].indexOf(key), 1);
                    div.remove();
                    currentSet = filterPrincipalSearch();
                    updateInterfaceWithSet(currentSet);
                });
            }).bind(this));
            this._menu.appendChild(a);
        };
    }

    search(evt) {
        let map = new Map();
        while (this.content.forEach((v, k) => {
            if (k.includes(this._input.value.toLowerCase())) {
                map.set(k, v);
            }
        }));
        this.fillContent(map);
        if (map.size > 0) this.open();
    }
}

function intersectMulti(arrays) {
    if (arrays.length === 0) return [];
    if (arrays.length === 1) return arrays[0];
    return arrays.reduce((prev, cur) => intersect2(prev, cur), arrays[0])

}

function intersect2(array1, array2) {
    if (array1 === array2) return array1;
    let inter = [];
    array1.forEach(v => {
        if (array2.includes(v)) inter.push(v);
    })
    return inter;
}

// Filtre les recettes affichées currentSet avec la valeur key passée en paramètre
// Retourne le Set des id. de recettes affichées contenant la clé key.
// si key = 'sucre', filtre currentSet pour retourner le set des id. de recettes dont un ingrédient est key.
function fiterSetWithTag(key, type) {
    let result = new Set();
    switch (type) {
        case 'ingrédients':
            for (let id of currentSet) {
                let recette = recipes[id - 1];
                for (let el of recette.ingredients) {
                    if (el.ingredient.toLowerCase() === key) result.add(id);
                }
            }
            break;
        case 'appareils':
            for (let id of currentSet) {
                let recette = recipes[id - 1];
                if (recette.appliance.toLowerCase() === key) result.add(id);
            }
            break;
        case 'ustensiles':
            for (let id of currentSet) {
                let recette = recipes[id - 1];
                for (let ust of recette.ustensils) {
                    if (ust.toLowerCase() === key) result.add(id);
                }
            }
            break;
        default:
            throw ("type de combo inconnu dans filterSetWith");
    }
    currentSet = result;
    return currentSet;
}

function recipeRespectsTag(id, tag, type) {
    let recette = recipes[id - 1];
    let found = false;
    switch (type) {
        case 'ingrédients':
            for (let el of recette.ingredients) {
                if (el.ingredient.toLowerCase() === tag) {
                    found = true;
                    break;
                };
            }
            return found;
        case 'appareils':
            return recette.appliance.toLowerCase() === tag;
        case 'ustensiles':
            for (let ust of recette.ustensils) {
                if (ust.toLowerCase() === tag) {
                    found = true;
                    break;
                }
            }
            return found;
    }

}

function recipeRespectsAllTags(id) {
    let respectsAll = true;
    let ingTags = currentTags['ingrédients'];
    let appTags = currentTags['appareils'];
    let ustTags = currentTags['ustensiles'];
  
    for (let app of appTags) {
        if (!recipeRespectsTag(id, app, 'appareils')) {
            respectsAll = false;
            break;
        }
    }

    for (let ing of ingTags) {
        if (!recipeRespectsTag(id, ing, 'ingrédients')) {
            respectsAll = false;
            break;
        }
    }

    for (let ust of ustTags) {
        if (!recipeRespectsTag(id, ust, 'ustensiles')) {
            respectsAll = false;
            break;
        }
    }
    return respectsAll;
}


function filterPrincipalSearch() {
    let result = new Set();
    for (let id of principalSearchSet)
        if (recipeRespectsAllTags(id))
            result.add(id);
    return result;
}

function filterSetWithAllTags() {
    // filtrer ici si il y a des tags
    let ingTags = currentTags['ingrédients'];
    let appTags = currentTags['appareils'];
    let ustTags = currentTags['ustensiles'];

    for (let app of appTags) {
        currentSet = fiterSetWithTag(app, 'appareils');
    }
    for (let ing of ingTags) {
        currentSet = fiterSetWithTag(ing, 'ingrédients');
    }
    for (let ust of ustTags) {
        currentSet = fiterSetWithTag(ust, 'ustensiles');
    }
}

function interWithTags() {
    // chaque élément du tableau sera le tableau des id. des recettes de la recherche
    // principale correspondant à un tag encore présent.
    let results = [];
    //console.log(principalSearchSet)
    let ing = loadIngredients(principalSearchSet);
    currentTags['ingrédients'].forEach(tag => {
        // console.log(`${tag} : ${ing.get(tag)}`)
        // si tag = "sucre" on ajoute à results [1,22,25,43 ...], les id. des recettes
        // de la recherche principale ayant 'sucre' pour ingrédient
        results.push(ing.get(tag));
    })
    let app = loadAppareils(principalSearchSet);
    currentTags['appareils'].forEach(tag => {
        results.push(app.get(tag));
    })
    let ust = loadUstensiles(principalSearchSet);
    currentTags['ustensiles'].forEach(tag => {
        results.push(ust.get(tag));
    })

    // les recettes à conserver sont celles de l'intersection entre tous les tableaux de results.
    // Cette intersection n'est vide que si plus aucun tag n'est présent, sinon elle ne pas pas être vide, 
    // car si un tag a été sélectionné, c'est qu'il y a nécessairement des recettes qui lui correspondent.
    let inter = new Set((intersectMulti(results)));
    if (inter.size === 0)
        inter = principalSearchSet;
    return inter;
}


