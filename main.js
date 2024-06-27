//getting unique identifier from browser storage
let id = localStorage.getItem('id');
if(!id){
   // Generate a random 5-character string
   const randomString = Math.random().toString(36).slice(2, 7);
   // Store the randomly generated string in local storage
   localStorage.setItem('id', randomString);
   id = randomString
}





//fetch products
fetch("https://restaurantapp-658d3-default-rtdb.firebaseio.com//products.json")
  .then((response) => response.json())
  .then((data) => {
    //showing loading message
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    //converting firebase response to an array of products
    const products = [];
    for (const key in data) {
      products.push({ ...data[key], id: key });
    }

    //displaying the array of prodcut to html
    products.forEach((product) => {
      const foodItem = `
        <li>
            <a>
                <img src="${product.image}" alt="food image">
                <div class="food-content">
                    <div class="name">
                        ${product.name}
                    </div>
                    <span>stock: 4</span>
                    <div class="product-item-footer">
                        <div class="cook-time">
                            <span>🕙</span>
                            ${product.time}min
                        </div>
                        <div class="price">
                            <span>${product.price} FCFA</span>
                        </div>
                    </div>
                    <div class="cart-btn-c"> 
                        <div onclick="addToCart(${JSON.stringify(product).replace(/\"/g,"'")})" class="cart-btn">
                            <i class="fa-solid fa-cart-plus"></i>
                        </div>
                    </div>
                </div>
            </a>
        </li>
      `;
      const items = document.getElementById("elements-list");
      items.insertAdjacentHTML("afterbegin", foodItem); 
    });
  })
  .catch((error) => console.error("Error:", error));



 




// JSON.stringify(product) converts the product object into a JSON string.
// .replace(/\"/g,"'") then replaces all double quotes with single quotes within the JSON string representation of the product object.
// This manipulation is often used when dynamically generating HTML content or passing data as attributes within HTML elements where using double quotes could conflict with HTML attribute syntax. Replacing double quotes with single quotes helps ensure that the resulting string can be safely used within HTML attributes without causing syntax errors