// mes variables

let modal = null;
let gallerymodal = document.querySelector(".gallerymodal");
let deleteImage = document.querySelector(".delete-img");
let addImg = document.getElementById("addPhoto");
const previewImage = document.querySelector(".preview-img");
const img = document.createElement("img");
previewImage.appendChild(img);
img.classList.add("new-prev-img");
let addImage = document.querySelector(".add-img");
let arrowLeft = document.querySelector(".btn-goback");
let form = document.getElementById("formAddImage");
let addImageCategory = document.getElementById("categorie");
let addImageTitle = document.getElementById("titre");
let titre;
let indexCategorie;
const valid = document.getElementById("btn-valid");

let imgData = [];
let imgId;
let garbage = document.querySelector(".icon-trash i");
let token = localStorage.getItem("token");

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

// navigation fleche et croix

addImg.addEventListener("click", (e) => {
  arrowLeft.style.display = "block";
  addImage.style.display = "block";
  deleteImage.style.display = "none";
});
arrowLeft.addEventListener("click", (e) => {
  console.log("clic sur fleche go back");
  deleteImage.style.display = "block";
  addImage.style.display = "none";
  previewImage.style.display = "none";
  arrowLeft.style.display = "none";
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
        </div>`
    )
    .join("");
};
displayImgGalleryModal();

// suppression d'une image

const selectGarbageOnClick = async () => {
  await displayImgGalleryModal();

  let galleryCards = document.querySelectorAll(".gallerymodal-card");
  // console.log(galleryCards);

  galleryCards.forEach((card) => {
    let cardId = card.id;
    card.addEventListener("click", (event) => {
      event.preventDefault();

      let garbageId = event.target.id;

      if (garbageId === cardId || localStorage.getItem("token")) {
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

// Ajouter une photo
// affichage des images dans la fenêtre de prévisualisation

//  affichage des messages d'erreur

let image, title, categorie;

const errorDisplaySpan = (tag, message, valid) => {
  const box = document.querySelector("." + tag + "-box");
  const span = document.querySelector("." + tag + "-box > span");

  if (!valid) {
    span.classList.add("error");
    span.textContent = message;
  } else {
    box.classList.remove("error");
    span.textContent = message;
  }
};

const formValid = async () => {};

let previewPicture = function (e) {
  const [picture] = e.files;
  if (picture) {
    for (const file of e.files) {
      if (
        file.size <= 4194304 &&
        (file.type === "image/jpeg" || file.type === "image/png")
      ) {
        previewImage.style.display = "block";
        let reader = new FileReader();
        reader.onload = function (e) {
          img.src = e.target.result;
        };
        reader.readAsDataURL(picture);
        image = e.files[0];
      } else {
        errorDisplaySpan(
          "image",
          "La taille de l'image ne doit pas dépasser 4 mo"
        );
        image = null;
      }
    }
  }
};

// Verifier la présence du titre

const titleChecker = (value) => {
  addImageTitle.addEventListener("input", (e) => {
    titre = e.target.value;

    if (titre.length > 0 && titre.length < 3) {
      errorDisplaySpan(
        "title",
        "Vous devez renseigner un titre entre 3 et 50 caractères"
      );
      title = null;
    } else {
      errorDisplaySpan("title", "", true);
      title = titre;
    }
  });
};

titleChecker();

// affichage des catégories dans le selecteur
let selectCategory = document.getElementById("selectCat");

const categoryChoose = async () => {
  await getCategory();
  const emptyCategory = '<option class="cat-option" value=""></option>';
  const categoriesChoice = categories
    .map(
      (categorie) =>
        `
        <option class="cat-option" value="${categorie.name}">${categorie.name}</option>
`
    )
    .join("");
  selectCategory.innerHTML = emptyCategory + categoriesChoice;

  selectCategory.addEventListener("change", () => {
    indexCategorie = selectCategory.selectedIndex;
    if (indexCategorie > 0) {
      errorDisplaySpan("categorie", "", true);
      categorie = indexCategorie;
    } else {
      errorDisplaySpan("categorie", "Choisissez une catégorie");
      categorie = null;
    }
  });
};

categoryChoose();

form.addEventListener("change", updateValue);
function updateValue(e) {
  if (image && title && categorie) {
    valid.style.background = "#1D6154";
  } else {
    valid.style.background = "#B3B3B3;";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (image && title && categorie) {
    const newData = {
      image: image,
      title: title,
      id: categorie,
    };
    console.log(newData);
    previewImage.style.display = "none";
    addImageTitle.value = "";
    categoryChoose();

    image = null;
    title = null;
    categorie = null;
  } else {
    alert("Veuillez renseigner tous les champs du formulaire");
  }
});
