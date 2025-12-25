import { categories } from "./data";
import { renderMain } from "./category";

// render categories in home page
const categoryContainer = document.getElementById('categoryContainer');
categoryContainer

export function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function renderCategories() {
  categories.forEach(category => {
    const title = category.name;
    const div = document.createElement('div');
    div.classList.add('categoryWrapper');
    div.id = category.id;

    const img = document.createElement('img');
    img.setAttribute('src',`src/categoryImages/${title}.png`);

    const h2 = document.createElement('h2');
    h2.textContent = capitalize(title);

    div.append(img, h2);
    categoryContainer.append(div);
  })
  console.log(categoryContainer)
}

renderCategories();

const categoryWrapper = document.querySelectorAll(".categoryWrapper")
categoryWrapper.forEach(category => {
  category.addEventListener("click", () => {
    console.log(category.id)
    renderMain(category.id);
    // sessionStorage.setItem("id", category.id);
    // window.location.href = "category.html"
  })  
})