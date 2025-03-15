const condition = true; // true면 resolve, false면 reject

console.log('시작');
const promise = new Promise((resolve, reject) => {
  if (condition) {
    resolve('성공');
    console.log('실행된다?');
  } else {
    reject('실패');
  }
});
console.log('끝');

// 다른 코드가 들어갈 수 있음
promise
  .then((message) => {
    console.log(message); // 성공(resolve)한 경우 실행
  })
  .catch((error) => {
    console.error(error); // 실패(reject)한 경우 실행
  })
  .finally(() => {
    console.log('무조건'); // 무조건 실행
  });