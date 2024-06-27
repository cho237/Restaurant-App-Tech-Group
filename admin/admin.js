//fetch products

function fetchProducts() {
  fetch(
    "https://restaurantapp-658d3-default-rtdb.firebaseio.com//products.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const products = [];
  
      for (const key in data) {
        products.push({
          ...data[key],
          id: key,
        });
      }

      const tableBody = document.getElementById("table-body");

      // Clear the existing rows in the table body
      tableBody.innerHTML = "";

      products.forEach((product) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                                   <td>
                                        <img src="${product.image}" class="table-image" alt="">
                                    </td>
                                    <td>${product.name}</td>
                                    <td>${product.price}</td>
                                    <td>${product.stock}</td>
                                    <td>
                                        <i class="fa-regular fa-trash-can"></i> 
                                        <i class="fa-solid fa-pen"></i>
                                    </td>
                                
        `;

        tableBody.appendChild(row);
      });
    })

    .catch((error) => console.error("Error:", error));
}

fetchProducts();

function saveProduct() {
  //gey input form values
  const name = document.getElementById("name");
  const price = document.getElementById("price");
  const image = document.getElementById("image");
  const stock = document.getElementById("stock");
  const time = document.getElementById("time");

  //validation
  if (
    !name.value ||
    !price.value ||
    !image.value ||
    !stock.value ||
    !time.value
  )
    return alert("invalid form");

  // Data to be sent in the POST request
  const postData = {
    name: name.value,
    price: price.value,
    stock: stock.value,
    image: image.value,
    time: time.value,
  };

  const button = document.getElementById("save-btn");

  //disable button not to create product twice
  button.disabled = true;

  button.value = "Saving...";

  const firebaseUrl =
    "https://restaurantapp-658d3-default-rtdb.firebaseio.com//products.json";
  // Fetch POST request to Firebase
  fetch(firebaseUrl, {
    method: "POST",
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (response.ok) {
        button.disabled = false;
        button.value = "Save";
        fetchProducts();
      } else {
        alert("error")
      }
    })
    .catch((error) => {
      button.disabled = false;
      button.value = "Save";
      console.error("Error posting data to Firebase:", error);
      alert("error")
    });
}
