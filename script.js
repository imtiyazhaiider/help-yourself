/* =================================
   SUPABASE CONNECTION
================================= */

const SUPABASE_URL =
    "https://hdbohzbyfpolifmexyao.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_CiB700YWNWVowMCAG6gnNQ_FMlkVqdy";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );



/* =================================
   ELEMENTS
================================= */

const categoriesContainer =
    document.getElementById("categories");


const peopleContainer =
    document.getElementById("people");


const categoryTitle =
    document.getElementById("category-title");


const peopleSection =
    document.getElementById("people-section");


const backButton =
    document.getElementById("back-button");


const homeSection =
    document.getElementById("home-section");


const locationFilter =
    document.getElementById("location-filter");



/* =================================
   LOAD CATEGORIES
================================= */

async function loadCategories() {

    categoriesContainer.innerHTML = `
        <div class="loading-message">
            Loading services...
        </div>
    `;


    const { data, error } =
        await supabaseClient
            .from("contacts")
            .select("category");


    if (error) {

        console.error(
            "Error loading categories:",
            error
        );


        categoriesContainer.innerHTML = `
            <div class="error-message">
                Unable to load services.
                Please try again.
            </div>
        `;


        return;

    }


    /* Get unique categories */

    const uniqueCategories = [

        ...new Set(

            data
                .map(function(person) {

                    return person.category
                        ? person.category.trim()
                        : "";

                })
                .filter(function(category) {

                    return category !== "";

                })

        )

    ];


    /* Sort alphabetically */

    uniqueCategories.sort(
        function(a, b) {

            return a.localeCompare(b);

        }
    );


    categoriesContainer.innerHTML = "";


    /* No categories */

    if (uniqueCategories.length === 0) {

        categoriesContainer.innerHTML = `
            <div class="empty-message">
                No services available yet.
            </div>
        `;


        return;

    }


    /* Create category cards */

    uniqueCategories.forEach(
        function(category) {

            const categoryButton =
                document.createElement("button");


            categoryButton.className =
                "category";


            categoryButton.type =
                "button";


            /* Icon */

            const icon =
                document.createElement("span");


            icon.className =
                "category-icon";


            icon.textContent =
                getCategoryIcon(category);


            /* Text */

            const text =
                document.createElement("span");


            text.className =
                "category-name";


            text.textContent =
                category;


            /* Arrow */

            const arrow =
                document.createElement("span");


            arrow.className =
                "category-arrow";


            arrow.textContent =
                "→";


            categoryButton.appendChild(icon);

            categoryButton.appendChild(text);

            categoryButton.appendChild(arrow);


            categoryButton.addEventListener(
                "click",
                function() {

                    showPeople(category);

                }
            );


            categoriesContainer.appendChild(
                categoryButton
            );

        }
    );

}



/* =================================
   CATEGORY ICONS
================================= */

function getCategoryIcon(category) {

    const name =
        category.toLowerCase();


    if (name.includes("electric")) {

        return "⚡";

    }


    if (name.includes("plumb")) {

        return "🔧";

    }


    if (
        name.includes("auto") ||
        name.includes("driver")
    ) {

        return "🚗";

    }


    if (
        name.includes("tutor") ||
        name.includes("teacher")
    ) {

        return "📚";

    }


    if (
        name.includes("store") ||
        name.includes("shop") ||
        name.includes("kirana")
    ) {

        return "🛒";

    }


    if (name.includes("carpenter")) {

        return "🪚";

    }


    if (name.includes("mason")) {

        return "🧱";

    }


    if (name.includes("mechanic")) {

        return "🔩";

    }


    if (name.includes("tailor")) {

        return "🧵";

    }


    if (name.includes("barber")) {

        return "✂️";

    }


    return "🛠️";

}



/* =================================
   LOAD LOCATIONS
================================= */

async function loadLocations(category) {

    locationFilter.innerHTML = `
        <option value="all">
            All villages
        </option>
    `;


    const { data, error } =
        await supabaseClient
            .from("contacts")
            .select("location")
            .eq("category", category);


    if (error) {

        console.error(
            "Error loading locations:",
            error
        );


        return;

    }


    const locations = [];


    data.forEach(function(person) {

        if (
            person.location &&
            !locations.includes(person.location)
        ) {

            locations.push(
                person.location
            );

        }

    });


    locations.sort(
        function(a, b) {

            return a.localeCompare(b);

        }
    );


    locations.forEach(function(location) {

        const option =
            document.createElement("option");


        option.value =
            location;


        option.textContent =
            location;


        locationFilter.appendChild(
            option
        );

    });

}



/* =================================
   SHOW PEOPLE
================================= */

async function showPeople(category) {

    homeSection.style.display =
        "none";


    peopleSection.style.display =
        "block";


    categoryTitle.textContent =
        category;


    locationFilter.value =
        "all";


    await loadLocations(category);


    await displayPeople(
        category,
        "all"
    );

}



/* =================================
   DISPLAY PEOPLE
================================= */

async function displayPeople(
    category,
    selectedLocation
) {

    peopleContainer.innerHTML = `
        <div class="loading-message">
            Finding people...
        </div>
    `;


    let query =
        supabaseClient
            .from("contacts")
            .select(
                "id, name, category, phone, location"
            )
            .eq(
                "category",
                category
            );


    if (selectedLocation !== "all") {

        query =
            query.eq(
                "location",
                selectedLocation
            );

    }


    const { data, error } =
        await query;


    if (error) {

        console.error(
            "Error loading contacts:",
            error
        );


        peopleContainer.innerHTML = `
            <div class="error-message">
                Unable to load contacts.
                Please try again.
            </div>
        `;


        return;

    }


    peopleContainer.innerHTML = "";


    if (!data || data.length === 0) {

        peopleContainer.innerHTML = `
            <div class="empty-message">
                No one found in this location.
            </div>
        `;


        return;

    }


    data.forEach(function(person) {

        /* Card */

        const personCard =
            document.createElement("article");


        personCard.className =
            "person";


        /* Top */

        const personTop =
            document.createElement("div");


        personTop.className =
            "person-top";


        /* Avatar */

        const avatar =
            document.createElement("div");


        avatar.className =
            "person-avatar";


        avatar.textContent =
            getInitials(person.name);


        /* Details */

        const details =
            document.createElement("div");


        details.className =
            "person-details";


        const name =
            document.createElement("h3");


        name.textContent =
            person.name;


        const category =
            document.createElement("span");


        category.className =
            "person-category";


        category.textContent =
            person.category;


        details.appendChild(name);

        details.appendChild(category);


        personTop.appendChild(avatar);

        personTop.appendChild(details);


        /* Location */

        const location =
            document.createElement("p");


        location.className =
            "person-location";


        location.textContent =
            "📍 " + person.location;


        /* Call button */

        const callButton =
            document.createElement("a");


        callButton.className =
            "call-button";


        callButton.href =
            "tel:" + person.phone;


        callButton.textContent =
            "☎ Call";


        /* Add elements */

        personCard.appendChild(
            personTop
        );


        personCard.appendChild(
            location
        );


        personCard.appendChild(
            callButton
        );


        peopleContainer.appendChild(
            personCard
        );

    });

}



/* =================================
   GET INITIALS
================================= */

function getInitials(name) {

    if (!name) {

        return "?";

    }


    const words =
        name.trim().split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0].charAt(0) +
        words[1].charAt(0)
    ).toUpperCase();

}



/* =================================
   LOCATION FILTER
================================= */

locationFilter.addEventListener(
    "change",
    async function() {

        const category =
            categoryTitle.textContent;


        const selectedLocation =
            locationFilter.value;


        await displayPeople(
            category,
            selectedLocation
        );

    }
);



/* =================================
   BACK TO CATEGORIES
================================= */

backButton.addEventListener(
    "click",
    function() {

        peopleSection.style.display =
            "none";


        homeSection.style.display =
            "block";

    }
);



/* =================================
   START APPLICATION
================================= */

peopleSection.style.display =
    "none";


loadCategories();