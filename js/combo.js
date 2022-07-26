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
    }

    close() {
        this._html.classList.replace('opened', 'closed')
    }

    isOpen() {
        return this._html.classList.contains('opened');
    }

    fillContent(content) {
        /* content.forEach(ing => {
             let a = document.createElement('a');
             a.textContent = ing;
             this._menu.appendChild(a);
         });*/
        this._menu.innerHTML = "";
        while (content.forEach((v, k) => {
            let a = document.createElement('a');
            a.textContent = k;
            this._menu.appendChild(a);
        }));
    }

    search(evt) {
            let map = new Map();
            while (ingredients.forEach((v, k) => {
                if (k.includes(this._input.value.toLowerCase())) {
                    map.set(k, v);
                }
            }));
            this.fillContent(map);
            if (map.size > 0) this.open();
    }
}




let ingredients = loadIngredients();
let ustensiles = loadUstensiles();
let appareils = loadAppareils();

let cmbIngredients = new Combo('Ingredients');
cmbIngredients.resize(600);
//console.log(ingredients)
let orderedIng = new Map([...ingredients.entries()].sort());
cmbIngredients.fillContent(orderedIng);
let cmbAppareils = new Combo('Appareils');
cmbAppareils.fillContent(appareils);
let cmbUstensiles = new Combo("Ustensiles");
cmbUstensiles.fillContent(ustensiles);


