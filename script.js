document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');

    const loader = document.getElementById('loader');
    const appContainer = document.getElementById('app-container');
    const errorScreen = document.getElementById('error-screen');

    // Si no hay ID en la URL, mostramos error inmediatamente
    if (!petId) {
        loader.classList.add('hidden');
        errorScreen.classList.remove('hidden');
        return;
    }

    // 2. Hacer fetch al JSON generado por Python
    fetch(`data/${petId}.json`)
        .then(response => {
            if (!response.ok) throw new Error("Perfil no encontrado");
            return response.json();
        })
        .then(data => {
            // 3. Inyectar los datos en el HTML
            document.getElementById('pet-img').src = `img/${data.foto}`;
            document.getElementById('pet-name').textContent = data.nombre;
            document.getElementById('pet-breed').textContent = data.raza;
            document.getElementById('pet-color').textContent = data.color || "-";
            document.getElementById('pet-size').textContent = data.talla || "-";
            document.getElementById('pet-weight').textContent = data.peso || "-";
            document.getElementById('pet-chip').textContent = data.microchip || "Sin registro";
            document.getElementById('pet-health').textContent = data.salud || "Ninguna registrada.";
            document.getElementById('pet-location').textContent = data.direccion;

            // 4. Configurar Botones Dinámicos
            document.getElementById('btn-call').href = `tel:${data.telefono}`;
            
            // WhatsApp (Limpiamos el número de espacios o guiones y armamos el link)
            const cleanPhone = data.telefono.replace(/[\+\s\-]/g, ''); 
            const waMessage = encodeURIComponent(`¡Hola! Escaneé la placa de ${data.nombre} y lo tengo conmigo. Por favor contáctame.`);
            document.getElementById('btn-wa').href = `https://wa.me/${cleanPhone}?text=${waMessage}`;

            // Google Maps
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.direccion)}`;
            document.getElementById('btn-maps').href = mapUrl;

            // 5. Ocultar Loader y Mostrar App
            loader.classList.add('hidden');
            appContainer.classList.remove('hidden');
        })
        .catch(error => {
            console.error(error);
            // Si el archivo JSON no existe (o hubo error de red), mostramos error
            loader.classList.add('hidden');
            errorScreen.classList.remove('hidden');
        });
});