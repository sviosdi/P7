

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
    fillContent(content) {
        this._menu.innerHTML = "";
        while (content.forEach((v, k) => {
            let a = document.createElement('a');
            a.textContent = k;
            a.addEventListener('click', (evt => {
                updateInterfaceWithSet(new Set(v));
                let tags = document.getElementById("tags");
                let div = document.createElement('div');
                div.classList.add(`tag-${this._type.slice(0, 3)}`);
                currentTags[this._type].push(k);
                let span = document.createElement('span');
                let i = document.createElement('i');
                i.setAttribute('class', 'fa-regular fa-circle-xmark');
                span.textContent = k;
                div.appendChild(span);
                div.appendChild(i);
                tags.appendChild(div);
                i.addEventListener('click', evt => {
                    currentTags[this._type].splice(currentTags[this._type].indexOf(k), 1);
                    div.remove();
                    //console.log(globalSearchSet)
                    //console.log(currentTags)
                    // console.log(loadIngredients(globalSearchSet).get(currentTags['ingrédients'][0]))
                    // exemple : on supprime le tag k = 'tomate' => v = [2, 4 ,5, 16, 24, 26]

                    //updateInterfaceWithSet(currentSet);
                    let results = [];

                    let ing = loadIngredients(principalSearchSet);
                    currentTags['ingrédients'].forEach(tag => {
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

                    updateInterfaceWithSet(new Set((intersectMulti(results))));
                });
            }).bind(this))
            this._menu.appendChild(a);
        }));
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




