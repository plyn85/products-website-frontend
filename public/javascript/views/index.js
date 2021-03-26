//
// Function used to update index.html
//

import * as productData from "../dataAccess/productData.js";
import { Product } from "../models/products.js";

// 1. Parse JSON
// 2. Create product rows
// 3. Display in web page
let displayProducts = (products) => {
  // Use the Array map method to iterate through the array of products (in json format)
  // also returns a single product when update product view is called
  console.log("product when update products view is called: ", products);
  const rows = products.map((product) => {
    // returns a template string for each product, values are inserted using ${ }
    // <tr> is a table row and <td> a table division represents a column
    // product_price is converted to a Number value and displayed with two decimal places
    // icons - https://icons.getbootstrap.com/
    let row = `<tr>
                  <td>${product._id}</td>
                  <td>${product.product_name}</td>
                  <td>${product.product_description}</td>
                  <td>${product.product_stock}</td>
                  <td class="price">&euro;${Number(
                    product.product_price
                  ).toFixed(2)}</td>
  
                  <td><button id="${
                    product._id
                  }" class="btn btn-sm btn-outline-primary btn-update-product"
                    data-bs-toggle="modal" data-bs-target="#ProductFormDialog">
                    <span class="bi bi-pencil-square" 
                    data-toggle="tooltip" title="Edit Product">
                    </span></button>
                  </td>
  
                  <td><button id="${
                    product._id
                  }" class="btn btn-sm btn-outline-danger btn-delete-product">
                    <span class="bi bi-trash" data-toggle="tooltip" 
                      title="Delete Product"></span></button>
                  </td>
                </tr>`;

    return row;
  });
  // Set the innerHTML of the productRows root element = rows
  // join('') converts the rows array to a string, replacing the ',' delimiter with '' (blank)
  document.getElementById("productRows").innerHTML = rows.join("");

  // Add Event listners
  //
  // 1. Find button all elements with matching class name
  const updateButtons = document.getElementsByClassName("btn-update-product");
  const deleteButtons = document.getElementsByClassName("btn-delete-product");

  // 2. Assign a 'click' event listener to each button
  // Both arrays have same length so only need 1 loop
  for (let i = 0; i < updateButtons.length; i++) {
    updateButtons[i].addEventListener("click", prepareProductUpdate);
    deleteButtons[i].addEventListener("click", deleteProduct);
  }
}; // end function

// Display categories
//
let displayCategories = (categories) => {
  // use Array.map() to iterate through the list of categories
  // Returns an HTML link for each category in the array
  const catLinks = categories.map((category) => {
    // The link has an onclick handler
    // updateProductsView(id)
    // passing the category id as a parameter
    return `<a href="#" id="${category._id}"
              class="list-group-item list-group-item-action category-link"> 
              ${category.category_name}</a>`;
  });
  console.log("catlinks discat: ", catLinks);
  // use  unshift to add a 'Show all' link at the start of the array of catLinks
  //unshift adds an item to the start of an array
  // and as map returns an array adds this link to the start of the array
  catLinks.unshift(`<a href="#" id="showAllProducts"
    class="list-group-item list-group-item-action">All Products</a>`);

  // Set the innerHTML of the productRows element = the links contained in catlinks
  // .join('') converts an array to a string, replacing the , seperator with blank.
  document.getElementById("categoryList").innerHTML = catLinks.join("");

  //
  // Add Event Listners - one for each link
  const categoryLinks = document.getElementsByClassName("category-link");
  for (let i = 0; i < categoryLinks.length; i++) {
    categoryLinks[i].addEventListener("click", updateProductsView);
  }
  // Add Event Listner for all products link
  document
    .getElementById("showAllProducts")
    .addEventListener("click", loadProducts);

  //
  // *** Fill select list in product form ***
  // first get the select input by its id
  let catSelect = document.getElementById("category_id");

  // clear any exist options
  while (catSelect.firstChild) catSelect.removeChild(catSelect.firstChild);

  // Add an option for each category
  // iterate through categories adding each to the end of the options list
  // each option is made from categoryName, categoryId
  // Start with default option
  //new Option adds the name and the value in this case
  // category name as the name and category id as the value
  catSelect.add(new Option("Choose a category", "0"));
  for (let i = 0; i < categories.length; i++) {
    catSelect.add(new Option(categories[i].category_name, categories[i]._id));
  }
}; // End function displayCategories()

//
// update products list when category is selected to show only products from that category
// this.id this not work properly inside () => functions
//called by the event listener in the displayCategories function
// calls the display products function but only displays products for a
// single category as that is what is called form product data

async function updateProductsView() {
  console.log("update product view this.id :", this.id);
  const products = await productData.getProductsByCategory(this.id);
  if (products) {
    displayProducts(products);
  }
} // End function
//
// Get values from product form
// Create new Product and return
let getProductForm = () => {
  // new Product object constructed from the form values
  // Note: These should be validated!!
  return new Product(
    // read the form values and pass to the Product constructor
    document.getElementById("_id").value,
    document.getElementById("category_id").value,
    document.getElementById("product_name").value,
    document.getElementById("product_description").value,
    document.getElementById("product_stock").value,
    document.getElementById("product_price").value
  );
}; // End function

//
// Setup product form
function productFormSetup(title) {
  // reset the form and change the title
  document.getElementById("productForm").reset();
  document.getElementById("productFormTitle").innerHTML = title;

  // form reset doesn't work for hidden inputs!!
  // do this to reset previous id if set
  document.getElementById("_id").value = 0;
} // End function

//
// When a product is selected for update/ editing
// get by id and fill out the form
// this.id cannot be used inside an () => function
async function prepareProductUpdate() {
  try {
    // 1. Get product by id
    const product = await productData.getProductById(this.id);
    // 2. Set form defaults
    productFormSetup(`Update Product ID: ${product._id}`);

    // 3. Fill out the form
    document.getElementById("_id").value = product._id; // uses a hidden field - see the form
    document.getElementById("category_id").value = product.category_id;
    document.getElementById("product_name").value = product.product_name;
    document.getElementById("product_description").value =
      product.product_description;
    document.getElementById("product_stock").value = product.product_stock;
    document.getElementById("product_price").value = product.product_price;
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
} // End function

let addOrUpdateProduct = async () => {
  // Get the form data
  const formProduct = getProductForm();

  if (formProduct) {
    const result = await productData.createOrUpdate(formProduct);
    loadProducts();
  }
}; // End Function

async function deleteProduct() {
  const result = await productData.deleteProductById(this.id);
  if (result === true) {
    loadProducts();
  }
}

//
// Get all categories and products then display
let loadProducts = async () => {
  // get category data - note only one parameter in function call
  const categories = await productData.getCategories();
  //pass json data for display
  if (categories) {
    displayCategories(categories);
  }

  // get products data - note only one parameter in function call
  const products = await productData.getProducts();
  //pass json data for display
  if (products) {
    displayProducts(products);
  }

  // Add Event Listeners to the Add Product form and  save buttons
  document.getElementById("AddProductButton").addEventListener("click", () => {
    productFormSetup("Add Product");
  });
  document
    .getElementById("saveProduct")
    .addEventListener("click", addOrUpdateProduct);
}; // End function

export {
  loadProducts,
  updateProductsView,
  addOrUpdateProduct,
  prepareProductUpdate,
  productFormSetup,
  deleteProduct,
};

// When this script is loaded, get things started by calling loadProducts()
loadProducts();
//https://github.com/elee-tudublin/client-website-part5.2021-modules/blob/main/public/javascript/views/index.js
