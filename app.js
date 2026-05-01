/* =========================================================
   SunCart - app.js
   Pure JavaScript SPA (3-file project)
   Works with your index.html + style.css
========================================================= */

/* ---------------------------
   PRODUCT DATA (6+ items)
---------------------------- */
const products = [
  {
    id: 1,
    name: "UV Protection Sunglasses",
    brand: "SunShade",
    price: 15,
    rating: 4.7,
    stock: 10,
    description:
      "Stylish UV protection sunglasses perfect for beach trips, city walks and bright sunny days. Lightweight frame with premium comfort.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&q=80",
    category: "Accessories",
  },


//   {
//     id: 2,
//     name: "Aloe Vera Sunscreen SPF 50",
//     brand: "GlowNature",
//     price: 18,
//     rating: 4.8,
//     stock: 22,
//     description:
//       "Hydrating sunscreen with aloe vera and broad spectrum SPF 50 protection. Keeps skin fresh and safe from UV rays.",
//     image:
//       "https://images.unsplash.com/photo-1556228578-ddf9b0d1b0c5?w=900&q=80",
//     category: "Skincare",
//   }




{
  id: 2,
  name: "Aloe Vera Sunscreen SPF 50",
  brand: "GlowNature",
  price: 18,
  rating: 4.8,
  stock: 22,
  description:
    "Hydrating sunscreen with aloe vera and broad spectrum SPF 50 protection. Keeps skin fresh and safe from UV rays.",
    
  /* UPDATED IMAGE */
  image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=80",

  category: "Skincare",
}
  ,



  {
    id: 3,
    name: "Beach Straw Hat",
    brand: "WaveCo",
    price: 12,
    rating: 4.5,
    stock: 16,
    description:
      "Wide brim beach hat for stylish summer protection. Perfect for vacations and outdoor adventures.",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80",
    category: "Accessories",
  },
  {
    id: 4,
    name: "Summer Cotton Shirt",
    brand: "BreezeWear",
    price: 24,
    rating: 4.6,
    stock: 14,
    description:
      "Soft breathable cotton shirt designed for warm weather. Premium stitching with relaxed fit.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=900&q=80",
    category: "Clothing",
  },
  {
    id: 5,
    name: "Beach Sandals",
    brand: "WaveCo",
    price: 20,
    rating: 4.4,
    stock: 19,
    description:
      "Comfortable anti-slip sandals made for sand, poolside and summer movement.",
    image:
      "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?w=900&q=80",
    category: "Footwear",
  },
  {
    id: 6,
    name: "Inflatable Beach Ball Set",
    brand: "WaveCo",
    price: 10,
    rating: 4.3,
    stock: 25,
    description:
      "Fun colorful beach ball set for parties, family fun and summer games.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
    category: "Beach",
  },
];

/* ---------------------------
   STORAGE HELPERS
---------------------------- */
function getUsers() {
  return JSON.parse(localStorage.getItem("suncart_users")) || [];
}

function saveUsers(data) {
  localStorage.setItem("suncart_users", JSON.stringify(data));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("suncart_current_user")) || null;
}

function setCurrentUser(user) {
  localStorage.setItem("suncart_current_user", JSON.stringify(user));
}

function logoutStorage() {
  localStorage.removeItem("suncart_current_user");
}

/* ---------------------------
   GLOBAL STATE
---------------------------- */
let currentSlide = 0;
let redirectAfterLogin = null;

/* ---------------------------
   TOAST
---------------------------- */
function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 2600);
}

/* ---------------------------
   PAGE NAVIGATION
---------------------------- */
function navigate(page) {
  const protectedPages = ["profile", "update"];

  if (page === "detail") return;

  if (protectedPages.includes(page) && !getCurrentUser()) {
    redirectAfterLogin = page;
    showToast("Please login first", "error");
    page = "login";
  }

  document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));

  const target = document.getElementById(`page-${page}`);
  if (target) target.style.display = "block";

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.dataset.page === page) link.classList.add("active");
  });

  if (page === "profile") renderProfile();
  if (page === "update") loadUpdateForm();

  closeMobile();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------------------------
   NAVBAR UI
---------------------------- */
function updateNavbar() {
  const user = getCurrentUser();

  const authButtons = document.getElementById("authButtons");
  const userMenu = document.getElementById("userMenu");
  const profileNav = document.getElementById("profileNavLink");
  const mobileProfile = document.getElementById("mobileProfile");
  const mobileAuth = document.getElementById("mobileAuth");
  const mobileLogout = document.getElementById("mobileLogout");

  if (user) {
    authButtons.style.display = "none";
    userMenu.style.display = "block";
    profileNav.style.display = "inline-block";
    mobileProfile.style.display = "block";
    mobileAuth.style.display = "none";
    mobileLogout.style.display = "block";

    document.getElementById("navAvatar").src =
      user.photo ||
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    document.getElementById("navUserName").textContent = user.name;
  } else {
    authButtons.style.display = "flex";
    userMenu.style.display = "none";
    profileNav.style.display = "none";
    mobileProfile.style.display = "none";
    mobileAuth.style.display = "block";
    mobileLogout.style.display = "none";
  }
}

/* ---------------------------
   PRODUCT CARD
---------------------------- */
function productCard(product) {
  const oldPrice = (product.price + 8).toFixed(0);

  return `
  <div class="product-card">
    <div class="product-img-wrap">
      <img src="${product.image}" alt="${product.name}">
      <span class="product-category">${product.category}</span>
      <span class="product-badge">HOT</span>
    </div>
    <div class="product-info">
      <h3>${product.name}</h3>
      <div class="product-brand">${product.brand}</div>
      <div class="product-meta">
        <div class="rating">
          <span class="stars">★</span> ${product.rating}
        </div>
        <div class="price">$${product.price}
          <span>$${oldPrice}</span>
        </div>
      </div>
      <button class="btn-view" onclick="viewDetails(${product.id})">
        View Details →
      </button>
    </div>
  </div>
  `;
}

/* ---------------------------
   RENDER PRODUCTS
---------------------------- */
function renderPopular() {
  const grid = document.getElementById("popularGrid");
  grid.innerHTML = products.slice(0, 3).map(productCard).join("");
}

function renderAllProducts(list = products) {
  const grid = document.getElementById("allProductsGrid");
  grid.innerHTML = list.map(productCard).join("");
}

function filterProducts(category, btn) {
  document.querySelectorAll(".filter-btn").forEach((b) =>
    b.classList.remove("active")
  );
  btn.classList.add("active");

  if (category === "All") renderAllProducts(products);
  else renderAllProducts(products.filter((p) => p.category === category));
}

/* ---------------------------
   PRODUCT DETAILS (PROTECTED)
---------------------------- */
function viewDetails(id) {
  if (!getCurrentUser()) {
    redirectAfterLogin = { detailId: id };
    showToast("Login required for product details", "error");
    navigate("login");
    return;
  }

  const product = products.find((p) => p.id === id);
  if (!product) return;

  document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));
  document.getElementById("page-detail").style.display = "block";

  const box = document.getElementById("detailContent");

  box.innerHTML = `
    <div class="detail-img-wrap">
      <img src="${product.image}" alt="${product.name}">
    </div>

    <div class="detail-info">
      <span class="detail-category">${product.category}</span>
      <h1>${product.name}</h1>
      <div class="detail-brand">Brand: ${product.brand}</div>

      <div class="detail-rating">
        <span class="stars">★★★★★</span>
        <span>${product.rating} / 5</span>
      </div>

      <div class="detail-price">
        $${product.price}
        <span class="orig">$${product.price + 10}</span>
      </div>

      <p class="detail-desc">${product.description}</p>

      <div class="detail-stock">
        <span class="stock-dot"></span>
        ${product.stock} items in stock
      </div>

      <div class="detail-actions">
        <button class="btn-add-cart" onclick="buyNow('${product.name}')">
          Buy Now
        </button>

        <button class="btn-wishlist" onclick="wishlist()">
          ♡
        </button>
      </div>
    </div>
  `;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buyNow(name) {
  showToast(`${name} ordered successfully!`);
}

function wishlist() {
  showToast("Added to wishlist!");
}

/* ---------------------------
   AUTH SYSTEM
---------------------------- */
function handleRegister() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const photo = document.getElementById("regPhoto").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  const error = document.getElementById("registerError");

  if (!name || !email || !password) {
    error.style.display = "block";
    error.textContent = "Please fill all required fields.";
    return;
  }

  if (password.length < 6) {
    error.style.display = "block";
    error.textContent = "Password must be at least 6 characters.";
    return;
  }

  let users = getUsers();

  if (users.find((u) => u.email === email)) {
    error.style.display = "block";
    error.textContent = "Email already registered.";
    return;
  }

  users.push({
    name,
    email,
    photo:
      photo ||
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    password,
  });

  saveUsers(users);
  showToast("Registration successful!");
  navigate("login");
}

function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value.trim();

  const error = document.getElementById("loginError");

  const users = getUsers();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    error.style.display = "block";
    error.textContent = "Invalid email or password.";
    return;
  }

  setCurrentUser(user);
  updateNavbar();
  showToast("Login successful!");

  if (redirectAfterLogin) {
    if (typeof redirectAfterLogin === "string") {
      navigate(redirectAfterLogin);
    } else if (redirectAfterLogin.detailId) {
      viewDetails(redirectAfterLogin.detailId);
    }
    redirectAfterLogin = null;
  } else {
    navigate("home");
  }
}

/* fake google login */
function handleGoogleAuth() {
  const googleUser = {
    name: "Google User",
    email: "googleuser@gmail.com",
    photo:
      "https://cdn-icons-png.flaticon.com/512/300/300221.png",
    password: "",
  };

  setCurrentUser(googleUser);
  updateNavbar();
  showToast("Google Login Successful!");
  navigate("home");
}

/* ---------------------------
   PROFILE
---------------------------- */
function renderProfile() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById("profileAvatar").src = user.photo;
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileEmail").textContent = user.email;
}

function loadUpdateForm() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById("updateName").value = user.name;
  document.getElementById("updatePhoto").value = user.photo;

  previewImage(user.photo);
}

function handleUpdate() {
  let user = getCurrentUser();
  if (!user) return;

  const newName = document.getElementById("updateName").value.trim();
  const newPhoto = document.getElementById("updatePhoto").value.trim();

  user.name = newName || user.name;
  user.photo = newPhoto || user.photo;

  setCurrentUser(user);

  let users = getUsers();
  users = users.map((u) =>
    u.email === user.email ? user : u
  );
  saveUsers(users);

  updateNavbar();
  showToast("Profile updated!");
  navigate("profile");
}

function logout() {
  logoutStorage();
  updateNavbar();
  showToast("Logged out", "success");
  navigate("home");
}

/* ---------------------------
   UPDATE PREVIEW
---------------------------- */
function previewImage(url) {
  const box = document.getElementById("updatePreview");
  const img = document.getElementById("previewImg");

  if (url) {
    box.style.display = "block";
    img.src = url;
  } else {
    box.style.display = "none";
  }
}

/* ---------------------------
   MOBILE MENU
---------------------------- */
function toggleMobileMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

function closeMobile() {
  document.getElementById("mobileMenu").classList.remove("open");
}

/* ---------------------------
   USER DROPDOWN
---------------------------- */
function toggleUserDropdown() {
  document.getElementById("userDropdown").classList.toggle("open");
}

function closeDropdown() {
  document.getElementById("userDropdown").classList.remove("open");
}

/* ---------------------------
   HERO SLIDER
---------------------------- */
function showSlide(index) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".dot");

  if (index >= slides.length) index = 0;
  if (index < 0) index = slides.length - 1;

  slides.forEach((s) => s.classList.remove("active"));
  dots.forEach((d) => d.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index].classList.add("active");

  currentSlide = index;
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function goToSlide(i) {
  showSlide(i);
}

setInterval(nextSlide, 5000);

/* ---------------------------
   EXTRA UI
---------------------------- */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 20) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

/* live preview photo input */
document.addEventListener("input", (e) => {
  if (e.target.id === "updatePhoto") {
    previewImage(e.target.value);
  }
});

/* click outside dropdown */
document.addEventListener("click", (e) => {
  const menu = document.getElementById("userMenu");
  if (menu && !menu.contains(e.target)) closeDropdown();
});

/* ---------------------------
   INIT APP
---------------------------- */
function init() {
  renderPopular();
  renderAllProducts();
  updateNavbar();
  navigate("home");
}

init();