const exec = require("child_process").exec;

// const process = exec("dir");
const process = exec("cmd /c chcp 65001>nul && dir");

process.stdout.on("data", function (data) {
  console.log(data.toString());
}); // 실행 결과

process.stderr.on("data", function (data) {
  console.error(data.toString());
}); // 실행 에러
