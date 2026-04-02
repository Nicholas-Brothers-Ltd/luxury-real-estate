import { supabase } from './supabaseClient.js';

// Property form
document.getElementById("add-property-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const { error } = await supabase.from("properties").insert([{
    title: document.getElementById("title").value,
    price: parseFloat(document.getElementById("price").value),
    location: document.getElementById("location").value,
    type: document.getElementById("type").value,
    image: document.getElementById("image").value,
    description: document.getElementById("description").value
  }]);
  if (error) alert(error.message);
  else alert("Property added successfully!");
});

// Agent form
document.getElementById("add-agent-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const { error } = await supabase.from("agents").insert([{
    name: document.getElementById("agent-name").value,
    role: document.getElementById("agent-role").value,
    image: document.getElementById("agent-image").value
  }]);
  if (error) alert(error.message);
  else alert("Agent added successfully!");
});

// Insight form
document.getElementById("add-insight-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const { error } = await supabase.from("insights").insert([{
    title: document.getElementById("insight-title").value,
    content: document.getElementById("insight-content").value
  }]);
  if (error) alert(error.message);
  else alert("Insight added successfully!");
});
