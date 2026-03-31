import { supabase } from './js/supabaseClient.js';

const propertyTableBody = document.querySelector('#property-table tbody');
const totalListings = document.getElementById('total-listings');
const recentListings = document.getElementById('recent-listings');
const adminForm = document.getElementById('admin-form');

let properties = [];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function renderProperties(data) {
  properties = data || [];
  propertyTableBody.innerHTML = '';

  properties.forEach(property => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${property.title}</td>
      <td>${property.location}</td>
      <td>${formatCurrency(property.price)}</td>
      <td>${property.type || '-'}</td>
      <td>${property.category || '-'}</td>
      <td><button class="delete-button" data-id="${property.id}">Delete</button></td>
    `;
    propertyTableBody.appendChild(row);
  });

  totalListings.textContent = properties.length;
  recentListings.textContent = properties.slice(0, 3).length;
}

async function loadProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error loading listings:', error);
    renderProperties([]);
    return;
  }

  renderProperties(data);
}

async function publishProperty(event) {
  event.preventDefault();

  const title = document.getElementById('admin-title').value.trim();
  const location = document.getElementById('admin-location').value.trim();
  const type = document.getElementById('admin-type').value.trim();
  const category = document.getElementById('admin-category').value;
  const price = parseFloat(document.getElementById('admin-price').value);
  const image = document.getElementById('admin-image').value.trim();
  const description = document.getElementById('admin-description').value.trim();

  if (!title || !location || !type || !category || !price || !image || !description) {
    alert('Please complete every field before publishing.');
    return;
  }

  const newProperty = {
    title,
    location,
    type,
    category,
    price,
    image,
    description
  };

  const { data, error } = await supabase
    .from('properties')
    .insert([newProperty]);

  if (error) {
    alert('Failed to publish listing: ' + error.message);
    return;
  }

  adminForm.reset();
  loadProperties();
  alert('Listing published successfully.');
}

async function deleteProperty(id) {
  const confirmed = confirm('Delete this listing permanently?');
  if (!confirmed) return;

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Unable to delete listing: ' + error.message);
    return;
  }

  loadProperties();
}

document.addEventListener('DOMContentLoaded', () => {
  loadProperties();

  if (adminForm) {
    adminForm.addEventListener('submit', publishProperty);
  }

  propertyTableBody.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('.delete-button')) {
      const id = target.dataset.id;
      deleteProperty(id);
    }
  });
});
