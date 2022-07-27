

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

    fillContent(content) {
        this._menu.innerHTML = "";
        while (content.forEach((v, k) => {
            let a = document.createElement('a');
            a.textContent = k;
            a.addEventListener('click', (evt => {
                let inter = new Set();
                for (let e of currentSet) {
                    if (v.includes(e))
                        inter.add(e);
                }
                updateInterfaceWithSet(inter);
                let tags = document.getElementById("tags");
                let div = document.createElement('div');
                switch (this._type) {
                    case 'ingrédients':
                        div.classList.add('tag-ing');
                        break;
                    case 'appareils':
                        div.classList.add('tag-app');
                        break;
                    case 'ustensiles':
                        div.classList.add('tag-ust');
                        break;

                }
                let span = document.createElement('span');
                let i = document.createElement('i');
                i.setAttribute('class', 'fa-regular fa-circle-xmark');
                span.textContent = k;
                div.appendChild(span);
                div.appendChild(i);
                tags.appendChild(div);
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




