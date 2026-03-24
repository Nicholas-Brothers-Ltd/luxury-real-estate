const container = document.querySelector(".buy-grid");

properties.forEach(property => {
  const card = `
    <a href="property.html?id=${property.id}" class="property-link">
      <div class="card">
        <img src="${property.image}">
        <div class="card-info">
          <h4>${property.title}</h4>
          <p>${property.price}</p>
        </div>
      </div>
    </a>
  `;

  container.innerHTML += card;
});