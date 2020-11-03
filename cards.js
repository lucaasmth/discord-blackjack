module.exports = class Cards{
    cards;
    constructor(){
        this.cards = ["♠️A","♣️A","♥️A","♦️A",
                      "♠️2","♣️2","♥️2","♦️2",
                      "♠️3","♣️3","♥️3","♦️3",
                      "♠️4","♣️4","♥️4","♦️4",
                      "♠️5","♣️5","♥️5","♦️5",
                      "♠️6","♣️6","♥️6","♦️6",
                      "♠️7","♣️7","♥️7","♦️7",
                      "♠️8","♣️8","♥️8","♦️8",
                      "♠️9","♣️9","♥️9","♦️9",
                      "♠️10","♣️10","♥️10","♦️10",
                      "♠️J","♣️J","♥️J","♦️J",
                      "♠️Q","♣️Q","♥️Q","♦️Q",
                      "♠️K","♣️K","♥️K","♦️K"]
    }
    drawCard(){
        return this.cards.splice(this.cards.indexOf(this.cards[Math.floor(Math.random() * this.cards.length)]), 1).toString();
    }
    static sumCards(cards){
        let cardsWithoutSymbols = [];
        for(let i = 0; i < cards.length; i++){
            cardsWithoutSymbols.push(cards[i].substr(2))
        }
        let hasAce;
        if(cards.includes('A')){
            hasAce = true;
        }

        let sum = 0
        for(let i = 0; i < cardsWithoutSymbols.length; i++){
            sum += Cards.getValue(cardsWithoutSymbols[i])
        }

        if(hasAce){
            if(sum+11 <=21){
                sum += 11
            }
            else{
                sum += 1
            }
        }
        return sum;

    }

    static getValue(card){
        if(["2","3","4","5","6","7","8","9","10"].includes(card.toString())){
            console.log("nb")
            return Number(card);
        }
        if(['J','Q','K'].includes(card)){
            console.log("figure")
            return 10;
        }
        if(card == 'A'){
            console.log("as")
            return 0;
        }
    }


}