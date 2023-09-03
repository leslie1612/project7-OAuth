// 修改內容
function rewrite() {
  let a_modify = event.target.closest("a.modify");
  let btn_save = event.target.closest("div").querySelector("button.save");
  let oldTitle = event.target.closest("div").querySelector(".card-old-title");
  let newTitle = event.target.closest("div").querySelector(".card-new-title");
  let oldText = event.target.closest("div").querySelector(".card-old-text");
  let newText = event.target.closest("div").querySelector(".card-new-text");

  a_modify.style.display = "none";
  btn_save.style.display = "";
  oldTitle.style.display = "none";
  newTitle.style.display = "";
  oldText.style.display = "none";
  newText.style.display = "";

  newTitle.value = oldTitle.innerText;
  newText.value = oldText.innerText;
}

function save() {
  a_modify.style.display = "";
  btn_save.style.display = "none";
  oldTitle.style.display = "";
  newTitle.style.display = "none";
  oldText.style.display = "";
  newText.style.display = "none";

  newTitle.value = posts.title;
  newText.value = posts.content;
}

async function deletePost(id) {
  try {
    let card = event.target.closest("div.card");
    card.remove();
    let fetchPromise = await fetch(
      `http://localhost:8080/profile/delete/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (e) {
    console.log(e);
  }
}
