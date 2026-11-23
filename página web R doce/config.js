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
    instagram: "",

    /* ANIMACIONES
       "taller" → bloques que se descubren como un corte y contadores
                  tipo odómetro (intensidad media, ajustada al celular)
       ""       → sin animaciones */
    animaciones: "taller"
};


/* Carga animaciones.js e interacciones.js (en la misma carpeta que este archivo) */
(function () {
    const yo = document.currentScript && document.currentScript.src;
    if (!yo) return;
    ["animaciones.js", "interacciones.js"].forEach(nombre => {
        const s = document.createElement("script");
        s.src = yo.replace(/config\.js(\?.*)?$/, nombre);
        s.defer = true;
        document.head.appendChild(s);
    });
})();


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


/* ----------------------------------------------------------
   BOTONES FLOTANTES (correo y WhatsApp)
   Aparecen abajo a la derecha en todas las páginas.
   El mensaje cambia según la página en la que esté el cliente.
   ---------------------------------------------------------- */
(function () {

    const css = `
    .rd-float {
        position: fixed;
        right: calc(20px + env(safe-area-inset-right, 0px));
        bottom: calc(20px + env(safe-area-inset-bottom, 0px));
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 12px;
        font-family: "Segoe UI", Arial, sans-serif;
    }
    .rd-float-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 56px;
        min-width: 56px;
        padding: 0;
        border: 0;
        border-radius: 28px;
        color: #fff;
        text-decoration: none;
        cursor: pointer;
        box-shadow: 0 10px 28px rgba(0,0,0,.25);
        overflow: hidden;
        transition: box-shadow .2s, transform .2s;
    }
    /* Siempre visibles, sin animación de aparición */
    .rd-float-btn.rd-email { background: #d71920; }
    .rd-float-btn.rd-wa { background: #25d366; }
    .rd-float-btn:hover { box-shadow: 0 14px 34px rgba(0,0,0,.32); transform: translateY(-2px); }
    .rd-float-btn:focus-visible { outline: 3px solid #111; outline-offset: 3px; }
    .rd-float-label {
        max-width: 0;
        white-space: nowrap;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: .02em;
        opacity: 0;
        transition: max-width .3s ease, opacity .2s ease, padding .3s ease;
    }
    .rd-float-btn:hover .rd-float-label,
    .rd-float-btn:focus-visible .rd-float-label {
        max-width: 220px;
        opacity: 1;
        padding-left: 20px;
    }
    .rd-float-icon {
        flex: 0 0 56px;
        height: 56px;
        display: grid;
        place-items: center;
    }
    .rd-float-icon svg { width: 26px; height: 26px; fill: currentColor; }
    .rd-wa::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow: 0 0 0 0 rgba(37,211,102,.55);
        animation: rd-pulse 2.4s ease-out 1.2s 3;
        pointer-events: none;
    }
    .rd-toast {
        position: fixed;
        right: calc(20px + env(safe-area-inset-right, 0px));
        bottom: calc(160px + env(safe-area-inset-bottom, 0px));
        z-index: 10000;
        max-width: min(320px, calc(100vw - 40px));
        padding: 12px 16px;
        background: #111;
        color: #fff;
        font: 600 13px/1.4 "Segoe UI", Arial, sans-serif;
        border-radius: 8px;
        box-shadow: 0 10px 28px rgba(0,0,0,.3);
    }
    /* Página de Contacto: los botones, sin desaparecer, hacen un
       pequeño "pop" para mostrar que ahí están el correo y el WhatsApp */
    .rd-float.rd-pop-contacto .rd-float-btn {
        animation: rd-pop-aqui .5s cubic-bezier(.34,1.56,.64,1) both;
    }
    .rd-float.rd-pop-contacto .rd-email { animation-delay: .3s; }
    .rd-float.rd-pop-contacto .rd-wa { animation-delay: .42s; }
    @keyframes rd-pop-aqui {
        0%   { transform: scale(1); }
        45%  { transform: scale(1.1); }
        75%  { transform: scale(.98); }
        100% { transform: scale(1); }
    }
    /* Celular: los botones muestran siempre su nombre, para que
       nadie tenga que adivinar qué hace cada ícono */
    .rd-float-corto { display: none; }
    @media (max-width: 768px) {
        /* Los dos botones en una fila, para tapar menos contenido */
        .rd-float { right: calc(12px + env(safe-area-inset-right, 0px)); bottom: calc(12px + env(safe-area-inset-bottom, 0px)); flex-direction: row; gap: 8px; }
        .rd-float-btn { height: 52px; }
        .rd-float-icon { flex-basis: 48px; height: 52px; }
        .rd-float-btn .rd-float-label,
        .rd-float-btn:hover .rd-float-label { max-width: none; opacity: 1; padding-left: 18px; font-size: 16px; }
        .rd-float-largo { display: none; }
        .rd-float-corto { display: inline; }
    }
    @media (prefers-reduced-motion: reduce) {
        .rd-float-btn { animation: none; opacity: 1; transform: none; }
        .rd-float.rd-pop-contacto .rd-float-btn { animation: none; }
        .rd-wa::after { animation: none; }
        .rd-float-btn, .rd-float-label { transition: none; }
    }`;

    const ICON_EMAIL =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.2-8 5-8-5V6l8 5 8-5v2.2z"/></svg>';

    const ICON_WA =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A9.9 9.9 0 1 0 12.04 2zm0 18.1c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7.1 3.9zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.2.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';

    /* En las páginas de cada servicio devuelve su nombre, sacado del
       título (ej. "Erosión por Hilo"). En las demás páginas, vacío. */
    function nombrePagina() {
        const ruta = decodeURIComponent(location.pathname);
        if (!/\/Servicios\/Servicio /i.test(ruta)) return "";
        return (document.title || "")
            .split("|")[0]
            .replace(/\s+en Costa Rica/i, "")
            .trim();
    }

    function aviso(texto) {
        const viejo = document.querySelector(".rd-toast");
        if (viejo) viejo.remove();
        const t = document.createElement("div");
        t.className = "rd-toast";
        t.setAttribute("role", "status");
        t.textContent = texto;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3500);
    }

    function crear() {
        if (document.querySelector(".rd-float")) return;

        const cfg = window.RDOCE_CONFIG || {};
        const pagina = nombrePagina();

        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);

        const cont = document.createElement("div");
        cont.className = "rd-float";
        if (/\/Contacto\//i.test(decodeURIComponent(location.pathname))) {
            cont.classList.add("rd-pop-contacto");
        }

        /* Correo */
        const email = document.createElement("a");
        email.className = "rd-float-btn rd-email";
        email.setAttribute("aria-label", "Escribir por correo a " + (cfg.email || "R Doce"));
        email.title = cfg.email || "";
        email.href =
            "mailto:" + (cfg.email || "") +
            "?subject=" + encodeURIComponent("Consulta para R Doce" + (pagina ? " – " + pagina : ""));
        email.innerHTML =
            '<span class="rd-float-label"><span class="rd-float-largo">' + (cfg.email || "Correo") + '</span><span class="rd-float-corto">Correo</span></span>' +
            '<span class="rd-float-icon">' + ICON_EMAIL + "</span>";

        /* WhatsApp */
        const wa = document.createElement("a");
        wa.className = "rd-float-btn rd-wa";
        wa.setAttribute("aria-label", "Escribir por WhatsApp a R Doce");
        wa.innerHTML =
            '<span class="rd-float-label"><span class="rd-float-largo">Escríbanos por WhatsApp</span><span class="rd-float-corto">WhatsApp</span></span>' +
            '<span class="rd-float-icon">' + ICON_WA + "</span>";

        const numero = String(cfg.whatsapp || "").replace(/\D/g, "");
        if (numero) {
            const msg =
                "Hola, quisiera información sobre " +
                (pagina ? pagina : "los servicios de R Doce") + ".";
            wa.href = "https://wa.me/" + numero + "?text=" + encodeURIComponent(msg);
            wa.target = "_blank";
            wa.rel = "noopener noreferrer";
        } else {
            wa.href = "#";
            wa.addEventListener("click", e => {
                e.preventDefault();
                aviso("Falta configurar el número de WhatsApp en config.js.");
            });
        }

        cont.appendChild(email);
        cont.appendChild(wa);
        document.body.appendChild(cont);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", crear);
    } else {
        crear();
    }
})();
