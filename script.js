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

const adminButton =
    document.getElementById("admin-button");

const addSection =
    document.getElementById("add-section");

const addBackButton =
    document.getElementById("add-back-button");

const contactForm =
    document.getElementById("contact-form");

const categorySelect =
    document.getElementById("category");

const locationFilter =
    document.getElementById("location-filter");



/* =================================
   LOAD SAVED CONTACTS
================================= */

const savedContacts =
    localStorage.getItem("helpYourselfContacts");


if (savedContacts) {

    const savedPeople =
        JSON.parse(savedContacts);

    people.push(...savedPeople);

}



/* =================================
   SHOW CATEGORIES
================================= */

function showCategories() {

    categoriesContainer.innerHTML = "";


    categories.forEach(function(category) {

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

    });

}



/* =================================
   LOAD LOCATIONS
================================= */

function loadLocations(category) {

    locationFilter.innerHTML = `
        <option value="all">
            All villages
        </option>
    `;


    const locations = [];


    people.forEach(function(person) {

        if (
            person.category === category &&
            !locations.includes(person.location)
        ) {

            locations.push(person.location);

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

function showPeople(category) {

    homeSection.style.display =
        "none";

    addSection.style.display =
        "none";

    peopleSection.style.display =
        "block";


    categoryTitle.textContent =
        category;


    loadLocations(category);


    locationFilter.value =
        "all";


    displayPeople(category, "all");

}



/* =================================
   DISPLAY PEOPLE
================================= */

function displayPeople(
    category,
    selectedLocation
) {

    peopleContainer.innerHTML = "";


    const filteredPeople =
        people.filter(function(person) {

            const correctCategory =
                person.category === category;


            const correctLocation =
                selectedLocation === "all" ||
                person.location === selectedLocation;


            return (
                correctCategory &&
                correctLocation
            );

        });


    if (filteredPeople.length === 0) {

        peopleContainer.innerHTML =
            "<p>No contact found.</p>";

        return;

    }


    filteredPeople.forEach(function(person) {

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
    function() {

        const category =
            categoryTitle.textContent;


        const selectedLocation =
            locationFilter.value;


        displayPeople(
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
   OPEN ADD CONTACT
================================= */

adminButton.addEventListener(
    "click",
    function() {

        homeSection.style.display =
            "none";

        peopleSection.style.display =
            "none";

        addSection.style.display =
            "block";

    }
);



/* =================================
   BACK FROM ADD CONTACT
================================= */

addBackButton.addEventListener(
    "click",
    function() {

        addSection.style.display =
            "none";

        homeSection.style.display =
            "block";

    }
);



/* =================================
   LOAD CATEGORIES INTO DROPDOWN
================================= */

function loadCategoriesIntoForm() {

    categorySelect.innerHTML = `
        <option value="">
            Select category
        </option>
    `;


    categories.forEach(function(category) {

        const option =
            document.createElement("option");


        option.value =
            category;


        option.textContent =
            category;


        categorySelect.appendChild(
            option
        );

    });

}



/* =================================
   ADD CONTACT
================================= */

contactForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "name"
            ).value.trim();


        const category =
            document.getElementById(
                "category"
            ).value;


        const phone =
            document.getElementById(
                "phone"
            ).value.trim();


        const location =
            document.getElementById(
                "location"
            ).value.trim();



        const newPerson = {

            name: name,

            category: category,

            phone: phone,

            location: location

        };



        /* Add to current data */

        people.push(newPerson);



        /* Get saved contacts */

        const saved =
            localStorage.getItem(
                "helpYourselfContacts"
            );


        let userContacts = [];


        if (saved) {

            userContacts =
                JSON.parse(saved);

        }



        /* Save new contact */

        userContacts.push(
            newPerson
        );


        localStorage.setItem(
            "helpYourselfContacts",
            JSON.stringify(userContacts)
        );



        alert(
            "Contact added successfully!"
        );



        /* Reset form */

        contactForm.reset();



        /* Return home */

        addSection.style.display =
            "none";

        homeSection.style.display =
            "block";


        showCategories();

    }
);



/* =================================
   START APPLICATION
================================= */

showCategories();

loadCategoriesIntoForm();

peopleSection.style.display =
    "none";

addSection.style.display =
    "none";