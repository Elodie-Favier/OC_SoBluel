const myGallery = document.querySelector(".gallery");
let filters = document.querySelector(".filters");

let divBtnAll = document.createElement("div");
filters.appendChild(divBtnAll);
let btnAll = document.createElement("button");
divBtnAll.appendChild(btnAll);
btnAll.classList.add("filter", "filterSelected");
btnAll.textContent = "Tous";

let divBtnFilters = document.createElement("div");
filters.appendChild(divBtnFilters);
// console.log(divBtnFilters);

// "http://localhost:5678/api/works"

let worksData = [];
let categories = [];
let worksFiltered = [];

const getWorks = async () => {
  const res = await fetch("http://localhost:5678/api/works");
  worksData = await res.json();
  // console.log(worksData);
};

const getCategory = async () => {
  const resp = await fetch("http://localhost:5678/api/categories");
  categories = await resp.json();
  // console.log(categories);
};

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

const displayFilteredWorksAndButton = async () => {
  await getWorks();
  await getCategory();

  categories.forEach((categorie) => {
    let btnFilter = document.createElement("button");
    btnFilter.textContent = categorie.name;
    btnFilter.dataset.categoryId = categorie.id;
    // btnFilter.dataset.categoryName = categorie.name;
    btnFilter.classList.add("filter");
    divBtnFilters.appendChild(btnFilter);
    btnFilter.addEventListener("click", (e) => {
      e = btnFilter.dataset.categoryId;
      worksFiltered = worksData.filter((work) => work.category.id == e);
      btnFilter.classList.add("filterSelected");
      // console.log(worksFiltered);
      myGallery.innerHTML = worksFiltered
        .map(
          (work) =>
            `<figure> <img src=${work.imageUrl} alt="photo de ${work.title}"><figcaption>${work.title}</figcaption></figure>`
        )
        .join("");
    });
  });
};
displayFilteredWorksAndButton();

btnAll.addEventListener("click", () => {
  displayAllWorks();
});

function unselectedButton() {}
unselectedButton();
