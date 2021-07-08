document.getElementById("foo").addEventListener("click", (e) => {
  e.preventDefault();
});

function renderArticles(articles) {
  // How many articles do we have?

  // Lets remove the bad ones, the elements that don't meet a criteria.
  const goodArticles = articles.filter((a) => a.author);

  const veryGoodArticles = goodArticles.filter((a) => a.content);

  // How many do we have now?

  // Use the foo you got from the api to produce a spam.
  const spam = veryGoodArticles.map(
    (a, foo, spam) => `
    <section>
      <h1>${foo + 1}. ${a.title}</h1>
            <div>
      <image src="${a.urlToImage}"
      </div>
      <div>
        ${a.author}
      </div>

      <div>
      ${a.content}
      </div>
      <div>
      ${a.publishedAt}
      </div>
    </section>
  `
  );

  // Inject spam into the U.I.
  document.getElementById("articles").innerHTML = spam.join("");
}

let pageNumber = 0;

function produceDefaultUrl() {
  pageNumber++;

  let url = `https://newsapi.org/v2/top-headlines?apiKey=a789c89d7c354c64afc320506517b71f&page=${pageNumber}`;

  // Look at all url query parameters and add them to the url above to respect language/country/category/page/etc.
  const urlParams = window.location.search.split("?")[1];

  // Guard against no url params and default to english.
  if (!urlParams) return url + "&language=en";

  urlParams.split("&").map((p) => {
    // "Massage data" into workable form.
    const [key, value] = p.split("=");
    url += `&${key}=${value}`;
  });

  return url;
}

// // NOTES : Signature of fetch() is that it takes a url string 1st & config object 2nd.
// // fetch(url, config)
// // BAD: Promise chain
// // 1. Callback hell
// // 2. Does not look "synchronous"
// function fetchArticles() {
//   fetch(
//     "https://newsapi.org/v2/top-headlines?apiKey=6eec2f7fe6cd4c40a3fef8f33f5778fe&language=en&category=health",
//   )
//     .then((r) => {
//       return r.json();
//     })
//     .then((json) => {
//       console.log({ foo: json });
//       rendersArticles(json.articles);
//     })
//     .catch((e) => {
//       console.log({e, foo: 'bar'});
//     })
// }

// We're gonna need two arrays in a moment...
// Lemmet know when u know when =)

let articles = [];
let allArticles = [];

function spam(q) {
  return `https://newsapi.org/v2/top-headlines?apiKey=a789c89d7c354c64afc320506517b71f&page=${pageNumber}&q=${q}`;
}

// 2. Async/Await
async function fetchArticles(q) {
  let url = q ? spam(q) : produceDefaultUrl();

  // Used to hold response from API.

  // Make sure we cover/protect/code-for/handle/account for all successful, error-ed, and required steps.
  try {
    const resp = await fetch(url);
    const json = await resp.json();

    // Log one to see it's shape always in our console.

    articles = json.articles;

    allArticles = allArticles.concat(articles);
  } catch (error) {
    // Report the error to the person in charge, you!
    console.log({ error });
    // GOOD: Open box of pizza before eating.
    // Grab out data we saved in previously successfully fetch() requests.
    articles = JSON.parse(localStorage.getItem("willWork"));
  } finally {
    // render Foo to the screen.
    console.log({ allArticles });
    renderArticles(allArticles);
  }
}

fetchArticles();

function fooBar() {
  fetchArticles();
}

function searchNews(e) {
  const q = document.getElementById("searchTerm").value;
  fetchArticles(q);
}
