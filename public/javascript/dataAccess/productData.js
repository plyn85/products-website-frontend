//
//  Functions used to work with products and categories
//

// import everything from fetchAPI.js
// This will allow resources to be referenced as api.BASE_URL, etc.
import * as api from "./fetchAPI.js";

//
// Get all products
let getProducts = async () => {
  try {
    // get products data - note only one parameter in function call
    return await api.getDataAsync(`${api.BASE_URL}/products`);
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
}; // End Functions

// Get a single product by id
let getProductById = async (id) => {
  try {
    // get products data - note only one parameter in function call
    return await api.getDataAsync(`${api.BASE_URL}/products/${id}`);
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
}; // End Functions

//
// Get all categories
let getCategories = async () => {
  try {
    // get category data - note only one parameter in function call
    return await api.getDataAsync(`${api.BASE_URL}/categories`);
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
}; // End Functions

// Get products in a category
let getProductsByCategory = async (id) => {
  let products;
  try {
    // call the API enpoint which retrieves products by category (id)
    products = await api.getDataAsync(`${api.BASE_URL}/products/cat/${id}`);
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
  return products;
}; // End Functions

// Called when add product form is submitted
let createOrUpdate = async (product) => {
  // url for api call
  const url = `${api.BASE_URL}/products`;
  // New product = POST, Update = PUT or PATCH
  let httpMethod = "POST";

  // log to console
  console.log("%c Create or Update Product: ", "color: green", product);

  // Check if new product or update
  // Only existing products have formProduct._id > 0
  if (product._id > 0) {
    httpMethod = "PUT";
  }

  // build the request object - note: POST
  // reqBodyJson added to the req body
  const request = api.fetchInit(httpMethod, JSON.stringify(product));

  try {
    // Call fetch and await the response
    // fetch url using request object
    const response = await api.getDataAsync(url, request);
    const json = await response.json();

    // Output result to console (for testing purposes)
    console.log(json);
    return true;
    // catch and log any errors
  } catch (err) {
    console.log(err);
    return err;
  }
  return false;
}; // End function

//
// Delete product by id using an HTTP DELETE request
let deleteProductById = async (id) => {
  // url for delete product endpoint
  const url = `${api.BASE_URL}/products/${id}`;

  // Build the request object
  const request = api.fetchInit("DELETE");

  // Confirm delete
  if (confirm("Are you sure?")) {
    try {
      // call the api and get a result
      return await api.getDataAsync(url, request);
      // catch and log any errors
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}; // End Function

export {
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategories,
  createOrUpdate,
  deleteProductById,
};
