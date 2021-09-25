
/**
 * Converts a sql formatted date as string to 
 * 2021-06-25T18:15:00.000Z to 2021-06-25
 */
let sqlDateStrToReadDate = d => d.toString().slice(0, 10);

// month is 1 based e.g 1-janaury
let getDaysInMonth = (y, m) => new Date(y, m, 0).getDate();

let getRandomInt = (min, max) => Math.floor(Math.random() * (max-min) + min); 

let generateRandomData = (n, min, max) => Array.from({length: n}, (_, i) => getRandomInt(min, max));

let getRandomColor = () => `rgba(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${Math.random().toFixed(2)})`;

let generateRandomColors = (n) => Array.from({length: n}, (_, i) => getRandomColor());
