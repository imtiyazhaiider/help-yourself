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
   LOAD CATEGORIES FROM DATABASE
================================= */

async function loadCategories() {

    categoriesContainer.innerHTML =
        "<p>Loading categories...</p>";


    const { data, error } =
        await supabaseClient
            .from("contacts")
            .select("category");


    if (error) {

        console.error(
            "Error loading categories:",
            error
        );

        categoriesContainer.innerHTML =
            "<p>Unable to load categories.</p>";

        return;

    }


    /* Get unique categories */

    const uniqueCategories = [

        ...new Set(

            data
                .map(function(person) {

                    return person.category;

                })
                .filter(function(category) {

                    return category &&
                           category.trim() !== "";

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

        categoriesContainer.innerHTML =
            "<p>No categories available.</p>";

        return;

    }


    /* Create category buttons */

    uniqueCategories.forEach(
        function(category) {

            const categoryButton =
                document.createElement("div");


            categoryButton.className =
                "category";


            categoryButton.textContent =
                category;


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


    locations.sort();


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

    peopleContainer.innerHTML =
        "<p>Loading contacts...</p>";


    let query =
        supabaseClient
            .from("contacts")
            .select(
                "id, name, category, phone, location"
            )
            .eq("category", category);


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


        peopleContainer.innerHTML =
            "<p>Unable to load contacts.</p>";


        return;

    }


    peopleContainer.innerHTML = "";


    if (!data || data.length === 0) {

        peopleContainer.innerHTML =
            "<p>No contact found.</p>";


        return;

    }


    data.forEach(function(person) {

        const personCard =
            document.createElement("div");


        personCard.className =
            "person";


        personCard.innerHTML = `

            <h3>
                ${person.name}
            </h3>

            <p>
                📍 ${person.location}
            </p>

            <p>
                📞 ${person.phone}
            </p>

            <a
                class="call-button"
                href="tel:${person.phone}"
            >
                Call
            </a>

        `;


        peopleContainer.appendChild(
            personCard
        );

    });

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