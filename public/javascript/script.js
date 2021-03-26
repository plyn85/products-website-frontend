/* jshint esversion: 8 */

const BASE_URL = "http://localhost:8000";

// Default HTTP headers for requests to the api
const HTTP_REQ_HEADERS = new Headers({
  Accept: "application/json",
  "Content-Type": "application/json",
});

// Used to Initialise GET requests and permit cross origin requests
const GET_INIT = {
  method: "GET",
  credentials: "include",
  headers: HTTP_REQ_HEADERS,
  mode: "cors",
  cache: "default",
};

// Asynchronous Function getDataAsync from a url and return
// The init paramter defaults to GET_INIT
let getDataAsync = async (url, init = GET_INIT) => {
  // Try catch
  try {
    // Call fetch and await the respose
    // Initally returns a promise
    const response = await fetch(url, init);

    // As Resonse is dependant on the fetch call, await must also be used here
    const json = await response.json();

    // Output result to console (for testing purposes)
    console.log(json);

    // Call function( passing he json result) to display data in HTML page
    //displayData(json);
    return json;

    // catch and log any errors
  } catch (err) {
    console.log(err);
    return err;
  }
};

//display products function to display all products to web page
let displayProducts = (products) => {
  // add each product to row in the table using map function
  const rows = products.map((product) => {
    let row = `<tr>
                  <td>${product._id}</td>
                  <td>${product.category_id}</td>
                  <td onclick='displayProductDetails(${
                    product._id
                  })' class='list-group-item list-group-item-action row' data-toggle="modal"
                  data-target="#exampleModal">${product.product_name}
             
    </td>
                  <td>${product.product_description}</td>
                  <td>${product.product_stock}</td>
                  <td class="price">&euro;${Number(
                    product.product_price
                  ).toFixed(2)}</td>
    <td><button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#ProductFormDialog" onclick='prepareProductUpdate(${
      product._id
    })'><i class="bi bi-pencil-square"></i></button></td>
    <td><button class="btn btn-sm btn-outline-danger"  onclick='deleteProduct(${
      product._id
    })'><i class="bi bi-trash"></i></button></td>
                  </tr>`;

    return row;
  });

  //add each row to the html table use join to remove commas from array
  document.getElementById("productRows").innerHTML = rows.join("");
}; // end function

// Load Products
// Get all  products then display
let loadProducts = async () => {
  try {
    // get data - note only one parameter in function call
    const products = await getDataAsync(`${BASE_URL}/products`);
    //pass json data for display
    displayProducts(products);
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
};

//display categories function
let displayCategories = (categories) => {
  // add each category  to row in the table using map function
  const links = categories.map((category) => {
    let link = `<a onclick="loadProductsByCat(${category._id})" class="list-group-item list-group-item-action">${category.category_name}</a>`;

    return link;
  });

  //add each row to the html table use join to remove commas from array
  document.getElementById("categoryList").innerHTML = links.join("");

  //fill the select product form

  //first get the select input by its id
  let catSelect = document.getElementById("category_id");

  //clear any existing options
  while (catSelect.firstChild) {
    catSelect.removeChild(catSelect.firstChild);
  }
  //start with the default option

  catSelect.add(new Option("Choose a category", "0"));

  //iterate through the categories adding each to the end of the option list
  for (let i = 0; i < categories.length; i++) {
    catSelect.add(new Option(categories[i].category_name, categories[i]._id));
  }
}; // end function

// Load categories

let loadCategories = async () => {
  try {
    //get data from categories
    const categories = await getDataAsync(`${BASE_URL}/categories`);
    displayCategories(categories);
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
};

//call the load categories function

loadCategories();
//function to load the categories by there id called when category link is clicked
let loadProductsByCat = async (categoriesId) => {
  console.log(categoriesId);
  try {
    //get data from categories
    const categoriesById = await getDataAsync(
      `${BASE_URL}/products/cat/${categoriesId}`
    );
    displayProducts(categoriesById);
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
};
//call the loadProductByCat function
loadProductsByCat();

let displayProductDetails = async (productId) => {
  try {
    //get data from categories
    const product = await getDataAsync(`${BASE_URL}/products/${productId}`);

    displayProduct(product);
    displayProductsModalDetails(product);
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
};

//display a single product
//display products function to display all products to web page
let displayProduct = (product) => {
  //return the product add to the html div
  return (document.getElementById("singleProductRow").innerHTML += ` <thead>
  <tr>
  <td>product id</td>
  <td>Category Id</td>
  <td>name</td>
  <td>description</td>
  <td>stock</td>
  <td>price</td>
</tr>
</thead><tr>  
<tbody>
              <td>${product._id}</td>
              <td>${product.category_id}</td>
              <td onclick='displayProductDetails(${
                product._id
              })' class='list-group-item list-group-item-action'>${
    product.product_name
  }
</td>
              <td>${product.product_description}</td>
              <td>${product.product_stock}</td>
              <td class="price">&euro;${Number(product.product_price).toFixed(
                2
              )}</td>
              </tr></tbody><br>`);
};

let displayProductsModalDetails = (product) => {
  // inject different product details into the bootstrap modal
  document.querySelector(
    ".modal-header"
  ).innerHTML = `Name: <br>${product.product_name}`;
  document.querySelector(".modal-body").innerHTML = `<p>Description:<br> ${
    product.product_description
  }</p>
                 <p>Price:<br> &euro;${Number(product.product_price).toFixed(
                   2
                 )}</p>
    <p>Left in Stock:<br> ${product.product_stock}</p>`;
};
//set up product form
function productFormSetUp(title) {
  //reset the product form and change the title
  document.getElementById("productForm").reset();
  document.getElementById("productFormTitle").innerHTML = title;
  //from reset does not work for hidden inputs
  // so this to reset previous id if set
  document.getElementById("_id").value = 0;
} //end function

//get values form the product form

//prepare the product to be updated
//when a product is selected for update/editing
// get by id and fill out the form

let prepareProductUpdate = async (id) => {
  try {
    //get the product by id
    const product = await getDataAsync(`${BASE_URL}/products/${id}`);
    //set the form defaults
    productFormSetUp(`Update Product ID: ${product._id}`);

    //fill out the form
    document.getElementById("_id").value = product._id;
    document.getElementById("category_id").value = product.category_id;
    document.getElementById("product_name").value = product.product_name;
    document.getElementById("product_description").value =
      product.product_description;
    document.getElementById("product_stock").value = product.product_stock;
    document.getElementById("product_price").value = product.product_price;
  } catch (err) {
    console.log(err);
  }
};

// create product and return
let getProductForm = () => {
  //new product object constructed form the form values
  // these should be validated
  return new Product(
    //read the form values and pass to the product constructor
    document.getElementById("_id").value,
    document.getElementById("category_id").value,
    document.getElementById("product_name").value,
    document.getElementById("product_description").value,
    document.getElementById("product_stock").value,
    document.getElementById("product_price").value
  );
}; //end function

//called when form is submitted
let addOrUpdateProduct = async () => {
  //url for api call
  const url = `${BASE_URL}/products`;

  //new product = POST OR PUT
  let httpMethod = "POST";
  //get the product from data
  const formProduct = getProductForm();

  //log to the browser console
  console.log("%cNew Product: ", "color: green", formProduct);

  //check if its a new or update
  //only existing products have formProduct_id > 0
  //as new products have an id of 0 until they are saved to the database

  if (formProduct._id > 0) {
    httpMethod = "PUT";
  }

  //build the request object - note: POST
  //reqBodyJson added to the req body
  const request = {
    method: httpMethod,
    headers: HTTP_REQ_HEADERS,
    credentials: "include",
    mode: "cors",
    //convert JS Object to Json and add to request body
    body: JSON.stringify(formProduct),
  };

  try {
    const response = await fetch(url, request);
    const json = await response.json();

    //out put the response to the console for testing purposes
    console.log(json);
  } catch (err) {
    console.log(err);
    return err;
  }

  //refresh the products list
  loadProducts();
}; //end function

/// Delete product by id using an HTTP DELETE request
let deleteProduct = async (id) => {
  // url for delete product endpoint
  const url = `${BASE_URL}/products/${id}`;

  // Build the request object
  const request = {
    method: "DELETE",
    headers: HTTP_REQ_HEADERS,
    credentials: "include",
    mode: "cors",
  };

  // Confirm delete
  if (confirm(`Are you sure?`)) {
    try {
      // call the api and get a result
      const result = await fetch(url, request);
      const response = await result.json();

      if (response == true)
        // if success (true result), refresh products list
        loadProducts();

      // catch and log any errors
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}; // End Function

// When this script is loaded, get things started by calling loadProducts()
loadProducts();
