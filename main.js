const notesContainer = document.getElementById("app");
const addNoteBtn = notesContainer.querySelector(".add-note-btn");

getNotes().forEach(note => {
  const noteElement = createNoteElement(note.id, note.content);
  notesContainer.insertBefore(noteElement, addNoteBtn);
});

addNoteBtn.addEventListener("click", addNote);

function getNotes() {
  return JSON.parse(localStorage.getItem("stickynotes-app") || "[]");
}

function saveNote(notes) {
  localStorage.setItem("stickynotes-app", JSON.stringify(notes));
}

function createNoteElement(id, content) {
  const element = document.createElement("textarea");
  const delBtn = document.createElement("button");
  const dialogBox = document.createElement("div");
  
  delBtn.classList.add("delete-btn");
  delBtn.innerText = "Delete";
  
  dialogBox.classList.add("dialog-box");
  dialogBox.innerHTML = `
    <div class="dialog-info">
      <h3>Delete note?</h3>
      <div class="dialog-btn-container">
        <button class="dialog-btn-y">Yes</button>
        <button class="dialog-btn-n">No</button>
      </div>
    </div>
  `;
  
  element.classList.add("note");
  element.value = content;
  element.placeholder = "Take a note...";
  //element.innerHTML = `<button style="background:red;">Delete</button>`;
  //element.insertAdjacentHTML("beforeend", delBtn);
  
  element.addEventListener("blur", () => {
    updateNote(id, element.value);
  });
  
  element.addEventListener("dblclick", () => {
    notesContainer.appendChild(dialogBox);
    const y = dialogBox.querySelector(".dialog-btn-y").addEventListener("click", yes);  
    const n = dialogBox.querySelector(".dialog-btn-n").addEventListener("click", no);
  });
  
  function yes(event) {
    deleteNote(id, element);
    notesContainer.removeChild(dialogBox);
  }
  
  function no(event) {
    notesContainer.removeChild(dialogBox);
  }
  
  return element;
}

function addNote() {
  const notes = getNotes();
  const noteObject = {
    id: Math.floor(Math.random() * 100000),
    content: ""
  }
  
  const noteElement = createNoteElement(noteObject.id, noteObject.content);
  notesContainer.insertBefore(noteElement, addNoteBtn);
  
  notes.push(noteObject);
  saveNote(notes);
}

function updateNote(id, newContent) {
  console.log("Saving...");
  const notes = getNotes();
  const targetNote = notes.filter(note => note.id == id)[0];
  targetNote.content = newContent;
  saveNote(notes);
}

function deleteNote(id, element) {
  console.log("Deleting");
  const notes = getNotes().filter(note => note.id != id);
  saveNote(notes);
  notesContainer.removeChild(element);
}