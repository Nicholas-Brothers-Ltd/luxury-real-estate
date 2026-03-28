// Get property ID from URL
const params = new URLSearchParams(window.location.search);
const propertyId = parseInt(params.get("id"));

// Find property
const property = properties.find(p => p.id === propertyId);

if (property) {
  // HERO IMAGE
  const hero = document.getElementById("propertyHero");
  hero.style.backgroundImage = `url(${property.image})`;

  // FORMAT PRICE
  const formattedPrice = `$${(property.price / 1000000).toFixed(1)}M`;

  // HERO TEXT
  document.getElementById("propertyTitle").textContent = property.title;
  document.getElementById("propertyPrice").textContent = formattedPrice;
  document.getElementById("propertyLocation").textContent = property.location;

  // DESCRIPTION
  document.getElementById("propertyDescription").textContent = property.description;

  // MAP
  const map = document.getElementById("mapFrame");
  if (map) {
    map.src = `https://maps.google.com/maps?q=${property.location}&output=embed`;
  }

} else {
  document.body.innerHTML = "<h1 style='padding:40px'>Property not found</h1>";
}