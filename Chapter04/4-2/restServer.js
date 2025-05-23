const http = require("http");
const fs = require("fs").promises;

const users = {}; // 데이터 저장용
const posts = {};

// 댓글은 post 내부에 comments라는 배열로 저장

http
  .createServer(async (req, res) => {
    try {
      console.log(req.method, req.url);
      if (req.method === "GET") {
        if (req.url === "/") {
          const data = await fs.readFile("./restFront.html");
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          return res.end(data);
        } else if (req.url === "/about") {
          const data = await fs.readFile("./about.html");
          res.writeHead(200, { "Conent-Type": "text/html; charset=utf-8" });
          return res.end(data);
        } else if (req.url === "/postspage") {
          const data = await fs.readFile("./postspage.html");
          res.writeHead(200, { "Conent-Type": "text/html; charset=utf-8" });
          return res.end(data);
        } else if (req.url === "/users") {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          return res.end(JSON.stringify(users));
        } else if (req.url === "/posts") {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          return res.end(JSON.stringify(posts));
        } else if (req.url.startsWith("/postDetail/")) {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          if (req.url.split("/")[2] === "postDetail.js") {
            const data = await fs.readFile("./postDetail.js");
            return res.end(data);
          }
          const data = await fs.readFile("./postDetail.html");
          return res.end(data);
        } else if (req.url.startsWith("/getThePost/")) {
          const key = req.url.split("/")[2];
          const post = posts[key];
          res.writeHead(200, { "Conent-Type": "text/html; charset=utf-8" });
          console.log(post);
          return res.end(JSON.stringify(post));
        }
        // 주소가 /도 /about도 /users도 아니면
        try {
          const data = await fs.readFile(`.${req.url}`);
          return res.end(data);
        } catch (err) {
          // 주소에 해당하는 라우트를 못 찾았다는 404 Not Found error 발생
        }
      } else if (req.method === "POST") {
        if (req.url === "/user") {
          let body = "";
          // 요청의 body를 stream 형식으로 받음
          req.on("data", (data) => {
            body += data;
          });
          // 요청의 body를 다 받은 후 실행됨
          return req.on("end", () => {
            console.log("POST 본문(Body):", body);
            const { name } = JSON.parse(body);
            const id = Date.now();
            users[id] = name;
            res.writeHead(201);
            res.end("등록 성공");
          });
        } else if (req.url === "/post") {
          let body = "";
          req.on("data", (data) => {
            body += data;
          });
          return req.on("end", () => {
            console.log("POST post:", body);
            const post = JSON.parse(body);
            const id = Date.now();
            posts[id] = post;
            res.writeHead(201);
            res.end("posts post success!");
          });
        } else if (req.url.startsWith("/comment/")) {
          const key = req.url.split("/")[2];
          let body = "";
          req.on("data", (data) => {
            body += data;
          });
          return req.on("end", () => {
            console.log("POST comment(Body):", body);
            const comment = JSON.parse(body);
            if (posts[key].comments) {
              posts[key].comments.push(comment);
            } else {
              posts[key].comments = [comment];
            }
            res.writeHead(201);
            return res.end("comment success!");
          });
        }
      } else if (req.method === "PUT") {
        if (req.url.startsWith("/user/")) {
          const key = req.url.split("/")[2];
          let body = "";
          req.on("data", (data) => {
            body += data;
          });
          return req.on("end", () => {
            console.log("PUT 본문(Body):", body);
            users[key] = JSON.parse(body).name;
            return res.end(JSON.stringify(users));
          });
        } else if (req.url.startsWith("/post/")) {
          const key = req.url.split("/")[2];
          let body = "";
          req.on("data", (data) => {
            body += data;
          });
          return req.on("end", () => {
            console.log("PUT posts(Body):", body);
            posts[key].title = JSON.parse(body).title;
            posts[key].content = JSON.parse(body).content;
            return res.end(JSON.stringify(posts));
          });
        }
      } else if (req.method === "DELETE") {
        if (req.url.startsWith("/user/")) {
          const key = req.url.split("/")[2];
          delete users[key];
          return res.end(JSON.stringify(users));
        } else if (req.url.startsWith("/post/")) {
          const key = req.url.split("/")[2];
          delete posts[key];
          return res.end(JSON.stringify(posts));
        }
      }
      res.writeHead(404);
      return res.end("NOT FOUND");
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Conntent-type": "text/plain; charset=utf-8" });
      res.end(err.message);
    }
  })
  .listen(8082, () => {
    console.log("8082번 포트에서 서버 대기 중입니다");
  });
