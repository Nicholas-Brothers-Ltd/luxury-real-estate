function unlock() {
  document.getElementById("gate").classList.add("hidden");
  document.getElementById("content").classList.remove("hidden");
}

function contact() {
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}