(function () {
  function addDeleteButtons() {
    document.querySelectorAll(".note-card").forEach(function (card) {
      if (card.querySelector(".card-delete") || card.closest("#editorPanel")) return;
      var button = document.createElement("button");
      button.className = "card-delete quiet";
      button.type = "button";
      button.textContent = "Delete";
      button.title = "Move note to Trash";
      button.dataset.deleteNote = card.dataset.note;
      card.querySelector(".note-meta").appendChild(button);
    });
  }

  document.addEventListener("click", async function (event) {
    var button = event.target.closest("[data-delete-note]");
    if (!button) return;
    event.stopPropagation();
    if (!confirm("Move this note to Trash?")) return;
    var note = await DB.get("notes", button.dataset.deleteNote);
    if (!note) return;
    await DB.put("trash", note);
    await DB.delete("notes", note.id);
    button.closest(".note-card").remove();
    var count = document.getElementById("allCount");
    if (count) count.textContent = Math.max(0, Number(count.textContent) - 1);
    var trashCount = document.getElementById("trashCount");
    if (trashCount) trashCount.textContent = Number(trashCount.textContent) + 1;
    var toast = document.getElementById("toast");
    toast.textContent = "Note moved to Trash";
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 2200);
  });

  new MutationObserver(addDeleteButtons).observe(document.getElementById("contentView"), { childList: true, subtree: true });
  addDeleteButtons();
})();
