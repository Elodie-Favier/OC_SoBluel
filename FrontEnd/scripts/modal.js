let modal = null;
let gallerymodal = document.querySelector(".gallerymodal");
console.log(gallerymodal);
let imgData = [];

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

const getImgGalleryModal = async () => {
  const res = await fetch("http://localhost:5678/api/works");
  imgData = await res.json();
  console.log(imgData);
};
getImgGalleryModal();

const displayImgGalleryModal = async () => {
  await getImgGalleryModal();

  gallerymodal.innerHTML = imgData
    .map(
      (img) =>
        `<div class="gallerymodal-card">
          <img class="gallerymodal-card-img" src=${img.imageUrl}>
          <div class="icon-trash"><i class="fa-solid fa-trash-can fa-xs"></i></div>
          <button class="gallerymodal-card-btn">éditer</button>
          </div>`
    )
    .join("");
};
displayImgGalleryModal();
