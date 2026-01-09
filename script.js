const title = document.getElementById("title");
const price = document.getElementById("price");
const desc = document.getElementById("desc");
const categories = document.getElementById("categories");
const image = document.getElementById("img_url");
const API_URL = "https://api.escuelajs.co";

let isEdit = null;
async function saveProduct(event) {
  event.preventDefault();
  if (isEdit) {
    updateProduct(event);
  } else {
    createProduct(event);
  }
}
async function updateProduct(event) {
  event.preventDefault();
  try {
    const payload = {
      title: title.value,
      price: price.value,
      categoryId: categories.value,
      description: desc.value,
      images: [image.value],
    };
    console.log("Payload", payload);
    const res = await fetch(`${API_URL}/api/v1/products/${isEdit}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log("respone:", data);
    event.target.reset();
    alert("Product Update Succesfully...");
    getProduct();
  } catch (error) {
    console.log("API ERROR: ", error);
  }
}

async function getProduct() {
  try {
    const res = await fetch(`${API_URL}/api/v1/products`);
    const product = await res.json();
    console.log("My Data:", product);
    render(product);
  } catch (error) {
    console.log("API ERROR", error);
  }
}

// Filter
function handleFilter(categoryId){
  if(categoryId===""){
    getProduct();
  }
  else{
    filterProductById(categoryId);
  }
}
async function filterProductById(categoryId) {
  try {
    const res = await fetch(`${API_URL}/api/v1/categories/${categoryId}/products`);
    const product = await res.json();
    console.log("My Data:", product);
    render(product);
  } catch (error) {
    console.log("API ERROR", error);
  }
}

const filerSelect = document.getElementById("filter_select")
async function getAllCategory_filter() {
  const res = await fetch(`${API_URL}/api/v1/categories?offset=1&limit=7`);
  const data = await res.json();
  console.log("Categories");
  console.table(data);
  filerSelect.innerHTML = `
                    <option  value="">FILTER <svg class="w-2.5 h-2.5 ms-2.5" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 4 4 4-4" />
                    </svg></option>
  `;
  data.forEach((category) => {
    filerSelect.innerHTML += `
  <option value="${category.id}">${category.name.toUpperCase()}</option>
  `;
  });
}
// Filter

const tableBody = document.getElementById("tableBody");
function render(product) {
  tableBody.innerHTML = "";
  product.forEach((product) => {
    tableBody.innerHTML += `

          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4">${product.id}</td>
            <td class="px-6 py-4 font-medium text-gray-900">${product.title}</td>
            <td class="px-6 py-4 font-medium text-gray-900">${product.description}</td>
            <td class=" px-6 py-4 font-medium text-gray-900"><span class="
    px-3 py-1 rounded text-sm
    bg-blue-100 text-blue-700
  ">
    ${product.category.name}
  </span> </td>
            <td class="px-6 py-4 truncate max-w-xs">${product.price} $</td>
            <td class="px-6 py-4 flex gap-2">
              <button class="text-blue-600 hover:underline" onclick="getProductById(${product.id})">Edit</button>
              <button class="text-red-600 hover:underline"  onclick="deleteProduct(${product.id})">Delete</button>
            </td>
          </tr>
    `;
  });
}

async function getAllCategory() {
  const res = await fetch(`${API_URL}/api/v1/categories?offset=1&limit=7`);
  const data = await res.json();
  console.log("Categories");
  console.table(data);
  categories.innerHTML = `
  <option value="">Select Category</option>
  `;
  data.forEach((category) => {
    categories.innerHTML += `
  <option value="${category.id}">${category.name}</option>
  `;
  });
}

const deleteProduct = async (productId) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${productId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log("Product deleted: ", data);
    getProduct();
  } catch (error) {
    console.log("API ERROR", error);
  }
};

async function getProductById(productId) {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${productId}`);
    const product = await res.json();
    console.log("Product:", product);

    title.value = product.title;
    price.value = product.price;
    categories.value = product.category.id;
    desc.value = product.description;
    image.value = product.images;

    isEdit = productId;
  } catch (error) {
    console.log("API ERROR: ", error);
  }
}

async function createProduct(event) {
  event.preventDefault();
  try {
    const payload = {
      title: title.value,
      price: price.value,
      categoryId: categories.value,
      description: desc.value,
      images: [image.value],
    };
    console.log("Payload", payload);
    const res = await fetch(`${API_URL}/api/v1/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log("respone:", data);
    event.target.reset();
    alert("Product Create Succesfully...");
    getProduct();
  } catch (error) {
    console.log("API ERROR: ", error);
  }
}
getProduct();
getAllCategory();
getAllCategory_filter()
