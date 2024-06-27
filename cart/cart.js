let identifier = localStorage.getItem("id");
if (!identifier) {
  alert("identifier not found");
}

let cartCount = 0;
let cartItems = [];

const cartCountElement = document.getElementById("cart-count");
cartCountElement.innerHTML = cartCount;

//fetching cart items saved in database
function fetchCartItems() {
  fetch("https://restaurantapp-658d3-default-rtdb.firebaseio.com//cart.json")
    .then((response) => response.json())
    .then((data) => {
      let items = [];

      for (const key in data) {
        items.push({
          ...data[key],
          id: key,
        });
      }
      //pushing user cart items to array
      items.forEach((item) => {
        if (item.user === identifier) {
          cartItems.push(item);
        }
      });
      cartCount = cartItems.length;
      cartCountElement.innerHTML = cartCount;

      setCartItems();
    })

    .catch((error) => console.error("Error:", error));
}

function setCartItems() {
  const cartItemsEl = document.getElementById("cart-items");
  if (cartItemsEl) {
    cartItemsEl.innerHTML = "";

    cartItems.forEach((item) => {
      const cartItem = `
       <div class="cart-item">
        <p id="${item.id}">${item.quantity}</p> 
              <img src="${item.image}" class="cart-img" alt="">
              <p>${item.product_name}</p>
              <p>${item.price} FCFA</p>
              <div> 
              <button onclick="removeCartItem('${item.id}')" class="remove-cart-btn"> <i class="fa-solid fa-minus"></i></button>
              <button onclick="addQty('${item.id}')" class="plus-cart-btn"> <i class="fa-solid fa-plus"></i></button>
              </div>
              
          </div>
      `;
      cartItemsEl.insertAdjacentHTML("afterbegin", cartItem);
    });
    calculateSummary();
  }
}

fetchCartItems();

//add to cart function
function addToCart(product) {
  //creating cart item object from received product

  if (product.stock < 1) {
    alert("Out of stock!");
  }

  let cartItem = {
    product_id: product.id,
    product_name: product.name,
    image: product.image,
    price: product.price,
    quantity: 1,
    user: identifier,
  };

  let existingCartItem = cartItems.find(
    (item) => item.product_id === product.id
  );
  if (existingCartItem) {
    alert("Item already in cart");
  } else {
    cartItems.push(cartItem);
    saveCart(cartItem);
    alert("added");
  }
}

//saving a new cart item to database
function saveCart(cartItem) {
  const firebaseUrl =
    "https://restaurantapp-658d3-default-rtdb.firebaseio.com//cart.json";
  // Fetch POST request to Firebase
  fetch(firebaseUrl, {
    method: "POST",
    body: JSON.stringify(cartItem),
  })
    .then((response) => {
      if (response.ok) {
        cartCount++;
        cartCountElement.innerHTML = cartCount;
      } else {
        alert("error");
      }
    })
    .catch((error) => {
      alert("error");
    });
}

//update existing cartItem in databae
function updateCart(cartItem, qty) {
  const firebaseUrl = `https://restaurantapp-658d3-default-rtdb.firebaseio.com//cart/${cartItem.id}.json`;
  fetch(firebaseUrl, {
    method: "PATCH",
    body: JSON.stringify({ quantity: qty }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        alert("error");
      }
      console.log(" updated successfully");
    })
    .catch((error) => console.error("Error :", error));
}

//deleteCart
function deleteCart(id) {
  console.log(id);
  const firebaseUrl = `https://restaurantapp-658d3-default-rtdb.firebaseio.com//cart/${id}.json`;
  fetch(firebaseUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        alert("error");
      }
      console.log(" deleted successfully");
    })
    .catch((error) => alert("error"));
}

//calculatuing dummary
function calculateSummary() {
  let totalPrice = 0;
  let itemCount = cartItems.length;
  cartItems.forEach((item) => {
    totalPrice += item.price * +item.quantity;
  });
  document.getElementById("summary-count").innerHTML = itemCount;
  document.getElementById("summary-total").innerHTML = totalPrice;
}

//removing item from cart
function removeCartItem(id) {
  const existingItem = cartItems.find((item) => item.id === id);
  if (!existingItem) alert("error");
  if (existingItem.quantity > 1) {
    existingItem.quantity = existingItem.quantity - 1;
    document.getElementById(id).innerHTML = existingItem.quantity;
    updateCart(existingItem, existingItem.quantity);
  } else {
    cartItems = cartItems.filter((item) => item.id !== id);
    setCartItems();
    deleteCart(id);
  }
  calculateSummary();
}

//add qty of product in cart
function addQty(id) {
  const existingItem = cartItems.find((item) => item.id === id);
  if (!existingItem) alert("error");
  existingItem.quantity = existingItem.quantity + 1;
  document.getElementById(id).innerHTML = existingItem.quantity;
  updateCart(existingItem, existingItem.quantity);
  calculateSummary();
}
