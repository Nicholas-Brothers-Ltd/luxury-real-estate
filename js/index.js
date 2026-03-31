import { supabase } from './supabaseClient.js';

let properties = [];
let filteredProperties = [];

const sampleProperties = [
  {
    id: 1,
    title: 'Villa Serenita',
    price: 12500000,
    location: 'Aspen',
    type: 'villa',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80',
    description: 'A secluded estate with panoramic mountain views.',
    category: 'buy'
  },
  {
    id: 2,
    title: 'Ocean Breeze Apartment',
    price: 3500000,
    location: 'Miami',
    type: 'apartment',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    description: 'Luxury waterfront apartment with resort amenities.',
    category: 'buy'
  },
  {
    id: 3,
    title: 'City Loft',
    price: 220000,
    location: 'New York',
    type: 'loft',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'A refined downtown loft with expansive city views.',
    category: 'buy'
  },
  {
    id: 4,
    title: 'Heron Bay Estate',
    price: 8500000,
    location: 'Kilimani',
    type: 'estate',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    description: 'Timeless design set in a premiere neighborhood.',
    category: 'buy'
  }
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function getPriceRange(value) {
  if (!value) return null;
  const [min, max] = value.split('-').map(Number);
  return { min, max };
}

async function loadProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*');

  if (error || !Array.isArray(data) || data.length === 0) {
    console.warn('Using fallback property data:', error ? error.message : 'no data');
    properties = sampleProperties;
  } else {
    properties = data;
  }

  filteredProperties = [...properties];
  renderAllProperties(properties);
  updateSummarySection(properties.length, '', '', 'Any Price');
}

function renderAllProperties() {
  const container = document.getElementById("property-list");
  container.innerHTML = "";

  properties.forEach(p => {
    const card = document.createElement("div");
    card.className = "property-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.location} — $${p.price}</p>
      <a href="property.html?id=${p.id}">View Details</a>
    `;
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadProperties();

  document.getElementById("sortFilter")?.addEventListener("change", filterProperties);

  const searchBtn = document.getElementById("search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", filterProperties);
  }

  const form = document.getElementById("list-property-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newProperty = {
        title: document.getElementById("prop-title").value,
        price: parseFloat(document.getElementById("prop-price").value),
        location: document.getElementById("prop-location").value,
        type: document.getElementById("prop-type").value,
        image: document.getElementById("prop-image").value,
        description: document.getElementById("prop-description").value,
        category: document.getElementById("prop-category").value
      };

      const { data, error } = await supabase
        .from("properties")
        .insert([newProperty]);

      if (error) {
        alert("Error adding property: " + error.message);
      } else {
        alert("Property listed successfully!");
        form.reset();
      }
    });
  }
});

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function getPriceRange(value) {
  if (!value) return null;
  const [min, max] = value.split('-').map(Number);
  return { min, max };
}

function renderAllProperties(list = filteredProperties) {
  const container = document.getElementById('property-list');
  container.innerHTML = '';

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No matching results found.</h3>
        <p>Try adjusting your filters to discover more exceptional homes.</p>
      </div>
    `;
    return;
  }

  list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'property-card';
      // Map property titles to their dedicated HTML files
      let detailPage = '';
      switch (p.title) {
        case 'Villa Serenita':
          detailPage = 'property-villa-serenita.html';
          break;
        case 'Ocean Breeze Apartment':
          detailPage = 'property-ocean-breeze.html';
          break;
        case 'City Loft':
          detailPage = 'property-city-loft.html';
          break;
        case 'Coastal Villas':
          detailPage = 'property-coastal-villas.html';
          break;
        default:
          detailPage = `property.html?id=${p.id}`;
      }
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <div class="property-card-content">
          <h3>${p.title}</h3>
          <p>${p.description || 'Discover a luxury property crafted for effortless living.'}</p>
          <div class="property-meta">
            <span>${p.location}</span>
            <span>${formatCurrency(p.price)}</span>
          </div>
          <a href="${detailPage}">View Details</a>
        </div>
      `;
      container.appendChild(card);
    });
}

function updateSummarySection(count, location, type, priceLabel) {
  document.getElementById('summary-count').textContent = count;
  document.getElementById('summary-location').textContent = location || 'All Locations';
  document.getElementById('summary-type').textContent = type || 'All Types';
  document.getElementById('summary-price').textContent = priceLabel || 'Any Price';

  const resultsMeta = document.getElementById('results-meta');
  if (resultsMeta) {
    resultsMeta.textContent = count === 0
      ? 'No matching homes found. Refine your search to reveal new options.'
      : `${count} premium properties available for your selected criteria.`;
  }
}

function scrollToResults() {
  const target = document.getElementById('featured');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function filterProperties() {
  const location = document.getElementById('filter-location').value;
  const type = document.getElementById('filter-type').value;
  const price = document.getElementById('filter-price').value;
  const sort = document.getElementById('filter-sort').value;

  let results = [...properties];

  if (location) {
    results = results.filter(item => item.location.toLowerCase() === location.toLowerCase());
  }

  if (type) {
    results = results.filter(item => item.type.toLowerCase() === type.toLowerCase());
  }

  const range = getPriceRange(price);
  if (range) {
    results = results.filter(item => item.price >= range.min && item.price <= range.max);
  }

  if (sort === 'low-high') {
    results.sort((a, b) => a.price - b.price);
  }
  if (sort === 'high-low') {
    results.sort((a, b) => b.price - a.price);
  }

  filteredProperties = results;
  renderAllProperties(results);

  const priceLabel = range
    ? `${formatCurrency(range.min)} - ${formatCurrency(range.max)}`
    : 'Any Price';

  updateSummarySection(results.length, location, type, priceLabel);
  scrollToResults();
}

async function loadProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*');

  if (error || !Array.isArray(data) || data.length === 0) {
    console.warn('Using fallback property data:', error ? error.message : 'no data');
    properties = sampleProperties;
  } else {
    properties = data;
  }

  filteredProperties = [...properties];
  renderAllProperties(properties);
  updateSummarySection(properties.length, '', '', 'Any Price');
}

document.addEventListener('DOMContentLoaded', () => {
  ['filter-location', 'filter-type', 'filter-price', 'filter-sort'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', filterProperties);
  });
});
