async function getPosts() {
  // 로딩 시 사용자 정보를 가져오는 함수
  try {
    const res = await axios.get("/posts");
    console.log(res);
    const posts = res.data;
    const list = document.getElementById("list");
    list.innerHTML = "";
    // 사용자마다 반복적으로 화면 표시 및 이벤트 연결
    Object.keys(posts).map(function (key) {
      const postDiv = document.createElement("div");
      const span = document.createElement("span");
      span.textContent = posts[key].title;
      const edit = document.createElement("button");
      edit.textContent = "수정";
      edit.addEventListener("click", async () => {
        // 수정 버튼 클릭
        const title = prompt("바꿀 title을 입력하세요");
        const content = prompt("plz input content:");
        if (!title) {
          return alert("title을 반드시 입력하셔야 합니다");
        }
        if (!content) {
          return alert("you have to input content");
        }
        try {
          await axios.put("/post/" + key, { title, content });
          console.log("ggggg");
          getPosts();
        } catch (err) {
          console.error(err);
        }
      });
      const remove = document.createElement("button");
      remove.textContent = "삭제";
      remove.addEventListener("click", async () => {
        // 삭제 버튼 클릭
        try {
          await axios.delete("/post/" + key);
          getUser();
        } catch (err) {
          console.error(err);
        }
      });
      postDiv.appendChild(span);
      postDiv.appendChild(edit);
      postDiv.appendChild(remove);
      list.appendChild(postDiv);
      console.log(res.data);
    });
  } catch (err) {
    console.error(err);
  }
}

window.onload = getPosts; // 화면 로딩 시 getUser 호출
// 폼 제출(submit) 시 실행
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const content = e.target.content.value;
  if (!title) {
    return alert("title을 입력하세요");
  }
  try {
    await axios.post("/post", { title, content });
    getPosts();
  } catch (err) {
    console.error(err);
  }
  e.target.title.value = "";
  e.target.content.value = "";
});
