/* ==========================================================
   CONFIGURACIÓN GENERAL DEL SITIO R DOCE
   ----------------------------------------------------------
   Este es el ÚNICO archivo que necesitás editar para conectar
   WhatsApp, correo, ubicación y redes sociales.
   Todas las páginas leen sus datos desde aquí.
   ========================================================== */

window.RDOCE_CONFIG = {

    /* WHATSAPP
       Solo números, con código de país y sin "+", espacios ni guiones.
       Ejemplo Costa Rica: "50688887777"
       Si queda vacío, el botón muestra un aviso de "falta configurar". */
    whatsapp: "",

    /* CORREO de destino para los botones de "Enviar correo". */
    email: "ventas@rdocesa.cr",

    /* UBICACIÓN
       Recomendado: en Google Maps buscá la empresa → "Compartir" →
       "Copiar vínculo" y pegalo en googleMaps.
       En Waze: buscá el lugar → "Compartir" → copiá el enlace.
       Mientras tanto se usa una búsqueda por la dirección. */
    googleMaps:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent("R Doce, San Antonio, Alajuela, Costa Rica"),

    waze:
        "https://waze.com/ul?q=" +
        encodeURIComponent("San Antonio, Alajuela, Costa Rica") +
        "&navigate=yes",

    /* REDES SOCIALES
       Pegá la URL completa del perfil. Si queda vacío, el enlace
       se muestra desactivado. */
    linkedin: "",
    facebook: "",
    instagram: ""
};


/* ----------------------------------------------------------
   No hace falta tocar nada debajo de esta línea.
   Activa los enlaces marcados con data-link="clave".
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

    document
        .querySelectorAll("[data-link]")
        .forEach(link => {

            const url = window.RDOCE_CONFIG[link.dataset.link];

            if (url) {
                link.href = url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.removeAttribute("aria-disabled");
            } else {
                link.setAttribute("aria-disabled", "true");
                link.addEventListener("click", e => e.preventDefault());
            }
        });
});
