function getBathValue() {
    var uiBathrooms = document.getElementById("uibath");
    return parseInt(uiBathrooms.value);
}

function getBHKValue() {
    var uiBHK = document.getElementById("uibhk");
    return parseInt(uiBHK.value);
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");

    var sqft = document.getElementById("uiArea");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");
    var estPrice = document.getElementById("uiEstimatedPrice");

    // Ensure inputs are valid
    if (!sqft.value || isNaN(sqft.value)) {
        alert("Please enter a valid area in square feet.");
        return;
    }
    if (!location.value) {
        alert("Please select a location.");
        return;
    }

    // Call Python backend
    var url = "/api/predict_home_price";

    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    }, function (data, status) {
        console.log(data.estimated_price);
        estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
    }).fail(function () {
        console.error("Error occurred while predicting the price.");
        estPrice.innerHTML = "<h2>Error: Unable to predict price</h2>";
    });
}

function onPageLoad() {
    console.log("Document loaded");

    var url = "/api/get_location_names";
    $.get(url, function (data, status) {
        console.log("Got response for get_location_names");
        if (data && data.locations) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            uiLocations.innerHTML = ""; // Clear existing options

            // Add default placeholder option
            var defaultOption = new Option("Choose a Location", "", true, true);
            defaultOption.disabled = true;
            uiLocations.add(defaultOption);

            // Populate dropdown with locations
            locations.forEach(function (location) {
                var opt = new Option(location, location);
                uiLocations.add(opt);
            });
        }
    }).fail(function () {
        console.error("Failed to fetch location names from the server");
    });
}

// Attach event listeners
window.onload = onPageLoad;
document.getElementById("uiPredict").addEventListener("click", onClickedEstimatePrice);
