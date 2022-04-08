const addButton = document.getElementById("add-button");
const search = document.getElementById("search");
const bookContainer = document.getElementById("book-container");
const container = document.getElementById("container");
const searchButton = document.getElementById("search-button");
const searchCancel = document.getElementById("search-cancel");
const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list-body");
const showAllButton = document.getElementById("show-all");
const showCompletedButton = document.getElementById("show-completed");
const showNotCompletedButton = document.getElementById("show-not-completed");
let selectedTab = "show-all";

window.addEventListener("load", function () {
  if (typeof Storage !== "undefined") {
    hideForm();
    showList();
  } else {
    alert("Browser ini tidak mendukung file storage");
  }

  let books = getBook();
  renderList(books);
});

function renderList(bookData) {
  let books = "";

  bookData?.forEach((book) => {
    books += `
      <div class="flex justify-between items-center bg-white rounded-xl p-3 border-l-4 ${
        book.isCompleted ? "border-green-400" : "border-yellow-400"
      }">
        <div>
          <h2 class="text-2xl text-slate-500 font-semibold">${book.title}</h2>
          <div class="flex text-slate-400 text-sm space-x-2">
          <h3 class="">${book.author}</h3>
          <span>|</span>
          <h3 class="">${book.year}</h3>
          </div>
        </div>
        <div class="flex space-x-2">
          <button onclick="moveBook(${book.id})" title="Pindahkan ke rak ${
      book.isCompleted ? "sedang dibaca" : "sudah dibaca"
    } " class="flex items-center justify-center ${
      book.isCompleted ? "bg-yellow-100" : "bg-green-100"
    } p-1 aspect-square rounded-full">
            <i class="${
              book.isCompleted
                ? "ph-arrow-clockwise-fill text-yellow-400"
                : "ph-check-circle-fill text-green-400"
            } text-2xl"></i>
          </button>
          <button onclick="deleteBook(${
            book.id
          })" title="Hapus Buku" class="flex items-center justify-center bg-red-100 p-1 aspect-square rounded-full">
            <i class="ph-trash-fill text-red-400 text-2xl"></i>
          </button>
        </div>
      </div>
    `;
  });

  bookList.innerHTML = books;
}

function getBook(status = "all") {
  let bookData = [];
  if (localStorage.getItem("books") === null) {
    localStorage.setItem("books", JSON.stringify([]));
  } else {
    bookData = JSON.parse(localStorage.getItem("books"));

    switch (status) {
      case "completed":
        bookData = bookData.filter((book) => book.isCompleted);
        break;
      case "not_completed":
        bookData = bookData.filter((book) => !book.isCompleted);
        break;
    }
  }

  return bookData;
}

function addBook() {
  hideList();
  bookForm.reset();
  showForm();
}

function insertBook(data) {
  let savedData = getBook();
  savedData.push(data);
  localStorage.setItem("books", JSON.stringify(savedData));
}

function deleteBook(id) {
  Swal.fire({
    title: "Yakin menghapus?",
    text: "Data yang terhapus tidak dapat dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      let books = getBook();

      books = books.filter((book) => {
        return book.id !== id;
      });

      localStorage.setItem("books", JSON.stringify(books));

      let bookData = getBook(selectedTab);
      renderList(bookData);
      Swal.fire("Terhapus!", "Buku telah dihapus.", "success");
    }
  });
}

function moveBook(id) {
  Swal.fire({
    title: "Yakin memindahkan?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      let books = getBook();

      index = books.findIndex((book) => book.id == id);

      books.forEach((book) => {
        if (book.id == id) {
          book.isCompleted = !book.isCompleted;
        }
      });

      localStorage.setItem("books", JSON.stringify(books));
      Swal.fire("Berhasil!", "Buku telah dipindahkan!.", "success");
      let bookData = getBook(selectedTab);
      renderList(bookData);
    }
  });
}

function searchBook(keyword) {
  let books = getBook(selectedTab);
  books = books.filter((book) => book.title.toLowerCase().includes(keyword));

  if (books.length == 0) {
    Swal.fire("Oops!", "Buku tidak ditemukan di rak ini!.", "error");
  } else {
    renderList(books);
    searchButton.style.display = "none";
    searchCancel.style.display = "block";
  }
}

function hideList() {
  document.getElementById("book-container").style.display = "none";
  document.getElementById("search").style.display = "none";
}

function showList(status) {
  let bookData = getBook(status);
  renderList(bookData);
  showAllButton.dispatchEvent(new Event("click"));
  document.getElementById("book-container").style.display = "block";
  document.getElementById("search").style.display = "flex";
}

function showForm() {
  document.getElementById("form-container").style.display = "block";
}

function hideForm() {
  document.getElementById("form-container").style.display = "none";
}

addButton.addEventListener("click", addBook);
document
  .getElementById("close-form-button")
  .addEventListener("click", function () {
    hideForm();
    showList();
  });

bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const id = +new Date();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isCompleted = document.getElementById("iscompleted").checked;

  const data = {
    id,
    title,
    author,
    year,
    isCompleted,
  };

  insertBook(data);
  hideForm();
  showList();
});

searchButton.addEventListener("click", function () {
  let keyword = document.getElementById("search-input").value;
  searchBook(keyword);
});

searchCancel.addEventListener("click", function () {
  searchBook("");
  searchCancel.style.display = "none";
  searchButton.style.display = "block";
});

showAllButton.addEventListener("click", function () {
  selectedTab = "show-all";

  let bookData = getBook(selectedTab);
  renderList(bookData);

  showAllButton.classList.add("border-b-2", "border-sky-500");
  document.getElementById("show-all-capt").classList.remove("text-slate-400");
  document.getElementById("show-all-capt").classList.add("text-slate-700");

  showNotCompletedButton.classList.remove("border-b-2", "border-sky-500");
  document
    .getElementById("show-not-completed-capt")
    .classList.remove("text-slate-700");
  document
    .getElementById("show-not-completed-capt")
    .classList.add("text-slate-400");

  showCompletedButton.classList.remove("border-b-2", "border-sky-500");
  document
    .getElementById("show-completed-capt")
    .classList.remove("text-slate-700");
  document
    .getElementById("show-completed-capt")
    .classList.add("text-slate-400");
});

showNotCompletedButton.addEventListener("click", function () {
  selectedTab = "not_completed";

  let bookData = getBook(selectedTab);
  renderList(bookData);

  showAllButton.classList.remove("border-b-2", "border-sky-500");
  document.getElementById("show-all-capt").classList.remove("text-slate-700");
  document.getElementById("show-all-capt").classList.add("text-slate-400");

  showNotCompletedButton.classList.add("border-b-2", "border-sky-500");
  document
    .getElementById("show-not-completed-capt")
    .classList.remove("text-slate-400");
  document
    .getElementById("show-not-completed-capt")
    .classList.add("text-slate-700");

  showCompletedButton.classList.remove("border-b-2", "border-sky-500");
  document
    .getElementById("show-completed-capt")
    .classList.remove("text-slate-700");
  document
    .getElementById("show-completed-capt")
    .classList.add("text-slate-400");
});

showCompletedButton.addEventListener("click", function () {
  selectedTab = "completed";

  let bookData = getBook(selectedTab);
  renderList(bookData);

  showAllButton.classList.remove("border-b-2", "border-sky-500");
  document.getElementById("show-all-capt").classList.remove("text-slate-700");
  document.getElementById("show-all-capt").classList.add("text-slate-400");

  showNotCompletedButton.classList.remove("border-b-2", "border-sky-500");
  document
    .getElementById("show-not-completed-capt")
    .classList.remove("text-slate-700");
  document
    .getElementById("show-not-completed-capt")
    .classList.add("text-slate-400");

  showCompletedButton.classList.add("border-b-2", "border-sky-500");
  document
    .getElementById("show-completed-capt")
    .classList.remove("text-slate-400");
  document
    .getElementById("show-completed-capt")
    .classList.add("text-slate-700");
});
