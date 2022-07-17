
let recipesSection = document.querySelector(".recipes");

for (i = 0; i < 20; i++) {
    recipesSection.appendChild(new Card(recipes[i]).html);
}


/*let r0 = recipes[0];
let card0 = new Card(r0);
recipesSection.appendChild(card0.html);*/


