

const ojj_car = {
    name: "jeep",
    color: "red",
    engine: 500,
    start: function () {
        console.log("am moving....");
    },
};

class Car {
    constructor(name, color, engine) {
        this.name = name;
        this.color = color;
        this.engine = engine;
        
    }

    start(){
        console.log("my "  + this.color  + " "  + this.name + " is starting..." );
    }
}

let car1 = new Car("jeep", "red", 500);
let car2 = new Car("lexus", "blue", 600);



console.log(car1.start());
console.log(car2.start());
console.log(ojj_car);
 

let arr = ["BMW", "LAMBO","GWAGON"];
console.log(arr[1]);
console.log(`my arr has a length of ${arr.length}`);
   for (let i = 0; i < arr.length; i++) {
    console.log (`${arr[i]} is the index ${i}`)
   }; 

   
   arr.pop();
   console.log(`${arr} after pop()`);
arr.splice(1,1);
console.log(`${arr} after splice(1,1)`);

let length = arr.unshift("MERCEDES");
console.log(`${arr} after unshift ("MERCEDES), NEWLENGHT IS ${length}`);
let newlength = arr.push("audi");
console.log(`${arr} after push ("audi), NEWLENGHT IS ${newlength}`);
let sorted = arr.sort();
console.log(`${sorted} after sort()`);
let reversed = arr.reverse();
console.log(`${reversed} after reversed()`);

let index_Of_audi= arr.indexOf("audi");
console.log(`audi is locate at index ${index_Of_audi}`); 