const CACHE_NAME = "help-yourself-v2";


const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./data.js",

    "./manifest.json"

];



/* =================================
   INSTALL
================================= */

self.addEventListener(
    "install",
    function(event) {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(function(cache) {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                })

        );

    }
);



/* =================================
   ACTIVATE
================================= */

self.addEventListener(
    "activate",
    function(event) {

        event.waitUntil(

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

        );

    }
);



/* =================================
   FETCH
================================= */

self.addEventListener(
    "fetch",
    function(event) {

        event.respondWith(

            caches.match(event.request)
                .then(function(cachedResponse) {

                    if (cachedResponse) {

                        return cachedResponse;

                    }


                    return fetch(event.request);

                })

        );

    }
);