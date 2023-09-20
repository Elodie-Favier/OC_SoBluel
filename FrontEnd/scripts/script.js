// Mes variables
let log = document.querySelector(".log");
let admin = document.querySelector(".admin");
let editProjets = document.querySelector(".editProjets");
const myGallery = document.querySelector(".gallery");
let filters = document.querySelector(".filters");
let buttons = [];
let clickOnFilter;
let worksData = [];
let categories = [];
let worksFiltered = [];

// récupération des travaux via l'API
const getWorks = async () => {
  const res = await fetch("http://localhost:5678/api/works");
  worksData = await res.json();
};

// récupération des categories via l'API
const getCategory = async () => {
  const resp = await fetch("http://localhost:5678/api/categories");
  categories = await resp.json();
};

// affichage de tous les travaux dans la galerie
const displayAllWorks = async () => {
  await getWorks();
  await getCategory();

  myGallery.innerHTML = worksData
    .map(
      (work) =>
        `<figure> <img src=${work.imageUrl} alt="photo de ${work.title}"><figcaption>${work.title}</figcaption></figure>`
    )
    .join("");
};
displayAllWorks();

// deselection des boutons
function unselectedButton() {
  buttons.forEach((button) => {
    button.classList.remove("filterSelected");
  });
}
unselectedButton();

// affichage des travaux filtres
const displayWorksWithButtons = async () => {
  await getWorks();
  await getCategory();
  await displayAllWorks();

  let divBtnAll = document.createElement("div");
  filters.appendChild(divBtnAll);
  let btnAll = document.createElement("button");
  divBtnAll.appendChild(btnAll);
  btnAll.classList.add("filter", "filterSelected");
  btnAll.textContent = "Tous";

  let divBtnFilters = document.createElement("div");
  filters.appendChild(divBtnFilters);

  categories.forEach((categorie) => {
    let btnFilter = document.createElement("button");
    btnFilter.textContent = categorie.name;
    btnFilter.dataset.categoryId = categorie.id;
    btnFilter.classList.add("filter");
    divBtnFilters.appendChild(btnFilter);
  });
  buttons = document.querySelectorAll(".filter");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      unselectedButton();
      button.classList.add("filterSelected");
      let clickOnFilter = button.dataset.categoryId;
      if (clickOnFilter >= 1) {
        worksFiltered = worksData.filter(
          (work) => work.category.id == clickOnFilter
        );

        myGallery.innerHTML = worksFiltered
          .map(
            (work) =>
              `<figure> <img src=${work.imageUrl} alt="photo de ${work.title}"><figcaption>${work.title}</figcaption></figure>`
          )
          .join("");
      } else {
        displayAllWorks();
      }
    });
  });
};
displayWorksWithButtons();

// if token in localStorage

if (localStorage.getItem("token")) {
  log.textContent = "Logout";
  filters.style.display = "none";
  admin.style.display = "block";
  editProjets.style.display = "block";
}

// if click on logout

log.addEventListener("click", () => {
  localStorage.removeItem("token");
  log.textContent = "Login";
  filters.style.display = "block";
  admin.style.display = "none";
  location.reload();
  editProjets.style.display = "none";
});
