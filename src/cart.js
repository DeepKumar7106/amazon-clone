import { products, categories, getCart } from "./data.js";
// import { cart } from "./category.js";

// let cart = JSON.parse(sessionStorage.getItem('cart'))
// console.log(cart)

async function loadCart() {
    const res = await fetch("http://localhost:3000/cart");
    const data = await res.json();
  
    renderCartList(data.items);
  }
  loadCart();

let total = 0;
const renderCartList = (cart) => {
    // const cart = getCart();
    
    console.log(cart)
    cart.forEach(product => {
        const cartList = document.getElementById('cartList');
        console.log(cartList)
        //gets the element with the Id
        // const product = products.find(list => list.id === item)
        
        const cartBox = document.createElement('div');
        
        cartBox.classList.add('cartBox')
        cartBox.innerHTML = `
        <input type="checkbox" name="" id="">
        <img src="../${product.SRC}" alt="${product.NAME}">
        `
        
        //div for the product details 
        const detail = document.createElement('div');
        detail.classList.add('detail')
        
        
        const cartItemNameAndPrice = document.createElement('div');
        cartItemNameAndPrice.classList.add('cartItemNameAndPrice')
        cartItemNameAndPrice.innerHTML = `
        <p class="name">${product.NAME}</p>
        <p class="price">${product.PRICE}</p>
        `
        
        
        //creates the p element for the delivery option 
        const deliveryDetails = document.createElement('p').textContent = `Expected to be delivered on Tuesday`
        const orderUpdateBox =document.createElement('div');
        orderUpdateBox.classList.add('orderUpdateBox');
        orderUpdateBox.innerHTML = `
        <p class="removeItem">-</p>
        <p class="itemCount">${product.QUANTITY}</p> 
        <p class="addItem">+</p>
        `
        detail.append(cartItemNameAndPrice, deliveryDetails, orderUpdateBox)
        cartBox.append(detail)
        cartList.appendChild(cartBox)
        console.log(cartList)
        total+=Number(product.PRICE);
    })
    document.getElementById('totalText').innerHTML = `Total is ${total}`;
}

// renderCartList()
// document.addEventListener('DOMContentLoaded', () => {
//     renderCartList(cart)
// })


document.getElementById('logo').addEventListener('click', () => {
    window.location.href = '../index.html'
})