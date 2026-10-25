/* =========================================
   ELEMENTS
========================================= */

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


/* =========================================
   CATEGORY ICONS
========================================= */

function getCategoryIcon(category) {
    const name = category.toLowerCase();

    if (name.includes("electric")) return "⚡";
    if (name.includes("plumb")) return "🔧";
    if (name.includes("auto") || name.includes("driver")) return "🚗";
    if (name.includes("tutor") || name.includes("teacher")) return "📚";
    if (name.includes("store") || name.includes("shop") || name.includes("kirana")) return "🛒";
    if (name.includes("carpenter")) return "🪚";
    if (name.includes("mason")) return "🧱";
    if (name.includes("mechanic")) return "🔩";
    if (name.includes("tailor")) return "🧵";
    if (name.includes("barber")) return "✂️";

    return "🛠️";
}


/* =========================================
   LOAD CATEGORIES
========================================= */

function loadCategories() {
    categoriesContainer.innerHTML = "";

    const uniqueCategories = [
        ...new Set(
            contacts
                .map(person => person.category?.trim())
                .filter(Boolean)
        )
    ].sort((a, b) => a.localeCompare(b));

    if (uniqueCategories.length === 0) {
        categoriesContainer.textContent =
            "No services available yet.";
        return;
    }

    uniqueCategories.forEach(category => {
        const button = document.createElement("button");
        button.className = "category";
        button.type = "button";

        const icon = document.createElement("span");
        icon.className = "category-icon";
        icon.textContent = getCategoryIcon(category);

        const name = document.createElement("span");
        name.className = "category-name";
        name.textContent = category;

        const arrow = document.createElement("span");
        arrow.className = "category-arrow";
        arrow.textContent = "→";

        button.append(icon, name, arrow);

        button.addEventListener("click", () => {
            showPeople(category);
        });

        categoriesContainer.appendChild(button);
    });
}


/* =========================================
   LOAD LOCATIONS
========================================= */

function loadLocations(category) {
    locationFilter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All locations";
    locationFilter.appendChild(allOption);

    const locations = [
        ...new Set(
            contacts
                .filter(person => person.category === category)
                .map(person => person.location?.trim())
                .filter(Boolean)
        )
    ].sort((a, b) => a.localeCompare(b));

    locations.forEach(location => {
        const option = document.createElement("option");
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}


/* =========================================
   SHOW CATEGORY CONTACTS
========================================= */

function showPeople(category) {
    homeSection.style.display = "none";
    peopleSection.style.display = "block";

    categoryTitle.textContent = category;

    loadLocations(category);
    displayPeople(category, "all");

    window.scrollTo({ top: 0, behavior: "smooth" });
}


/* =========================================
   DISPLAY CONTACTS
========================================= */

function displayPeople(category, selectedLocation) {
    peopleContainer.replaceChildren();

    const filteredContacts = contacts
        .filter(person => person.category === category)
        .filter(person =>
            selectedLocation === "all" ||
            person.location === selectedLocation
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    if (filteredContacts.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-message";
        empty.textContent = "No contacts found for this location.";
        peopleContainer.appendChild(empty);
        return;
    }

    filteredContacts.forEach(person => {
        const card = document.createElement("article");
        card.className = "person";

        const top = document.createElement("div");
        top.className = "person-top";

        const avatar = document.createElement("div");
        avatar.className = "person-avatar";
        avatar.textContent = getInitials(person.name);

        const details = document.createElement("div");
        details.className = "person-details";

        const name = document.createElement("h3");
        name.textContent = person.name;

        const categoryLabel = document.createElement("span");
        categoryLabel.className = "person-category";
        categoryLabel.textContent = person.category;

        details.append(name, categoryLabel);
        top.append(avatar, details);

        const location = document.createElement("p");
        location.className = "person-location";
        location.textContent = `📍 ${person.location}`;

        const callButton = document.createElement("a");
        callButton.className = "call-button";
        callButton.href = `tel:${person.phone}`;
        callButton.textContent = "☎ Call";
        callButton.setAttribute(
            "aria-label",
            `Call ${person.name}`
        );

        card.append(top, location, callButton);
        peopleContainer.appendChild(card);
    });
}


/* =========================================
   INITIALS
========================================= */

function getInitials(name) {
    if (!name) return "?";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return (
        words[0][0] + words[1][0]
    ).toUpperCase();
}


/* =========================================
   LOCATION FILTER
========================================= */

locationFilter.addEventListener("change", () => {
    displayPeople(
        categoryTitle.textContent,
        locationFilter.value
    );
});


/* =========================================
   BACK BUTTON
========================================= */

backButton.addEventListener("click", () => {
    peopleSection.style.display = "none";
    homeSection.style.display = "block";

    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* =========================================
   START
========================================= */

peopleSection.style.display = "none";
loadCategories();