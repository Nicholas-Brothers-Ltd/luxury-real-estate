/**
 * 1. POPULATE LOCATIONS
 * Dynamically fills the location dropdown based on the unique locations in the properties data.
 */
function populateLocations() {
  const dropdown = document.getElementById("locationFilter");
  
  if (!dropdown) return;

  // Create a unique set of locations from the properties array
  const locationSet = new Set(properties.map(p => p.location));

  locationSet.forEach(loc => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    dropdown.appendChild(option);
  });
}

/**
 * 2. FILTER AND RENDER PROPERTIES
 * Handles the logic for filtering and updating the UI containers.
 */
function filterProperties() {
  const location = document.getElementById("locationFilter").value;
  const type = document.getElementById("typeFilter").value;

  const buyContainer = document.querySelector(".buy-grid");
  const rentContainer = document.querySelector(".rent-grid");

  if (!buyContainer || !rentContainer) return;

  // CLEAR EXISTING RESULTS
  buyContainer.innerHTML = "";
  rentContainer.innerHTML = "";

  const filtered = properties.filter(p => {
    const locationMatch =
      location === "Location" ||
      p.location.toLowerCase().trim() === location.toLowerCase().trim();

    const typeMatch =
      type === "Property Type" ||
      p.type.toLowerCase().trim() === type.toLowerCase().trim();

    return locationMatch && typeMatch;
  });

  // RENDER RESULTS
  filtered.forEach(property => {
    const card = `
      <a href="property.html?id=${property.id}" class="property-link">
        <div class="card">
          <img src="${property.image}" alt="${property.title}">
          <div class="card-info">
            <h4>${property.title}</h4>
            <p>$${property.price.toLocaleString()}</p>
          </div>
        </div>
      </a>
    `;

    // Show all results in the buyContainer
    buyContainer.innerHTML += card;
  });

  // NO RESULTS MESSAGE
  if (filtered.length === 0) {
    buyContainer.innerHTML = "<p style='color:white'>No properties found</p>";
  }
}

/**
 * 3. INITIALIZATION & EVENT LISTENERS
 */
// Run on script load
populateLocations();
filterProperties();

// Attach event listener to the Search Button
const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
  searchBtn.addEventListener("click", filterProperties);
}