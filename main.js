//fetch products
fetch("https://restaurantapp-658d3-default-rtdb.firebaseio.com//products.json")
  .then((response) => response.json())
  .then((data) => {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
    const products = [];
    for (const key in data) {
      products.push({ ...data[key], id: key });
    }
    console.log(products);

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
                         <div class="cart-btn">
                            <i class="fa-solid fa-cart-plus "></i>
                          </div>
                      </div>
                </div>
            </a>
        </li>
    `;
      const items = document.getElementById("elements-list");
      items.insertAdjacentHTML("afterBegin", foodItem);
    });
  })
  .catch((error) => console.error("Error:", error));



