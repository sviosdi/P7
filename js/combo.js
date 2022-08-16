// eslint-disable-next-line no-unused-vars
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
        chevron.addEventListener('click', () => {
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
        //this.resize(300);
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

    // Vide le DOM correspont au menu du combo.
    clear() {
        this._menu.innerHTML = "";
    }

    /* content : Map dont les clés (ingrédients, appareils ou ustensiles) ont pour valeur associée le tableau
                 des seuls id. de recettes actuellement affichées. 
                 Cette méthode remplit le menu du combo et gère le 'click' sur chacun des éléments qui le remplissent.
    */
    fillContent(content) {
        this._menu.innerHTML = "";
        content.forEach((v, k) => {            
            let a = document.createElement('a');
            a.textContent = k;
            // eslint-disable-next-line no-undef
            if (currentTags[this._type].includes(k)) {
                a.classList.add('disabled');
            }
            a.addEventListener('click', (() => {
                // sélection d'un item du combo ('sucre' par exemple, ou 'four')
                // filtrage
                // eslint-disable-next-line no-undef
                currentSet = new Set(v);
                // eslint-disable-next-line no-undef
                currentTags[this._type].push(k); 
                // eslint-disable-next-line no-undef
                updateInterfaceWithSet(currentSet);  
                // ajout d'un tag k  
                let tags = document.getElementById("tags");
                let div = document.createElement('div');
                div.classList.add(`tag-${this._type.slice(0, 3)}`);                         
                let span = document.createElement('span');
                let i = document.createElement('i');
                i.setAttribute('class', 'fa-regular fa-circle-xmark');
                span.textContent = k;
                div.appendChild(span);
                div.appendChild(i);
                tags.appendChild(div);
                this._input.value = "";
                i.addEventListener('click', () => {
                    // suppression du tag k sélectionné
                    // eslint-disable-next-line no-undef
                    currentTags[this._type].splice(currentTags[this._type].indexOf(k), 1);
                    div.remove();
                    // Filtre le résultat de la recherche principale avec les tags restant.
                    // eslint-disable-next-line no-undef
                    currentSet = filterPrincipalSearch();
                    // eslint-disable-next-line no-undef
                    updateInterfaceWithSet(currentSet);
                });
            }).bind(this))
            this._menu.appendChild(a);
        });
    }

    // Méthode pour rechercher un item parmi les items du combo
    search() {
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

// filtre la recherche principale avec les tags restants après suppression d'un tag.
function filterPrincipalSearch() {
    let result = new Set();
    // eslint-disable-next-line no-undef
    for (let id of principalSearchSet)
        if (recipeRespectsAllTags(id)) result.add(id);
    return result;
}

// Retourne le boolean indiquant si la recette d'identifiant 'id' respecte le 'tag' tag de type 'type'
function recipeRespectsTag(id, tag, type) {
    // eslint-disable-next-line no-undef
    let recette = recipes[id - 1];
    switch (type) {
        case 'ingrédients':
            for (let el of recette.ingredients) {
                if (el.ingredient.toLowerCase() === tag) {
                    return true;
                }
            }
            return false;
        case 'appareils':
            return recette.appliance.toLowerCase() === tag;
        case 'ustensiles':
            for (let ust of recette.ustensils) {
                if (ust.toLowerCase() === tag) {
                    return true;
                }
            }
            return false;
    }
}

// Retourne le boolean indiquant si la recette d'identifiant 'id' respecte tous les tags de currentTags
function recipeRespectsAllTags(id) {
    // eslint-disable-next-line no-undef
    let ingTags = currentTags['ingrédients'];
    // eslint-disable-next-line no-undef
    let appTags = currentTags['appareils'];
    // eslint-disable-next-line no-undef
    let ustTags = currentTags['ustensiles'];

    for (let app of appTags) {
        if (!recipeRespectsTag(id, app, 'appareils')) {
            return false;
        }
    }

    for (let ing of ingTags) {
        if (!recipeRespectsTag(id, ing, 'ingrédients')) {
            return false;
        }
    }

    for (let ust of ustTags) {
        if (!recipeRespectsTag(id, ust, 'ustensiles')) {
            return false;
        }
    }
    return true;
}


