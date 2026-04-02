import { supabase } from '../../js/supabaseClient.js';

let properties = [];
let filteredProperties = [];

// Utility functions
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

// Rendering
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
    const detailPage = `property.html?id=${p.id}`;
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

// Filtering
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

// Data loading with Supabase + JSON fallback
async function loadProperties() {
  let data, error;

  try {
    const response = await supabase.from('properties').select('*');
    data = response.data;
    error = response.error;
  } catch (err) {
    error = err;
  }

  if (error || !Array.isArray(data) || data.length === 0) {
    console.warn('Supabase error, loading fallback JSON:', error ? error.message : 'no data');
    try {
      const res = await fetch('/data/properties.json');
      properties = await res.json();
    } catch (jsonErr) {
      console.error('Failed to load fallback JSON:', jsonErr);
      properties = [];
    }
  } else {
    properties = data;
  }

  filteredProperties = [...properties];
  renderAllProperties(properties);
  updateSummarySection(properties.length, '', '', 'Any Price');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadProperties();

  ['filter-location', 'filter-type', 'filter-price', 'filter-sort'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', filterProperties);
  });

  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', filterProperties);
  }

  const form = document.getElementById('list-property-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newProperty = {
        title: document.getElementById('prop-title').value,
        price: parseFloat(document.getElementById('prop-price').value),
        location: document.getElementById('prop-location').value,
        type: document.getElementById('prop-type').value,
        image: document.getElementById('prop-image').value,
        description: document.getElementById('prop-description').value,
        category: document.getElementById('prop-category').value
      };

      const { error } = await supabase
        .from('properties')
        .insert([newProperty]);

      if (error) {
        alert('Error adding property: ' + error.message);
      } else {
        alert('Property listed successfully!');
        form.reset();
      }
    });
  }
});
