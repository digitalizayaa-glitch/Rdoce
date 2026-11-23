/* ==========================================================
   INTERACCIONES DEL SITIO R DOCE
   ----------------------------------------------------------
   Se carga solo desde config.js, en todas las páginas.

   1. Menú del celular: se abre y se cierra con animación
      (mismo lenguaje que las animaciones "Taller": se descubre
      de arriba hacia abajo y las opciones entran una tras otra).
      El ícono ☰ cambia a ✕ mientras está abierto.

   2. Efecto al tocar: el botón o enlace tocado se pone rojo con
      un pequeño "pop", la opción que estaba marcada vuelve a la
      normalidad y, tras una pausa corta, se abre la página.
      Así la persona ve que su toque funcionó.

   Si la persona tiene desactivadas las animaciones en su
   dispositivo, se mantiene el cambio de color pero sin
   movimiento y con una pausa más corta.
   ========================================================== */

(function () {
    "use strict";

    const html = document.documentElement;

    const sinMovimiento =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Pausa entre el toque y el cambio de página (milisegundos).
       Corta: alcanza para ver el efecto sin hacer esperar */
    const PAUSA = sinMovimiento ? 80 : 130;

    const ROJO = "#d71920";


    const CSS = `
    /* ======================================================
       1. MENÚ DEL CELULAR
       Solo aplica cuando el botón ☰ está visible
       (html.rd-menu-movil lo pone este mismo archivo).
       ====================================================== */
    .rd-menu-movil .main-nav {
        display: flex !important;
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        right: 0 !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 0 !important;
        padding: 10px 24px 18px !important;
        background: #fff !important;
        border-bottom: 1px solid #e3e3e3 !important;
        visibility: hidden;
        clip-path: inset(0 0 100% 0);
        box-shadow: 0 18px 30px rgba(0,0,0,.12);
        transition:
            clip-path .28s cubic-bezier(.65,0,.35,1),
            visibility 0s linear .28s;
    }
    .rd-menu-movil .main-nav.open {
        visibility: visible;
        clip-path: inset(0 0 -40px 0);
        transition:
            clip-path .42s cubic-bezier(.16,1,.3,1),
            visibility 0s;
    }
    .rd-menu-movil .main-nav > * {
        opacity: 0;
        transform: translateY(-8px);
        transition: opacity .15s linear, transform .15s ease;
    }
    .rd-menu-movil .main-nav.open > * {
        opacity: 1;
        transform: none;
        transition:
            opacity .3s linear calc(var(--rd-i, 0) * 45ms + 90ms),
            transform .4s cubic-bezier(.16,1,.3,1) calc(var(--rd-i, 0) * 45ms + 90ms);
    }

    /* Botón ☰ / ✕ */
    .rd-menu-movil .menu-button {
        transition: transform .3s cubic-bezier(.16,1,.3,1);
    }
    .rd-menu-movil .menu-button[aria-expanded="true"] {
        transform: rotate(90deg);
    }

    /* ======================================================
       2. EFECTO AL TOCAR
       ====================================================== */

    /* Sin el resaltado celeste que pone el navegador del celular:
       el sitio ya muestra su propio efecto al tocar */
    a, button { -webkit-tap-highlight-color: transparent; }

    /* Al apoyar el dedo: se hunde apenas */
    .rd-abajo {
        transform: scale(.985) !important;
        transition: transform .08s ease !important;
    }

    /* Al soltar: se pone rojo y hace un pequeño pop */
    .rd-tocado {
        animation: rd-pop .18s cubic-bezier(.2,.8,.2,1) both !important;
    }
    @keyframes rd-pop {
        0%   { transform: scale(.985); }
        55%  { transform: scale(1.02); }
        100% { transform: scale(1.01); }
    }

    /* Opciones del menú: solo la palabra se pone roja y hace el pop,
       desde su propio lugar (sin fondo) */
    .main-nav a.rd-tocado {
        color: ${ROJO} !important;
        transform-origin: left center;
    }
    .main-nav a.rd-abajo {
        transform-origin: left center;
    }
    /* La opción que estaba marcada vuelve a la normalidad */
    .main-nav a.rd-desmarcado {
        color: inherit !important;
    }
    .main-nav a.rd-desmarcado::after {
        width: 0 !important;
    }

    /* Botones: se llenan de rojo */
    .rd-tocado.primary-button,
    .rd-tocado.secondary-button,
    .rd-tocado.star-button,
    .rd-tocado.vacuum-button,
    .center-action a.rd-tocado,
    .equipment-copy a.rd-tocado,
    .machine-grid article > a.rd-tocado,
    .vacuum-callout a.rd-tocado,
    .platform-link.rd-tocado,
    .thermal-link.rd-tocado {
        background: ${ROJO} !important;
        border-color: ${ROJO} !important;
        color: #fff !important;
    }
    /* El botón que ya era rojo se oscurece, para que se note */
    .rd-tocado.primary-button {
        background: #a50f15 !important;
        border-color: #a50f15 !important;
    }

    /* Tarjetas que son enlaces: borde rojo */
    a.service-card.rd-tocado,
    .service-link.rd-tocado,
    .navigation-card a.rd-tocado {
        outline: 3px solid ${ROJO} !important;
        outline-offset: -3px !important;
    }
    .service-link.rd-tocado,
    a.service-card.rd-tocado {
        animation-name: rd-pop-suave !important;
    }
    @keyframes rd-pop-suave {
        0%   { transform: scale(.993); }
        55%  { transform: scale(1.008); }
        100% { transform: scale(1.004); }
    }

    /* Enlaces de texto (pie de página, migas, "Conocer…"): letra roja */
    .rd-tocado.text-link,
    .footer-links a.rd-tocado,
    .breadcrumb a.rd-tocado,
    .brand.rd-tocado {
        color: ${ROJO} !important;
    }

    @media (prefers-reduced-motion: reduce) {
        .rd-menu-movil .main-nav,
        .rd-menu-movil .main-nav.open,
        .rd-menu-movil .main-nav > *,
        .rd-menu-movil .main-nav.open > *,
        .rd-menu-movil .menu-button { transition: none !important; }
        .rd-abajo { transform: none !important; }
        .rd-tocado { animation: none !important; }
    }
    `;


    /* ======================================================
       MENÚ
       ====================================================== */
    function prepararMenu() {
        const boton = document.querySelector(".menu-button");
        const nav = document.querySelector(".main-nav");
        if (!boton || !nav) return;

        /* Orden de entrada de cada opción */
        Array.from(nav.children).forEach((el, i) => el.style.setProperty("--rd-i", i));

        /* El modo celular depende de si el botón ☰ se ve: cada página
           tiene su propio punto de corte (860 o 900 px). */
        const revisar = () => {
            const visible = getComputedStyle(boton).display !== "none";
            html.classList.toggle("rd-menu-movil", visible);
        };
        revisar();
        window.addEventListener("resize", revisar);

        /* Ícono y texto del botón según el estado del menú.
           El JS de cada página es el que abre y cierra (clase .open);
           acá solo se acompaña ese cambio. */
        const sincronizar = () => {
            const abierto = nav.classList.contains("open");
            boton.textContent = abierto ? "✕" : "☰";
            boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
        };
        new MutationObserver(sincronizar).observe(nav, { attributes: true, attributeFilter: ["class"] });
        sincronizar();

        /* Cerrar con la tecla Escape */
        document.addEventListener("keydown", e => {
            if (e.key === "Escape" && nav.classList.contains("open")) boton.click();
        });
    }


    /* ======================================================
       EFECTO AL TOCAR
       ====================================================== */
    const TOCABLES = [
        ".main-nav a",
        ".brand",
        ".breadcrumb a",
        ".primary-button",
        ".secondary-button",
        ".text-link",
        ".star-button",
        ".vacuum-button",
        ".center-action a",
        ".equipment-copy a",
        ".machine-grid article > a",
        ".vacuum-callout a",
        "a.service-card",
        ".service-link",
        ".navigation-card a",
        ".platform-link",
        ".thermal-link",
        ".footer-links a"
    ].join(",");

    /* ¿Es un enlace a otra página de este mismo sitio? */
    function esNavegacionInterna(a) {
        if (!a || a.tagName !== "A" || !a.href) return false;
        if (a.target && a.target !== "_self") return false;
        if (a.hasAttribute("download")) return false;
        const url = new URL(a.href, location.href);
        if (!/^https?:|^file:/.test(url.protocol)) return false;   /* mailto:, tel: */
        if (url.origin !== location.origin) return false;
        const mismaPagina = url.pathname === location.pathname && url.search === location.search;
        if (mismaPagina && url.hash) return false;                  /* ancla en la misma página */
        return true;
    }

    function limpiar() {
        document.querySelectorAll(".rd-tocado, .rd-abajo, .rd-desmarcado")
            .forEach(el => el.classList.remove("rd-tocado", "rd-abajo", "rd-desmarcado"));
    }

    function prepararToques() {
        let navegando = false;

        document.addEventListener("pointerdown", e => {
            if (e.button !== 0) return;
            const el = e.target.closest(TOCABLES);
            if (el) el.classList.add("rd-abajo");
        }, { passive: true });

        const soltar = () => document.querySelectorAll(".rd-abajo")
            .forEach(el => el.classList.remove("rd-abajo"));
        document.addEventListener("pointerup", soltar, { passive: true });
        document.addEventListener("pointercancel", soltar, { passive: true });

        document.addEventListener("click", e => {
            const el = e.target.closest(TOCABLES);
            if (!el) return;

            /* Clic con Ctrl, Cmd, Shift o rueda: abrir normal en otra pestaña */
            if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;

            el.classList.remove("rd-abajo", "rd-tocado");
            void el.offsetWidth;           /* reinicia la animación */
            el.classList.add("rd-tocado");

            /* En el menú: la opción marcada vuelve a la normalidad */
            if (el.matches(".main-nav a")) {
                el.parentElement.querySelectorAll("a.active").forEach(a => {
                    if (a !== el) a.classList.add("rd-desmarcado");
                });
            }

            /* Botones sin enlace (WhatsApp) y enlaces de correo, teléfono
               o pestaña nueva: solo el efecto, sin demorar nada */
            if (!esNavegacionInterna(el)) {
                setTimeout(() => el.classList.remove("rd-tocado"), 450);
                return;
            }

            e.preventDefault();
            if (navegando) return;
            navegando = true;
            const destino = el.href;
            setTimeout(() => { location.href = destino; }, PAUSA);
        });

        /* Al volver con el botón "atrás", la página puede venir de la
           memoria del navegador con el botón todavía rojo: se limpia. */
        window.addEventListener("pageshow", () => {
            navegando = false;
            limpiar();
        });
    }


    /* ======================================================
       ARRANQUE
       ====================================================== */
    function iniciar() {
        const style = document.createElement("style");
        style.textContent = CSS;
        document.head.appendChild(style);

        prepararMenu();
        prepararToques();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
