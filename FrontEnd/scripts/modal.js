let modal = null;
let gallerymodal = document.querySelector(".gallerymodal");
// console.log(gallerymodal);
let deleteImage = document.querySelector(".delete-img");
let addImg = document.getElementById("addPhoto");

let addImage = document.querySelector(".add-img");
let arrowLeft = document.querySelector(".btn-goback");
let imgData = [];
let imgId;
let garbage = document.querySelector(".icon-trash i");
let token = localStorage.getItem("token");
// console.log(token);

// fonctionnement basique de la modal

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = "block";
  target.setAttribute("aria-hidden", "false");
  target.setAttribute("aria-modal", "true");
  modal = target;
  deleteImage.style.display = "block";
  addImage.style.display = "none";
  arrowLeft.style.display = "none";
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
        `<div class="gallerymodal-card" id="${img.id}" data-cardId="${img.id}">
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
    console.log(cardId);
    console.log(card.dataset.cardid);
    card.addEventListener("click", (event) => {
      event.preventDefault();
      // console.log(event.target.id);
      let garbageId = event.target.id;
      // console.log(garbageId);

      if (garbageId === cardId || localStorage.getItem("token")) {
        // confirm() à la place ?
        alert(
          "Attention vous allez supprimer la photo numéro " + cardId + " ?"
        );
        fetch(`http://localhost:5678/api/works/${cardId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
          if (response.ok) {
            console.log("projet supprimé");
            // Puis mise à jour de la gallerie et de la page index
            displayImgGalleryModal();
            displayAllWorks();
          }
        });
      }
    });
  });
};
selectGarbageOnClick();

addImg.addEventListener("click", (e) => {
  console.log("clic sur bouton");
  arrowLeft.style.display = "block";
  addImage.style.display = "block";
  deleteImage.style.display = "none";
});
arrowLeft.addEventListener("click", (e) => {
  console.log("clic sur fleche go back");
  deleteImage.style.display = "block";
  addImage.style.display = "none";
  arrowLeft.style.display = "none";
});
// aller sur "ajouter une photo"

// ajouter un projet

// en cliquant sur ajouter photo je dois pouvoir aller telecharger une image dnas mes dossiers -> quelle est la fonction pour ça ?
// Je suis obligée de mettre un titre et de sélectionner une catégorie (donc aller réccupérer les catégories.)il doit y avoir un message d'alerte si je ne renseigne pas les champs en question et je ne peux pas valider l'ajout du nouveau projet si tous les champs ne sont pas renseignés

// donc il faut : une fonction qui va chercher les catégories ou je réccupere la fonction qui les trouvent déjà
