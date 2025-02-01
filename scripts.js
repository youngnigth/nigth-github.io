// Inicializar el mapa con Leaflet
let map;
let marker;

function initMap() {
    // Configurar el mapa
    map = L.map('map').setView([19.4326, -99.1332], 12); // Centro en Ciudad de México (valor por defecto)

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Añadir un marcador inicial
    marker = L.marker([19.4326, -99.1332], {
        draggable: true
    }).addTo(map);

    // Actualizar el campo de "Lugar de Recogida" cuando se mueve el marcador
    marker.on('dragend', function (e) {
        const latLng = marker.getLatLng();
        updateLocationInput(latLng.lat, latLng.lng);
    });

    // Actualizar el marcador cuando se hace clic en el mapa
    map.on('click', function (e) {
        marker.setLatLng(e.latlng);
        updateLocationInput(e.latlng.lat, e.latlng.lng);
    });

    // Obtener la ubicación del cliente
    getClientLocation();
}

// Obtener la ubicación del cliente
function getClientLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const clientLat = position.coords.latitude;
                const clientLng = position.coords.longitude;

                // Centrar el mapa en la ubicación del cliente
                map.setView([clientLat, clientLng], 15);

                // Mover el marcador a la ubicación del cliente
                marker.setLatLng([clientLat, clientLng]);

                // Actualizar el campo de "Lugar de Recogida"
                updateLocationInput(clientLat, clientLng);
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error);
                alert("No se pudo obtener tu ubicación. Por favor, selecciona manualmente en el mapa.");
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización. Por favor, selecciona manualmente en el mapa.");
    }
}

// Actualizar el campo de "Lugar de Recogida" con las coordenadas
function updateLocationInput(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name || "Ubicación seleccionada";
            document.getElementById('pickup-location').value = address;
        })
        .catch(error => {
            console.error("Error al obtener la dirección:", error);
        });
}

// Inicializar el mapa al cargar la página
window.onload = initMap;

// Manejar el envío del formulario
document.getElementById("reservation-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const pickupLocation = document.getElementById("pickup-location").value;
    const pickupDate = document.getElementById("pickup-date").value;
    const returnDate = document.getElementById("return-date").value;
    const carType = document.getElementById("car-type").value;

    if (fullName && email && phone && pickupLocation && pickupDate && returnDate && carType) {
        // Datos a enviar
        const formData = {
            fullName,
            email,
            phone,
            pickupLocation,
            pickupDate,
            returnDate,
            carType
        };

        try {
            // Reemplaza "TU_URL_DE_APPS_SCRIPT" con la URL de tu implementación
            const response = await fetch("https://script.google.com/macros/s/AKfycbyq7x7WHsxw2wjvbMGVeVEZtWTllyi-nIAWRRsOXLGTj5UTLjOTQV8lfV_SEIkdxLQe/exec", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Reserva completa estaremos pronto en contacto. ¡Gracias!");
                document.getElementById("reservation-form").reset(); // Limpiar formulario
            } else {
                alert("Error al guardar la reserva. Intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión. Intenta de nuevo.");
        }
    } else {
        alert("Por favor, completa todos los campos.");
    }
});
