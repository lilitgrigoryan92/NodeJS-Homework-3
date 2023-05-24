//TASK 1

// const fs = require("fs");
// const { nextTick } = require("process");

// fs.readFile(__filename, () => {
//   console.log("1");
//   setImmediate(() => console.log("2"));
//   process.nextTick(() => console.log("3"));
//   Promise.resolve().then(() => console.log("4"));
// });

// process.nextTick(() => console.log("5"));
// Promise.resolve().then(() => console.log("6"));
// setTimeout(() => console.log("7"));
// for (let i = 0; i < 2000000000; i++) {}

//5,6,7,1,3,4,2

// Քանի որ միկրոթասկում ունենք 2 ենթաթասկեր,
// որոնցից բարձր պրիորիտետ ունի nextTick-ը հետևաբար առաջինը կտպի nextTick-ի callback-ի արժեքը՝5,
// որից հետո միկրոթասկի մյուս ենթաթասկում գտնվող promise ենթաթասկի արժեքը՝6:
// Միկրոթասկերը արդեն դատարկ են կանցնի մակրոթասկերին;Ունենք for lookup,որի շնորհիվ 
// ժամանակ կշահենք,մինչ այն կատարվի ու այդ ընթացքում մեր setTimeout ֆունկցիան կհայտնվի 
// timer phase-ում,հետևաբար կտպվի 7,որից հետո կանցնի I/O pathToFileURL,որտեղ առաջինը կտպի 1,
// հետո կբաշխի setImmediate կգնա check phase,nextTick ու promise միկրոթասկերի իրենց համապատասխան
//  ֆազաներ,ու կտեսնի միկրոթասկում քոլբեք է ավելացել ,կթողնի կգնա առաջինը կտպի nextTick-ի արժեքը 3,
//  հետո promis phase-ի արժեքը 4,նոր կվերադառնա շարունակելու ու կմտնի check phase տպելով 
//  setImmediate-ի արժեքը 2  

//TASK 2

// const fs = require("fs");
// const { nextTick } = require("process");

// setTimeout(() => {
//   console.log(1);
// });

// setTimeout(() => {
//   console.log(2);

//   process.nextTick(() => {
//     console.log(3);
//   });

//   setImmediate(() => {
//     console.log(4);
//   });
// });

// setTimeout(() => {
//   console.log(5);
// });

// setTimeout(() => {
//   console.log(6);
//   Promise.resolve(7).then((res) => {
//     console.log(res);
//   });
// });

// setTimeout(() => {
//   console.log(8);
//   fs.readFile(__filename, () => {
//     console.log(9);
//   });
// });
 
//1,2,3,5,6,7,8,4,9

// Առաջինը կտպի setTimeout-ները ըստ հերթականության,ինչպես define ենք արել,
// քանի որ ժամանակ չենք տվել,1,2,բայց քանի որ երկրորդ setTimeout-ի մեջ ունենք nextTick ու setImmediate,
// 2-ը տպելուց հետո կգնա այդ nextTick-ի արժեքը կտպի 3 ,նոր կշարունակի աշխատանքը,
// կանցնի հաջորդ setTimeout կտպի 5,հետո մյուս setTimeout կտպի 6,ու կտեսնի նեսթիդ promise,
// որը կավելանա promise phase-ին,ու կիսատ կթողնի իր գործողությունը կգնա այդ promise phase-ի 
// արժեքը 7 կտպի,նոր հետ կգա timer phase-ին ու կտպի 8,
// հետո քանի որ setImmediate անմիջապես ավելանում է check phase-ին կտպի 4,
// նոր վերջում  կտեսնի poll phase-ի մեջ  9,որը կախված կոդից կարող է
//  նաև շուտ ավելանար և առաջինը տպեր poll phase-ի արժեքը ,նոր check phase-ի:

//TASK 3

// const fs = require("fs");
// const { nextTick } = require("process");

// console.log(1);
// setTimeout(() => console.log("2"));

// setImmediate(() => console.log("3"));

// process.nextTick(() => console.log("4"));

// fs.readFile(__filename, () => {
//   console.log(2);
//   setTimeout(() => console.log("5"));
//   setImmediate(() => console.log("6"));
//   process.nextTick(() => console.log("7"));
// });

// setTimeout(() => console.log("8"));

// setImmediate(() => {
//   console.log("9");
//   process.nextTick(() => console.log("11"));
// });

// setImmediate(() => {
//   console.log("12");
// });

// process.nextTick(() => console.log("10"));

//1,4,10,2,8,3,9,11,12,2,7,6,5

// Առաջին կտպի սինխրոն գործողությունը console.log ու կտպի 1,հետո կանցնի nextTick-ին ,
// որի մեջ կա երկու հատ արժեք ,կտպի 4,10,հետո promise phase-ը դատարկ է կանցնի timer phase-ին,
// որի մեջ կա 2,8 կտպի,քանի որ file երկար է բեռնվում ,իսկ setImmediate անմիջապես,ապա կանցնի check phase-ին,
// որի մեջ կա setImmediate իր արժեքով ու կտպի 3,հետո 9 ,ու կտեսնի setImmediate-ի մեջ նեսթիդ nextTick,
// այն կտանի համապատասխան phase ու ինքն էլ կգնա այդ phase կտպի 11,հետ կգա check phase կտպի հաջորդ
// արժեքը՝12,որից հետո նոր կմտնի poll phase ու կտպի 2,նեսթիդ setTimeout -ը կավելացնի timer phase-ին,
// բայց հետ չի գնա տպելու,այլ կթողնի հաջորդ իտերացիային,նեսթիդ setImmediate ու nextTick callback-երը
// ևս կավելացնի համապատասխան ֆազաներ,ու քանի որ nextTick ունի առաջնահերթություն կգնա նրա արժեքը տպելու
// 7,այնուհետև հետ կգա ու կանցնի առաջ ,կմտնի check phase կտպի 6,մյուս իտերացիային էլ կունենանք միայն
// timer phase-ի մեջ ավելացած setTimeout ,կտպի 5
  


//TASK 4

//const fs = require("fs");
// fs.readFile(__filename, () => {
//   console.log(0);
// });

// setImmediate(() => {
//   console.log(1);
// });
// setImmediate(() => {
//   console.log(2);
// });
// setImmediate(() => {
//   console.log(3);
// });
// setImmediate(() => {
//   console.log(4);
//   Promise.resolve(5).then((res) => {
//     console.log(res);
//   });
// });

// setImmediate(() => {
//   console.log(6);
// });
// setImmediate(() => {
//   console.log(7);
// });
// setImmediate(() => {
//   console.log(8);
// });

// setTimeout(() => {
//   console.log(9);
// }, 1000);

//1,2,3,4,5,6,7,8,0,9

// Քանի որ setTimeout-ին տրվել է 1000 մվ,հետևաբար սկզբից դեռ չի հայտնվի timer phase-ում,
// file-ը ևս դանդաղ է բեռնվում,այսինքն կսկսի աշխատանքը check phase-ից,քանի որ setImmediate-ի
// callback-ը անմիջապես հայտնվում է check phase-ում,առաջինը կտպի 1,2,3,4 հետո կտեսնի նեսթիդ 
// promise,այն կտանի promise phase ,կգնա այդ promis-ի callback-ի վերադարձրած արժեքը կտպի 5,
// հետո հետ կգա check phase ու կշարունակի տպելով՝ 6,7,8,ու դուրս կգա,հաջորդ իտերացիային կգնա 
// timer phase,եթե այնտեղ հայտնված կլինի setTimeout-ի callback-ը դա կտպի ,եթե ոչ կգնա
//  poll phase կտպի 0,հետո հաջորդ իտերացիային արդեն timer-ում կլինի setTimeout-ի callback-ը,
//  կգնա կտպի 9: