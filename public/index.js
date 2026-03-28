// ==========================
// GLOBAL DATA (FROM BACKEND)
// ==========================
let properties = [];


// ==========================
// LOAD DATA FROM BACKEND
// ==========================
async function loadProperties() {
  try {
    const res = await fetch("/api/properties");
    console.log("Response:", res);   // 👈 ADD
    const data = await res.json();

    console.log("Loaded data:", data); // 👈 ADD

    properties = data;

    populateLocations();
    renderAllProperties();
    setHeroImage();

  } catch (err) {
    console.error("Failed to load properties:", err);
  }
}


// ==========================
// 1. POPULATE LOCATIONS
// ==========================
function populateLocations() {
  const dropdown = document.getElementById("locationFilter");
  if (!dropdown) return;

  dropdown.innerHTML = `<option>Location</option>`; // reset

  const locationSet = new Set(properties.map(p => p.location));

  locationSet.forEach(loc => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    dropdown.appendChild(option);
  });
}


// ==========================
// 2. RENDER ALL PROPERTIES
// ==========================
function renderAllProperties() {
  const buyContainer = document.querySelector(".buy-grid");
  const rentContainer = document.querySelector(".rent-grid");

  if (!buyContainer || !rentContainer) return;

  let buyHTML = "";
  let rentHTML = "";

  properties.forEach(property => {
    const formattedPrice = `$${(property.price / 1000000).toFixed(1)}M`;

    const card = `
      <a href="property.html?id=${property.id}" class="property-link">
        <div class="card">
          <img src="${property.image}">
          <div class="card-info">
            <h4>${property.title}</h4>
            <p>${formattedPrice}</p>
          </div>
        </div>
      </a>
    `;

    if (property.category === "buy") buyHTML += card;
    if (property.category === "rent") rentHTML += card;
  });

  buyContainer.innerHTML = buyHTML;
  rentContainer.innerHTML = rentHTML;
}


// ==========================
// 3. FILTER PROPERTIES
// ==========================
function filterProperties() {
  const location = document.getElementById("locationFilter").value;
  const type = document.getElementById("typeFilter").value;
  const priceRange = document.getElementById("priceFilter").value;
  const sort = document.getElementById("sortFilter").value;

  const buyContainer = document.querySelector(".buy-grid");
  const rentContainer = document.querySelector(".rent-grid");

  if (!buyContainer || !rentContainer) return;

  let filtered = properties.filter(p => {

    const locationMatch =
      location === "Location" ||
      p.location?.toLowerCase().includes(location.toLowerCase().trim());

    const typeMatch =
      type === "Property Type" ||
      p.type?.toLowerCase().includes(type.toLowerCase().trim());

    let priceMatch = true;

    if (priceRange !== "Price Range") {
      const [min, max] = priceRange.split("-").map(Number);
      priceMatch = p.price >= min && p.price <= max;
    }

    return locationMatch && typeMatch && priceMatch;
  });

  // SORTING
  if (sort === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high-low") filtered.sort((a, b) => b.price - a.price);

  console.log("Filtered results:", filtered);

  // RESULTS INFO
  const resultsInfo = document.getElementById("resultsInfo");
  if (resultsInfo) {
    const count = filtered.length;
    const locationText = location === "Location" ? "All Locations" : location;

    resultsInfo.textContent =
      count === 0
        ? `No luxury properties found in ${locationText}`
        : `${count} luxury properties found in ${locationText}`;
  }

  // RENDER
  let buyHTML = "";
  let rentHTML = "";

  filtered.forEach(property => {
    const formattedPrice = `$${(property.price / 1000000).toFixed(1)}M`;

    const card = `
      <a href="property.html?id=${property.id}" class="property-link">
        <div class="card">
          <img src="${property.image}">
          <div class="card-info">
            <h4>${property.title}</h4>
            <p>${formattedPrice}</p>
          </div>
        </div>
      </a>
    `;

    if (property.category === "buy") buyHTML += card;
    if (property.category === "rent") rentHTML += card;
  });

  if (filtered.length === 0) {
    buyContainer.innerHTML = "<p style='text-align:center'>No properties found</p>";
    rentContainer.innerHTML = "";
  } else {
    buyContainer.innerHTML = buyHTML;
    rentContainer.innerHTML = rentHTML;
  }

  // SCROLL
  const browseSection = document.getElementById("browse");
  if (browseSection) {
    browseSection.scrollIntoView({ behavior: "smooth" });
  }
}


// ==========================
// 4. HERO IMAGE ROTATION
// ==========================
function setHeroImage() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const images = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde"
  ];

  let index = 0;
  setInterval(() => {
    hero.style.backgroundImage = `url(${images[index]})`;
    index = (index + 1) % images.length;
  }, 5000);
}


// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  loadProperties();

  document.getElementById("locationFilter")?.addEventListener("change", filterProperties);
  document.getElementById("typeFilter")?.addEventListener("change", filterProperties);
  document.getElementById("priceFilter")?.addEventListener("change", filterProperties);
  document.getElementById("sortFilter")?.addEventListener("change", filterProperties);

  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", filterProperties);
  }
});