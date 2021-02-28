"use strict";

// redirect to login page if not logged in
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// create request object
function generate_requestConfig(methodName, body = null) {
  const token = localStorage.getItem("token");
  const reqObj = {
    method: methodName,
    redirect: "follow",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
  };
  if (body) {
    reqObj["body"] = JSON.stringify(body);
  }

  return reqObj;
}

document.addEventListener("DOMContentLoaded", () => {
  // get list of all the books and create list elements
  const bookListURL = "http://localhost:5000/api/v1/books";
  const requestConfig = generate_requestConfig("GET");

  fetch(bookListURL, requestConfig)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        // if database has values, create table
        const bookTableBody = document.getElementById("bookTableBody");
        for (let i = 0; i < data.length; i++) {
          const elem = `
            <tr>
              <td id="bookNameList">${data[i].book_name}</td>
              <td id="bookPubYearList">${data[i].publication_year}</td>
              <td id="bookGenreList">${data[i].genre}</td>
              <td class="d-flex justify-content-center">
                <button id="editBtn" class="me-2 btn btn-primary" data-bs-toggle="modal" data-bs-target="#editBookModal" data-bs-id=${data[i]._id.$oid}>Edit</button>
                <button id="deleteBtn" data-id=${data[i]._id.$oid} class="btn btn-danger">Delete</button>
              </td>
            </tr>
          `;
          bookTableBody.insertAdjacentHTML("beforeend", elem);
        }

        // pass row value to edit modal
        document
          .getElementById("editBookModal")
          .addEventListener("show.bs.modal", function (event) {
            document.getElementById(
              "book-id"
            ).value = event.relatedTarget.getAttribute("data-bs-id");
          });

        // edit book
        document
          .getElementById("editBookSubmit")
          .addEventListener("click", (event) => {
            const bookName = document.getElementById("bookNameEdit").value;
            const bookPubYear = document.getElementById("bookPubYearEdit")
              .value;
            const bookID = document.getElementById("book-id").value;

            // comma separated string to array
            const bookGenre = document
              .getElementById("bookGenreEdit")
              .value.split(",")
              .map((elem) => elem.toLowerCase());

            // to be sent with request
            const createBookURL = `http://localhost:5000/api/v1/books/${bookID}`;
            const reqBody = {
              book_name: bookName,
              publication_year: bookPubYear,
              genre: bookGenre,
            };
            const requestConfig = generate_requestConfig("PATCH", reqBody);

            fetch(createBookURL, requestConfig)
              .then((response) => response.json())
              .then((data) => {
                if (data.message) {
                  location.reload();
                } else {
                  throw data;
                }
              })
              .catch((err) => {
                console.log(err.error);
              });
          });

        // delete book
        document.querySelectorAll("#deleteBtn").forEach((item) => {
          item.addEventListener("click", (event) => {
            const bookID = event.target.getAttribute("data-id");
            console.log(bookID);

            // to be sent with request
            const deleteBookURL = `http://localhost:5000/api/v1/books/${bookID}`;
            const requestConfig = generate_requestConfig("DELETE");

            fetch(deleteBookURL, requestConfig)
              .then((response) => response.json())
              .then((data) => {
                if (data.message) {
                  location.reload();
                } else {
                  throw data;
                }
              })
              .catch((err) => {
                console.log(err.error);
              });
          });
        });
      }
    });
});

// logout button function
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// create new book
document.getElementById("newBookSubmit").addEventListener("click", (event) => {
  event.preventDefault();

  const bookName = document.getElementById("bookName").value;
  const bookPubYear = document.getElementById("bookPubYear").value;

  // comma separated string to array
  const bookGenre = document
    .getElementById("bookGenre")
    .value.split(",")
    .map((elem) => elem.toLowerCase());

  // to be sent with request
  const createBookURL = "http://localhost:5000/api/v1/books";
  const reqBody = {
    book_name: bookName,
    publication_year: bookPubYear,
    genre: bookGenre,
  };
  const requestConfig = generate_requestConfig("POST", reqBody);

  fetch(createBookURL, requestConfig)
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        location.reload();
      } else {
        throw data;
      }
    })
    .catch((err) => {
      console.log(err.error);
    });
});
