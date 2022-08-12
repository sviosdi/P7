class Card {
    constructor(data) {
        this.data = data;
        let a = document.createElement('a');
        let div1 = document.createElement('div');
        let article = document.createElement('article');
        a.setAttribute("href", "");
        a.classList.add("card");
        div1.classList.add('photo');
        article.classList.add('recette');
        a.appendChild(div1);
        a.appendChild(article);
        this.cardHtml = a;

        let head = document.createElement('div'); 
        let time =  document.createElement('div');
        let h2 = document.createElement('h2');
        h2.textContent = data.name;
        let clock = document.createElement('i');
        clock.setAttribute("class", "fa-regular fa-clock");
        let duree = document.createElement('span');
        duree.textContent = `${data.time} min`;
        head.appendChild(h2);
        time.appendChild(clock);
        time.appendChild(duree);
        head.appendChild(time);
        let details = document.createElement('div');
        details.classList.add('details');
        let ingdiv = document.createElement('div');
        ingdiv.classList.add('ingredients');
        let description = document.createElement('div');
        description.classList.add('desc');
        description.textContent = data.description;
        details.appendChild(ingdiv);
        details.appendChild(description);

        article.appendChild(head);
        article.appendChild(details);


        let ingredients = this.data.ingredients;
        ingredients.forEach(ing => {
            let line = document.createElement("p");            
            let quantity = document.createElement("span");          
            let unit = ing.unit ? adaptUnit(ing.unit) : "";
            let quantStr = (ing.quantity) ? `${ing.quantity}${unit}` : "";
            quantity.textContent = quantStr;
            let ponct = quantStr === "" ? '.' : ':';
            line.textContent = `${ing.ingredient}${ponct}`;
            line.appendChild(quantity);
            ingdiv.appendChild(line);
        });
    }

    get html() {
        return this.cardHtml;
    }
}

function adaptUnit(unit, quant) {
    if (unit === 'grammes')
        return 'g'
    else if (unit === 'cuillère à soupe' || unit === 'cuillères à soupe') {
        return " cuil. à s.";
    } else if (unit === 'cuillère à café' || unit === 'cuillères à café') {
        return " cuil. à c.";
    } else return unit;

}