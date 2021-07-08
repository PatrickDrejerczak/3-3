const languages = ["ar", "zh", "en", "es", "fr", "ru"];

function renderLanguageAnchorTags() {
  const languageHTML = languages.map(
    (l) => `<a href="http://127.0.0.1:5500/index.html?language=${l}">${l}</a>`
  );
  document.getElementById("languages").innerHTML = languageHTML;
}

renderLanguageAnchorTags();
