/* ==========================================================
   MAPA DE UBICACIÓN — R DOCE  (fase inicial)
   ----------------------------------------------------------
   Se carga desde config.js solo en páginas con [data-mapa]
   (por ahora, Contacto).

   - Inserta un mapa de Google Maps centrado en el local.
     No necesita clave de API.
   - Si en config.js hay un "mapaInsertado" (el mapa oficial de la
     ficha de Google de R Doce), usa ese.
   - El mapa se carga recién cuando la persona llega a esa parte
     de la página, para no hacer lenta la carga.
   - En celular, el mapa no "atrapa" el dedo: para moverlo hay que
     tocarlo primero. Así la persona puede seguir bajando la página
     sin quedar trabada dentro del mapa.
   - Los botones "Cómo llegar" abren Google Maps o Waze con el
     destino ya puesto.
   ========================================================== */

(function () {
    "use strict";

    const cfg = window.RDOCE_CONFIG || {};
    const u = cfg.ubicacion || {};
    const caja = document.querySelector("[data-mapa]");
    if (!caja || typeof u.lat !== "number" || typeof u.lng !== "number") return;

    const coords = u.lat + "," + u.lng;
    const zoom = u.zoom || 16;

    const urlMapa = cfg.mapaInsertado ||
        "https://maps.google.com/maps?q=" + encodeURIComponent(coords) +
        "&z=" + zoom + "&hl=es&output=embed";

    /* Botón "Cómo llegar": Google Maps con el destino puesto */
    caja.querySelectorAll("[data-mapa-ir]").forEach(a => {
        a.href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(coords);
        a.target = "_blank";
        a.rel = "noopener noreferrer";
    });

    const marco = caja.querySelector(".mapa-marco");
    const aviso = caja.querySelector(".mapa-aviso");
    const activar = caja.querySelector(".mapa-activar");
    if (!marco) return;

    const tactil = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

    function cargar() {
        if (marco.querySelector("iframe")) return;

        const f = document.createElement("iframe");
        f.src = urlMapa;
        f.title = "Mapa con la ubicación de R Doce en San Antonio de Alajuela";
        f.loading = "lazy";
        f.referrerPolicy = "no-referrer-when-downgrade";
        f.setAttribute("allowfullscreen", "");

        f.addEventListener("load", () => {
            marco.classList.add("mapa-listo");
            if (aviso) aviso.hidden = true;
            if (tactil && activar) activar.hidden = false;
        });

        marco.insertBefore(f, marco.firstChild);

        /* Si en 8 segundos no cargó (sin internet, bloqueado),
           se ofrece abrirlo en Google Maps */
        setTimeout(() => {
            if (marco.classList.contains("mapa-listo") || !aviso) return;
            aviso.innerHTML =
                'No se pudo cargar el mapa. <a href="' +
                "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(coords) +
                '" target="_blank" rel="noopener noreferrer">Abrir en Google Maps</a>';
        }, 8000);
    }

    /* Celular: tocar para mover el mapa; al salir de pantalla se
       vuelve a bloquear para no atrapar el dedo al bajar */
    if (activar) {
        activar.addEventListener("click", () => {
            marco.classList.add("mapa-activo");
            activar.hidden = true;
        });
    }

    if ("IntersectionObserver" in window) {
        const obs = new IntersectionObserver(entradas => {
            entradas.forEach(en => {
                if (en.isIntersecting) {
                    cargar();
                } else if (tactil && marco.classList.contains("mapa-activo")) {
                    marco.classList.remove("mapa-activo");
                    if (activar && marco.classList.contains("mapa-listo")) activar.hidden = false;
                }
            });
        }, { rootMargin: "300px 0px" });
        obs.observe(marco);
    } else {
        cargar();
    }
})();
