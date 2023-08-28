// 修改內容
function rewrite() {
  let a_modify = event.target.closest("a.modify");
  let btn_save = event.target.closest("div").querySelector("button.save");
  let oldTitle = event.target.closest("div").querySelector(".card-old-title");
  let newTitle = event.target.closest("div").querySelector(".card-new-title");
  // let text = event.target.closest("div").querySelector(".card-text");
  // let newText = event.target.closest("div").querySelector(".card-newText");

  a_modify.style.display = "none";
  btn_save.style.display = "";
  oldTitle.style.display = "none";
  newTitle.style.display = "";
  // text.style.display = "none";
  // newText.style.display = "";

  newTitle.value = oldTitle.innerText;
  // newText.value = text.innerText;

  function save() {
    a_modify.style.display = "";
    btn_save.style.display = "none";
    oldTitle.style.display = "";
    newTitle.style.display = "none";
    // text.style.display = "";
    // newText.style.display = "none";

    newTitle.value = posts.title;
    // newText.value = posts.text;
  }
}
