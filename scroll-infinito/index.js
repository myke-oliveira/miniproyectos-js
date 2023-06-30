window.onscroll = function () {
  if (window.scrollY + window.innerHeight >= window.document.body.offsetHeight) {
    loadMoreContent()
  }
}

async function loadMoreContent() {
  const content = await getContent()

  const cardsHtml = []
  for (const { username, body, date, likes, retweets, title } of content) {
    const cardHtml = `<div class="row">
          <div class="card mb-2">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">${username}</h6>
              <p>${body}</p>
            </div>
          </div>
        </div>`

    cardsHtml.push(cardHtml)
  }

  document.querySelector('div.container').insertAdjacentHTML('beforeend', cardsHtml.join('\n'))
}

async function getContent() {
  const fieldQuantity = 10
  const data = await fetch("tweets.json");
  const tweets = await data.json();

  const content = [];
  for (let i = 0; i < fieldQuantity; i++) {
    content.push(tweets[randomIntBetween(0, tweets.length)])
  }

  return content;
}

function randomIntBetween(start, end) {
  return start + Math.floor(Math.random() * (end - start))
}

loadMoreContent()