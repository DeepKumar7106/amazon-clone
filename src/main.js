import { categories } from "./data.js";
import { renderMain } from "./category.js";
// import { renderCartList } from "./cart";

// render categories in home page
// const categoryContainer = document.getElementById('categoryContainer');
// categoryContainer

export function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function renderCategories() {
  const main = document.querySelector('main');
  main.innerHTML = "";
  main.append(
    document.createElement('h1').textContent = "Categories"
  )
  const categoryContainer = document.createElement('section');
  categoryContainer.id = "categoryContainer";

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
  main.append(categoryContainer);
  console.log(categoryContainer)
  const categoryWrapper = document.querySelectorAll(".categoryWrapper")
  categoryWrapper.forEach(category => {
    category.addEventListener("click", () => {
      console.log(category.id)
      renderMain(category.id);
      // sessionStorage.setItem("id", category.id);
      // window.location.href = "category.html"
    })  
  })
}
renderCategories();





function renderUL() {
  const categoryList = document.getElementById("categoryList");
  const home = document.createElement('li');
  home.textContent = "Home";
  home.id = "home";
  home.classList.add('navLI')
  categoryList.append(home);
  categories.forEach(category => {
    const li = document.createElement('li');
    li.textContent = capitalize(category.name);
    li.classList.add(category.id,'navLI');
    categoryList.append(li);
  })

}
renderUL();

document.querySelectorAll('.navLI').forEach(item => {
  item.addEventListener('click', () => {
    console.log(item.classList);
    if(item.id === "home") {
      renderCategories();
    } else {
      renderMain(item.classList[0]);
    }
  })
})



document.getElementById('cart').addEventListener('click', () => {
  window.location.href = './src/cart.html'
})