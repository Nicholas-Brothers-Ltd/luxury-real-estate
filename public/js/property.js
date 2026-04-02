import { supabase } from './supabaseClient.js';

const sampleProperties = [
  {
    id: '1',
    title: 'Villa Serenita',
    price: 12500000,
    location: 'Aspen, Colorado',
    type: 'Villa',
    category: 'Buy',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1400&q=80',
    description: 'A luxury villa with panoramic mountain views, expansive glass walls, and modern interiors designed for refined living.',
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];

function getMapEmbedUrl(location) {
  const query = encodeURIComponent(location);
  return `https://maps.google.com/maps?q=${query}&output=embed`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function renderProperty(p) {
  document.getElementById('property-title').textContent = p.title;
  document.getElementById('property-price').textContent = formatCurrency(p.price);
  document.getElementById('property-location').textContent = p.location;
  document.getElementById('property-description').textContent = p.description;
  document.getElementById('property-image').src = p.image;
  document.getElementById('sidebar-price').textContent = formatCurrency(p.price);
  document.getElementById('sidebar-location').textContent = p.location;
  document.getElementById('sidebar-type').textContent = p.type;
  document.getElementById('sidebar-category').textContent = p.category;
  document.getElementById('property-map').src = getMapEmbedUrl(p.location);

  const galleryImages = document.querySelectorAll('.gallery-grid img');
  if (galleryImages.length && Array.isArray(p.gallery)) {
    galleryImages.forEach((img, index) => {
      img.src = p.gallery[index] || p.image;
      img.alt = `${p.title} view ${index + 1}`;
    });
  }
}

async function loadProperty() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    renderProperty(sampleProperties[0]);
    return;
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.warn('Falling back to sample property:', error ? error.message : 'no property found');
    renderProperty(sampleProperties[0]);
    return;
  }

  const formattedProperty = {
    ...data,
    location: data.location || 'Premium Location',
    type: data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Residence',
    category: data.category ? data.category.charAt(0).toUpperCase() + data.category.slice(1) : 'Buy',
    gallery: [data.image || sampleProperties[0].image, sampleProperties[0].gallery[1], sampleProperties[0].gallery[2]]
  };

  renderProperty(formattedProperty);
}

document.addEventListener('DOMContentLoaded', loadProperty);
