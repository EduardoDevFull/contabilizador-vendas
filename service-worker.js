self.addEventListener("install", event => {

  event.waitUntil(

    caches.open("ipe-vendas").then(cache => {

      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js"
      ])

    })

  )

})