function findWordInIng(word) {
    while (ingredients.forEach((v, k) => { 
       // console.log(k);
        if (k.includes(word.toLowerCase())) console.log(k);
    })); 

}

//findWordInIng("de");