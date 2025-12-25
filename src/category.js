import { categories, products } from "./data";
import { capitalize } from "./main";

export function renderMain(id) {
    // const id = sessionStorage.getItem("id");
    const category = categories.find(item => item.id === id);
    const categoryName = category.name;

    const main = document.querySelector('main');
    main.innerHTML = "";
    const banner = document.createElement('div');
    banner.id = "banner";

    const bannerImg = document.createElement('img');
    bannerImg.src =  `src/categoryImages/${categoryName}.png`; //depends on what category u press
    
    const bannerTitle = document.createElement('h2');
    bannerTitle.textContent = categoryName;

    banner.append(bannerImg, bannerTitle);
    
    const categoryText = document.createElement('p');
    categoryText.id = "categoryText"
    categoryText.textContent = "browse through the category";

    const productsWrapper = document.createElement('div');
    productsWrapper.id = "productsWrapper";

    products.forEach(product => {
        if(product.category === categoryName) {
            const productContainer = document.createElement('div');
            productContainer.classList.add("productContainer", "center");
            productContainer.innerHTML = `
                <div class="imgBox">
                    <img src="${product.src}" alt="">
                </div>
                <div class="descriptionBox">
                    <h2>${product.name}</h2>
                    <p class="productDescription">
                        ${product.desscription}
                    </p>
                    <p class="cost">${product.price}</p>
                    <p class="ratings">${product.rating} star</p>
                    <button class="ctaButton">Add to cart</button>
                </div>
            `
            productsWrapper.append(productContainer);
        }
    })

    main.appendChild(banner);
    main.appendChild(categoryText);
    main.append(productsWrapper);
    // main.append(banner, categoryText, productsWrapper);
    sessionStorage.clear();
}

// renderMain();