// GET ID FROM URL
const params = new URLSearchParams(window.location.search);
const propertyId = params.get("id");

// LOAD PROPERTY FROM BACKEND
async function loadProperty() {
  try {
    const res = await fetch(`/api/properties/${propertyId}`);
    const property = await res.json();

    console.log("Loaded property:", property);

    // HERO IMAGE
    const hero = document.getElementById("propertyHero");
    if (hero) {
      hero.style.backgroundImage = `url(${property.image})`;
      hero.style.backgroundSize = "cover";
      hero.style.backgroundPosition = "center";
    }

    // FORMAT PRICE
    const formattedPrice = `$${(property.price / 1000000).toFixed(1)}M`;

    // TEXT
    document.getElementById("propertyTitle").textContent = property.title;
    document.getElementById("propertyPrice").textContent = formattedPrice;
    document.getElementById("propertyLocation").textContent = property.location;
    document.getElementById("propertyDescription").textContent = property.description;

    // MAP
    const map = document.getElementById("mapFrame");
    if (map) {
      map.src = `https://maps.google.com/maps?q=${property.location}&output=embed`;
    }

  } catch (err) {
    console.error("Failed to load property:", err);
  }
}

loadProperty();