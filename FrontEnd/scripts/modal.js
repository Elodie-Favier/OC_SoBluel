let modal = null;
let gallerymodal = document.querySelector(".gallerymodal");
// console.log(gallerymodal);

let imgData = [];
let imgId;

// fonctionnement basique de la modal

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = "block";
  target.setAttribute("aria-hidden", "false");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

// affichage des images et des icones trash

const getImgGalleryModal = async () => {
  const res = await fetch("http://localhost:5678/api/works");
  imgData = await res.json();
  // console.log(imgData);
};
getImgGalleryModal();

const displayImgGalleryModal = async () => {
  await getImgGalleryModal();

  gallerymodal.innerHTML = imgData
    .map(
      (img) =>
        `<div class="gallerymodal-card" id="${img.id}">
          <img class="gallerymodal-card-img" src=${img.imageUrl}>
          <div class="icon-trash"><i id="${img.id}" class="fa-solid fa-trash-can"></i></div>
          <button class="gallerymodal-card-btn">éditer</button>
        </div>`
    )
    .join("");
};
displayImgGalleryModal();

const selectGarbageOnClick = async () => {
  await displayImgGalleryModal();

  let galleryCards = document.querySelectorAll(".gallerymodal-card");

  galleryCards.forEach((card) => {
    let cardId = card.id;
    // console.log(cardId);
    let garbage = document.querySelector(".icon-trash i");
    // console.log(garbage);
    card.addEventListener("click", (event) => {
      // console.log(event.target.id);
      let garbageId = event.target.id;
      // console.log(garbageId);

      if (garbageId === cardId) {
        // confirm() à la place ?
        alert(
          "Attention vous allez supprimer la photo numéro " + cardId + " ?"
        );
        deleteImg(cardId);
      }
    });
  });
};
selectGarbageOnClick();

const deleteImg = async () => {
  // fetch DELETE
  if (localStorage.getItem("token")) {
    const deleteRes = await fetch("http://localhost:5678/api/works/${cardId}", {
      method: "DELETE",
      headers: { Authorization: "Bearer ${token}" },
    });
    let deleteImg = await deleteRes.json();
    console.log(deleteImg);
  }
};
