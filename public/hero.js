const hero = document.getElementById("hero");

const images = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  "https://images.unsplash.com/photo-1600585152915-d208bec867a1"
];

let index = 0;

function changeBackground() {
  hero.style.backgroundImage = `url(${images[index]})`;
  index = (index + 1) % images.length;
}

// initial load
changeBackground();

// change every 10 seconds
setInterval(changeBackground, 10000);
function toggleSearch() {
  const bar = document.getElementById("searchBar");
  bar.classList.toggle("hidden");
}