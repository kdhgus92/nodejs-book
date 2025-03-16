async function getThePost(key) {
  try {
    const res = await axios.get(`/getThePost/${key}`);
    const { title, content } = res.data;

    titleDiv = document.getElementById("title");
    contentDiv = document.getElementById("content");

    titleDiv.textContent = title;
    contentDiv.textContent = content;

    const comments = res.data.comments;
    const commentList = document.getElementById("comment-list");
    commentList.innerHTML = "";
    console.log(comments);

    comments?.map((comment) => {
      const commentDiv = document.createElement("div");
      const username = document.createElement("b");
      username.textContent = comment.username;
      const commentContent = document.createElement("span");
      commentContent.textContent = comment.comment;
      commentDiv.appendChild(username);
      commentDiv.appendChild(commentContent);
      commentList.appendChild(commentDiv);
    });
  } catch (err) {
    console.error(err);
  }
}

const key = window.location.pathname.split("/")[2];
console.log(key);
window.onload = () => getThePost(key); // 화면 로딩 시 getUser 호출

// 폼 제출(submit) 시 실행
document
  .getElementById("comment-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const comment = e.target.comment.value;

    if (!username) {
      return alert("이름을 입력하세요");
    }
    if (!comment) {
      return alert("comment를 입력하세요");
    }

    try {
      await axios.post(`/comment/${key}`, { username, comment });
      getThePost(key);
    } catch (err) {
      console.error(err);
    }
  });
