const categories = ["sport", "business", "politics", "entertainment", "covid"];

function renderCategoriesAnchorTags() {
  const categoriesHTML = categories.map(
    (l) => `<a href="http://127.0.0.1:5500/index.html?category=${l}">${l}</a>`
  );
  document.getElementById("categories").innerHTML = categoriesHTML;
}

renderCategoriesAnchorTags();
