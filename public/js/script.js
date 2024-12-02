const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const review = document.getElementById("review").value;
  const rating = document.getElementById("rating").value;

  const response = await fetch("/api/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, review, rating }),
  });

  if (response.ok) {
    alert("Book review added!");
    location.reload();
  } else {
    alert("Failed to add review!");
  }
});
