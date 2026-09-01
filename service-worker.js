const CACHE_NAME = "help-yourself-v3";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./data.js",
    "./manifest.json"
];

self.addEventListener("install", function(event) {

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

});


self.addEventListener("activate", function(event) {

    event.waitUntil(

        Promise.all([

            self.clients.claim(),

            caches.keys()
                .then(function(cacheNames) {

                    return Promise.all(

                        cacheNames
                            .filter(function(name) {
                                return name !== CACHE_NAME;
                            })
                            .map(function(name) {
                                return caches.delete(name);
                            })

                    );

                })

        ])

    );

});


self.addEventListener("fetch", function(event) {

    /*
       Always get application files from the network.
       This prevents old JavaScript from being served
       after a new deployment.
    */

    const requestURL =
        new URL(event.request.url);


    if (
        requestURL.pathname.endsWith(".js") ||
        requestURL.pathname.endsWith(".html") ||
        requestURL.pathname.endsWith(".css")
    ) {

        event.respondWith(
            fetch(event.request)
        );

        return;

    }


    event.respondWith(

        caches.match(event.request)
            .then(function(cachedResponse) {

                return cachedResponse ||
                       fetch(event.request);

            })

    );

});