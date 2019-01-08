// cat.test();

// najprostsza klasa, test zwraca test-cat


// this.a = "test-window"

// let Cat = function() {

//     this.a = 'test-cat';
//     this.test = () => { console.log( this.a ); }
// }

// let cat = new Cat();
// cat.test();

// najprostsza klasa, funkcja test na zewnącz, test1 zwraca test-cat, test2 zwraca test-zoo

// function Zoo ( arrowFunction ) {

//     this.a = "test-zoo"
//     this.oldOneFunction = function () { console.log( this.a ); }
//     this.arrowFunction =  () => { console.log( this.a ); }

//     this.arrowFunctionFromPar =  arrowFunction;

//     this.Cat = function(test) {

//         this.a = 'test-cat';
//         this.fromCatConstructor = test; 
//         this.arrowFromCat =  () => { console.log( this.a ); }
//     }
// } 

// let zoo = new Zoo(() => { console.log( this.a ); });

// let cat1 = new zoo.Cat(zoo.oldOneFunction);
// cat1.a = 'babe-cat';
// cat1.fromCatConstructor(); // test-cat! aktualny stan cat1.a jest barny pod uwagę!
// cat1.arrowFromCat();       // test-cat!

// let cat2 = new zoo.Cat(zoo.arrowFunction);
// cat2.a = 'super-cat';
// cat2.fromCatConstructor(); // test-zoo! dla arrow function akualny stan cat1.a nie jest brany pod uwagę!
// cat2.arrowFromCat();       // super-cat!


// let cat4 = new zoo.Cat(zoo.arrowFunctionFromPar);
// cat4.fromCatConstructor(); // this.a = undefined!

// function BookList (prefix) {  
   
//     this.prefix = prefix; 
//     this.prefix2 = 'd'  
 
//     this.makeGetBooksWithPrefix = function() { 
 
//         return () => {
//             /* zmienna "this" objektu klasy BookList lub*/
//             /* zmienna "this" metody getBooksWithPrefix */  
//             return ["book1", "book2", "book3"].map(book => `${this.prefix}${book}` );
//         } 
//     }
 
//     this.getBooksWithPrefix1 = (() => { 
 
//         return () => {   
//             /* atrybut "this.prefix" objektu klasy BookList, nieokreślony jeszcze w definicji klasy */
//             return ["book1", "book2", "book3"].map(book => `${this.prefix}${book}` );
//         } 
//     })();
 
//     this.getBooksWithPrefix2 = (() => { 
 
//         return () => { 
//             /* atrybut "this.prefix2" klasy BookList, określony w definicji klasy */     
//             return ["book1", "book2", "book3"].map(book => `${this.prefix2}${book}` ); 
//         } 
//     })();
 
//     this.getBooksWithPrefix3 = (function() {
 
//         /* funkcja tworzy nowy lokalny "this", war. this.prefix2 będzie undefined */
//         return () => {
//             /* zmienna "this" metody getBooksWithPrefix3 */
//             return ["book1", "book2", "book3"].map(book => `${this.prefix2}${book}` ); 
//         } 
//     })();
 
//     this.getBooksWithPrefix4 = (function() {
 
//         /* lokalne "this" zostaje zastąpione kontekstem objektu BookList dzięki bind(this)*/
//         return () => {
//             /* zmienna "this" metody getBooksWithPrefix3 */
//             return ["book1", "book2", "book3"].map(book => `${this.prefix2}${book}` ); 
//         } 
//     }).bind(this)();
//  }
 
//  let c = new BookList('*');
//  let d = new BookList('x');
 
//  /* użycie funkcji wygenerowanej lokalnie w miejscu wywołania: */
//  console.log( c.makeGetBooksWithPrefix()() );
//  console.log( d.makeGetBooksWithPrefix()() );
 
//  /* użycie funkcji wygenerowanych wcześniej w konstruktorze: */
//  console.log( d.getBooksWithPrefix1() );
//  console.log( d.getBooksWithPrefix2() );
//  console.log( d.getBooksWithPrefix3() );
//  console.log( d.getBooksWithPrefix4() );
 




function makeAdder( x ) {
    let a = 3;
    return ( y ) => {

        return (x + y) * a;
    };
}
  
  var add5 = makeAdder(5);
  var add10 = makeAdder(10);
  
  console.log(add5(2));  // 7
  console.log(add10(2)); // 12





 // wynik funkcji stworzonej lokalnie:
 //  [ '*book1', '*book2', '*book3' ]
 //  [ 'xbook1', 'xbook2', 'xbook3' ]
 
 // wynik funkcji stworzonych w konstruktorze:
 //  [ 'xbook1', 'xbook2', 'xbook3' ]
 //  [ 'dbook1', 'dbook2', 'dbook3' ]
 //  [ 'undefinedbook1', 'undefinedbook2', 'undefinedbook3' ]
 //  [ 'dbook1', 'dbook2', 'dbook3' ]

//"this" is real Zoo!

// this.a = 'test-window'

// function Zoo () {

//     this.a = "test-zoo"

//     this.test1 = function () { console.log( this.a ); }  // test-cat
//     this.test2 =  () => { console.log( this.a ); }       // test-zoo
//     this.test3 = function () { return function () { console.log( this.a ); }} //undefined/test-cat (preTest)
//     this.test4 = function () { return () => { console.log( this.a ); } } // test-cat/udefined (preTest)
//     this.test5 =  () => { return () => { console.log( this.a ); } } // test-zoo/test-zoo (preTest)

//     this.Cat = function(testFunction) {

//         this.a = 'test-cat';
//         this.test = testFunction;
//         this.preTest = testFunction();
//     }
// }
// let zoo = new Zoo();

// console.log('cat1')
// let cat1 = new zoo.Cat(zoo.test1);
// cat1.test(); // test-cat (direct call, non arrow)
// console.log('cat2')
// let cat2 = new zoo.Cat(zoo.test2);
// cat2.test(); // test-zoo (direct call, arrow) 

// console.log('cat3')
// let cat3 = new zoo.Cat(zoo.test3);
// cat3.test()(); // undefined  (non arrow create, non arrow call)
// cat3.preTest(); // test-cat  (non arrow create, non arrow call)

// console.log('cat4')
// let cat4 = new zoo.Cat(zoo.test4);
// cat4.test()(); // test-cat    (non arrow create, arrow call)
// cat4.preTest(); // undefined  (non arrow create, arrow call)

// console.log('cat5')
// let cat5 = new zoo.Cat(zoo.test5);
// cat5.test()(); // test-zoo  (arrow create, arrow call)
// cat5.preTest(); // test-zoo  (arrow create, arrow call)
