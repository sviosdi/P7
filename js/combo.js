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


    /*
        Le set passé en paramètre ne contient que les ingrédients | appareils | ustensiles concernés par les
        recettes actuellement affichées.
    */
    fillContent(set) {
        this._menu.innerHTML = "";
        for (let key of set) {
            let a = document.createElement('a');
            a.textContent = key;
            a.addEventListener('click', (evt => {
                // fonction de filtrage ici
                console.time(key)
                currentSet = filterSetWithTag(currentSet, key, this._type);
                console.timeEnd(key);
                updateInterfaceWithSet(currentSet);
                
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
                this._input.value = "";
                i.addEventListener('click', evt => {
                    // suppression du tab sélectionné
                    currentTags[this._type].splice(currentTags[this._type].indexOf(key), 1);
                    div.remove();
                    console.time(key)
                    currentSet = filterSet(principalSearchSet);
                    console.timeEnd(key);
                    updateInterfaceWithSet(currentSet);
                });
            }).bind(this));
            this._menu.appendChild(a);
        };
    }

    search(evt) {
        let result = new Set();
        for (let tag of this.content) {
            if (tag.includes(this._input.value.toLowerCase())) {
                result.add(tag);
            }
            this.fillContent(result)
        }
        if (result.size > 0) this.open();
    }
}


// Filtre le set des id. de recettes passé en paramètre en lui appliquant les filtres de currentTags
// Retourne le set filtré sans avoir modifié le set initial.
function filterSet(set) {
    result = new Set();
    for (let id of set)
        if (recipeRespectsAllTags(id)) result.add(id);
    return result;
}


// set = le set d'id. de recettes à filtrer
// tag = le tag utilisé comme filtre
// si tag = 'sucre', filtre le set pour ne conserver que les id. de recettes dont un ingrédient est 'sucre'.
// Retourne le set filtré avec le tag 'tag' de type 'type' sans avoir modifié le set initial.
function filterSetWithTag(set, tag, type) {
    let result = new Set();
    for (let id of set)
        if (recipeRespectsTag(id, tag, type)) result.add(id);
    return result;
}

// Retourne le boolean indiquant si la recette d'identifiant 'id' respecte le 'tag' tag de type 'type'
function recipeRespectsTag(id, tag, type) {
    let recette = recipes[id - 1];
    switch (type) {
        case 'ingrédients':
            for (let el of recette.ingredients) {
                if (el.ingredient.toLowerCase() === tag) {
                    return true;
                };
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
    let ingTags = currentTags['ingrédients'];
    let appTags = currentTags['appareils'];
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

