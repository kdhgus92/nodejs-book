const fs = require('fs').promises;

// console.log('시작');
// fs.readFile('./readme2.txt')
//   .then((data) => {
//     console.log('1번', data.toString());
//     return fs.readFile('./readme2.txt');
//   })
//   .then((data) => {
//     console.log('2번', data.toString());
//     return fs.readFile('./readme2.txt');
//   })
//   .then((data) => {
//     console.log('3번', data.toString());
//     console.log('끝');
//   })
//   .catch((err) => {
//     console.error(err);
//   });

async function main() {
  console.log('시작');
  let data = await fs.readFile('./readme2.txt');
  console.log('1번', data.toString());
  data = await fs.readFile('./readme2.txt');
  console.log('2번', data.toString());
  data = await fs.readFile('./readme2.txt');
  console.log('3번', data.toString());
  console.log('끝');
}
main();