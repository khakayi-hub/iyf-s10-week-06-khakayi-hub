let allUsers = [];

async function init() {
    try {
        allUsers = await fetchUsers();

        populateCities(allUsers);
        applyFilters();

        // Event listeners
        document.getElementById("search").addEventListener("input", applyFilters);
        document.getElementById("sort").addEventListener("change", applyFilters);
        document.getElementById("cityFilter").addEventListener("change", applyFilters);

    } catch (error) {
        console.error("Error:", error);
    }
}
function applyFilters() {
    const query = document.getElementById("search").value.toLowerCase();
    const sortValue = document.getElementById("sort").value;
    const selectedCity = document.getElementById("cityFilter").value;

    let filtered = [...allUsers];

    // ✅ Search (name or email)
    if (query) {
        filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    }

    // ✅ Filter by city
    if (selectedCity !== "all") {
        filtered = filtered.filter(user =>
            user.address.city === selectedCity
        );
    }

    // ✅ Sort
    filtered.sort((a, b) => {
        if (sortValue === "az") {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    displayUsers(filtered);
}
function populateCities(users) {
    const cityFilter = document.getElementById("cityFilter");

    const cities = [...new Set(users.map(user => user.address.city))];

    cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
}
function displayUsers(users) {
    const container = document.getElementById("user-list");
    container.innerHTML = "";

    users.forEach(user => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${user.name}</h3>
            <p>${user.email}</p>
            <p>${user.address.city}</p>
        `;
        container.appendChild(div);
    });
}