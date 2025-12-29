import { categories } from "./data.js";
// import {} from "./cart.js"

async function getProduct() {
    const res = await fetch("http://localhost:3000/products");
    return await res.json();    
}

export async function renderMain(id) {
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

    const products = await getProduct();
    console.log(products)
    products.forEach(product => {
        if(product.CATEGORY === categoryName) {
            const productContainer = document.createElement('div');
            productContainer.classList.add("productContainer", "center");
            productContainer.id = product.ID;
            productContainer.innerHTML = `
                <div class="imgBox">
                    <img src="${product.SRC}" alt="">
                </div>
                <div class="descriptionBox">
                    <h2>${product.NAME}</h2>
                    <p class="productDescription">
                    ${product.DESCRIPTION}
                    </p>
                    <p class="cost">${product.PRICE}</p>
                    <p class="ratings">${product.RATING} star</p>
                    <button class="ctaButton item-not-added">Add to cart</button>
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


    

    document.querySelectorAll('.ctaButton').forEach(button => {
        button.addEventListener('click', () => {

            //stores the product id to be added to cart, the id is stored in the top most wrapper 
            //first gets access to button's parent and then to its parent and finally the ID
            const productId = button.parentNode.parentNode.id
            console.log(productId)

            if(button.classList.contains('item-added')){
                button.classList.remove('item-added')
                button.classList.add('item-not-added')
                //removes id from the cart
                // cartRemove(productId)
                removeFromCart(productId)
                
            }
            else{
                button.classList.remove('item-not-added')
                button.classList.add('item-added');
                //adds element to the cart
                // cartAdd(productId)
                addToCart(productId)
            }
        })
    })
}

async function removeFromCart(productId) {
    const res = await fetch("http://localhost:3000/cart/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    });
  
    const data = await res.json();
  
    if (data.success && !data.inCart) {
      console.log("Removed from cart");
      // change button back to "Add to cart"
    }
  }

async function addToCart(productId) {
    const res = await fetch("http://localhost:3000/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    });
  
    const data = await res.json();
  
    if (data.success && data.inCart) {
      console.log("Added to cart");
      // change button to "Remove from cart"
    }
  }
// renderMain();