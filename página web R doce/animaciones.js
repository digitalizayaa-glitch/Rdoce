/* ==========================================================
   ANIMACIONES DEL SITIO R DOCE
   ----------------------------------------------------------
   Se carga solo desde config.js. El estilo se elige ahí con
   la opción  animaciones: "precision" | "taller" | "enfoque" | ""

   Cada estilo tiene 3 partes:
     1. Entrada al cargar  (bloque principal de cada página)
     2. Aparición al bajar (secciones, tarjetas, fotos)
     3. Contadores         (números que cuentan hasta su valor)

   Seguridad:
     - Si este archivo falla, el contenido se ve igual (los
       estados ocultos solo existen mientras el script corre).
     - Si la persona tiene desactivadas las animaciones en su
       dispositivo, no se anima nada.
   ========================================================== */

(function () {
    "use strict";

    const ESTILOS = ["precision", "taller", "enfoque"];

    const NOMBRES = {
        precision: "Precisión",
        taller: "Taller",
        enfoque: "Enfoque"
    };

    const cfg = window.RDOCE_CONFIG || {};
    const html = document.documentElement;

    const sinMovimiento =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* ---------- Estilo activo ----------
       Con el selector de prueba encendido, la elección del
       visitante (guardada en su navegador) manda sobre config. */
    /* En la página de comparación cada vista pide su estilo con
       #anim-precision, #anim-taller, #anim-enfoque o #anim-ninguna */
    const pedido = (location.hash.match(/^#anim-([a-z]+)$/) || [])[1];

    function estiloActivo() {
        if (pedido) return ESTILOS.includes(pedido) ? pedido : "";
        if (cfg.selectorAnimaciones) {
            try {
                const guardado = localStorage.getItem("rdoce-anim");
                if (guardado !== null && (guardado === "" || ESTILOS.includes(guardado))) {
                    return guardado;
                }
            } catch (e) { /* sin almacenamiento: usar config */ }
        }
        return ESTILOS.includes(cfg.animaciones) ? cfg.animaciones : "";
    }

    const estilo = estiloActivo();


    /* ======================================================
       CSS DE LOS TRES ESTILOS
       Los estados iniciales solo aplican con html.rd-anim
       ====================================================== */
    const CSS = `
    html.rd-anim { overflow-x: clip; }

    /* ---------- Base común ---------- */
    .rd-anim [data-rd] { will-change: opacity, transform; }
    .rd-anim [data-rd].rd-in { will-change: auto; }
    .rd-scan-host { position: relative; overflow: hidden; }
    .rd-num { font-variant-numeric: tabular-nums; }

    /* ======================================================
       1) PRECISIÓN — sobrio y técnico
       Aparece suave hacia arriba. La línea roja se traza.
       ====================================================== */
    .rd-precision [data-rd] {
        opacity: 0;
        transform: translateY(18px);
        transition:
            opacity .6s cubic-bezier(.2,.7,.2,1) var(--rd-d, 0s),
            transform .6s cubic-bezier(.2,.7,.2,1) var(--rd-d, 0s);
    }
    .rd-precision [data-rd="foto"] { transform: scale(1.03); }
    .rd-precision [data-rd="linea"] {
        opacity: 1;
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform .7s cubic-bezier(.65,0,.35,1) var(--rd-d, 0s);
    }
    .rd-precision [data-rd].rd-in { opacity: 1; transform: none; }

    /* ======================================================
       2) TALLER — industrial y contundente
       Los bloques se "cortan" hacia adentro como una pieza
       saliendo de la matriz. Contadores tipo odómetro.
       ====================================================== */
    .rd-taller [data-rd] {
        opacity: 0;
        transform: translateY(26px);
        clip-path: inset(0 0 99% 0);
        transition:
            opacity .35s linear var(--rd-d, 0s),
            transform .75s cubic-bezier(.16,1,.3,1) var(--rd-d, 0s),
            clip-path .75s cubic-bezier(.16,1,.3,1) var(--rd-d, 0s);
    }
    .rd-taller [data-rd="titulo"] {
        transform: none;
        clip-path: inset(0 99% 0 0);
        transition:
            opacity .2s linear var(--rd-d, 0s),
            clip-path .9s cubic-bezier(.77,0,.18,1) var(--rd-d, 0s);
    }
    .rd-taller [data-rd="texto"] {
        transform: translateX(-24px);
        clip-path: none;
    }
    .rd-taller [data-rd="linea"] {
        opacity: 1;
        transform: scaleX(0);
        transform-origin: left center;
        clip-path: none;
        transition: transform .5s cubic-bezier(.77,0,.18,1) var(--rd-d, 0s);
    }
    .rd-taller [data-rd="foto"] {
        transform: none;
        clip-path: inset(0 0 0 99%);
        transition:
            opacity .2s linear var(--rd-d, 0s),
            clip-path 1s cubic-bezier(.77,0,.18,1) var(--rd-d, 0s);
    }
    .rd-taller [data-rd].rd-in {
        opacity: 1;
        transform: none;
        clip-path: inset(0 0 0 0);
    }
    .rd-taller [data-rd="texto"].rd-in,
    .rd-taller [data-rd="linea"].rd-in { clip-path: none; }

    .rd-odo {
        display: inline-block;
        height: 1.15em;
        line-height: 1.15em;
        overflow: hidden;
        vertical-align: bottom;
    }
    .rd-odo > span {
        display: block;
        transition: transform 1.4s cubic-bezier(.16,1,.3,1) var(--rd-d, 0s);
    }
    .rd-odo > span > span { display: block; height: 1.15em; }

    /* ======================================================
       3) ENFOQUE — tecnológico, como un lente que enfoca
       De borroso a nítido. Una línea roja escanea las fotos.
       Contadores tipo lectura digital.
       ====================================================== */
    .rd-enfoque [data-rd] {
        opacity: 0;
        filter: blur(8px);
        transform: scale(.97);
        transition:
            opacity .7s ease var(--rd-d, 0s),
            filter .8s ease var(--rd-d, 0s),
            transform .8s cubic-bezier(.2,.7,.2,1) var(--rd-d, 0s);
    }
    .rd-enfoque [data-rd="titulo"] { transform: scale(1.05); filter: blur(14px); }
    .rd-enfoque [data-rd="linea"] {
        opacity: 1;
        filter: none;
        transform: scaleX(0);
        transform-origin: center;
        transition: transform .8s cubic-bezier(.65,0,.35,1) var(--rd-d, 0s);
    }
    .rd-enfoque [data-rd].rd-in { opacity: 1; filter: none; transform: none; }

    .rd-scan {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 2px;
        background: #d71920;
        box-shadow: 0 0 12px 2px rgba(215,25,32,.55);
        transform: translateY(-4px);
        opacity: 0;
        pointer-events: none;
    }
    .rd-in > .rd-scan,
    .rd-in.rd-scan-host > .rd-scan {
        animation: rd-escanear 1.3s cubic-bezier(.45,0,.25,1) calc(var(--rd-d, 0s) + .25s) 1 both;
    }
    @keyframes rd-escanear {
        0%   { opacity: 0; top: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { opacity: 0; top: 100%; }
    }
    .rd-digital { color: inherit; }

    /* ---------- Selector de prueba ---------- */
    .rd-selector {
        position: fixed;
        left: calc(16px + env(safe-area-inset-left, 0px));
        bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        z-index: 9998;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        background: #111;
        color: #fff;
        border-radius: 999px;
        box-shadow: 0 10px 28px rgba(0,0,0,.28);
        font: 600 12px/1 "Segoe UI", Arial, sans-serif;
        max-width: calc(100vw - 110px);
        overflow-x: auto;
    }
    .rd-selector b {
        padding: 0 8px 0 10px;
        font-weight: 700;
        letter-spacing: .06em;
        font-size: 10px;
        color: #aaa;
        white-space: nowrap;
    }
    .rd-selector button {
        border: 0;
        background: transparent;
        color: #fff;
        padding: 8px 12px;
        border-radius: 999px;
        font: inherit;
        cursor: pointer;
        white-space: nowrap;
    }
    .rd-selector button:hover { background: rgba(255,255,255,.12); }
    .rd-selector button[aria-pressed="true"] { background: #d71920; }
    .rd-selector button:focus-visible { outline: 2px solid #fff; outline-offset: 1px; }
    @media (max-width: 600px) {
        .rd-selector b { display: none; }
        .rd-selector button { padding: 8px 10px; }
    }
    `;


    /* ======================================================
       QUÉ SE ANIMA
       ====================================================== */

    /* Grupos de elementos que entran escalonados */
    const GRUPOS = [
        '[class*="grid"]',
        '[class*="cards"]',
        ".values-list",
        ".contact-cards"
    ].join(",");

    /* Números que cuentan: los marcados a mano con data-contar,
       los números de tarjetas/pasos (01, 02…) y las toneladas
       de las prensas (45 T). */
    const NUMEROS = [
        "[data-contar]",
        ".service-number",
        ".card-number",
        ".process-card > span",
        ".process-card span:first-child",
        ".machine-grid h3",
        "[class*='number']"
    ].join(",");


    function marcar(el, tipo, retardo) {
        if (!el || el.hasAttribute("data-rd")) return;
        el.setAttribute("data-rd", tipo);
        el.style.setProperty("--rd-d", retardo.toFixed(2) + "s");

        if (estilo === "enfoque" && tipo === "foto") {
            el.classList.add("rd-scan-host");
            const s = document.createElement("span");
            s.className = "rd-scan";
            s.setAttribute("aria-hidden", "true");
            el.appendChild(s);
        }
    }

    function tipoDe(el) {
        if (el.matches("h1")) return "titulo";
        if (el.matches(".red-line")) return "linea";
        if (el.matches(".image-slot, .image-placeholder, img, .map-box, [class*='image'], [class*='media'], [class*='thumb']")) return "foto";
        if (el.matches("p, .breadcrumb, .eyebrow, .section-label, .hero-badge, [class*='buttons']")) return "texto";
        return "bloque";
    }

    function dentroDeMarcado(el) {
        return !!(el.parentElement && el.parentElement.closest("[data-rd]"));
    }


    /* 1. Entrada al cargar: primer bloque de la página */
    function prepararEntrada(hero) {
        const piezas = hero.querySelectorAll(
            ".breadcrumb, .hero-badge, .eyebrow, .section-label, h1, .red-line, p, [class*='buttons'], .image-slot, .image-placeholder, img"
        );
        let i = 0;
        piezas.forEach(el => {
            if (dentroDeMarcado(el)) return;
            const paso = estilo === "taller" ? 0.12 : 0.09;
            marcar(el, tipoDe(el), 0.1 + i * paso);
            i++;
        });
    }


    /* 2. Aparición al bajar */
    function prepararSecciones(secciones) {
        secciones.forEach(sec => {

            /* Grupos: cada hijo entra escalonado. Primero los más
               internos, así las tarjetas se animan una por una y la
               columna que las contiene no se anima encima. */
            const profundidad = el => { let n = 0; while ((el = el.parentElement)) n++; return n; };
            Array.from(sec.querySelectorAll(GRUPOS))
                .sort((a, b) => profundidad(b) - profundidad(a))
                .forEach(grupo => {
                if (dentroDeMarcado(grupo)) return;
                const hijos = Array.from(grupo.children)
                    .filter(h => !h.matches("script, style") && !h.querySelector("[data-rd]"));
                if (hijos.length < 2) return;
                hijos.forEach((h, n) => marcar(h, tipoDe(h), Math.min(n, 6) * 0.08));
            });

            /* Títulos, textos y fotos sueltas que no estén en un grupo */
            sec.querySelectorAll(
                ".section-label, .eyebrow, h2, h3, .red-line, p, [class*='buttons'], .image-slot, .image-placeholder, .map-box, img"
            ).forEach(el => {
                if (el.closest("[data-rd]")) return;
                marcar(el, tipoDe(el), 0);
            });
        });
    }


    /* 3. Contadores */
    function prepararContadores() {
        const vistos = new Set();
        document.querySelectorAll(NUMEROS).forEach(el => {
            if (vistos.has(el) || el.closest(".rd-float, .rd-selector, header, footer")) return;

            const texto = (el.getAttribute("data-contar") || el.textContent).trim();
            const m = texto.match(/^(\D*?)(\d{1,6})(\D*)$/);
            if (!m) return;

            vistos.add(el);
            el.classList.add("rd-num");
            el.dataset.rdNum = JSON.stringify({ antes: m[1], valor: m[2], despues: m[3] });
        });
    }

    function contar(el) {
        if (!el.dataset.rdNum || el.dataset.rdContado) return;
        el.dataset.rdContado = "1";

        const { antes, valor, despues } = JSON.parse(el.dataset.rdNum);
        const largo = valor.length;
        const meta = parseInt(valor, 10);
        const relleno = n => String(n).padStart(largo, "0");
        const final = antes + valor + despues;

        el.setAttribute("aria-label", final.trim());

        if (estilo === "precision") {
            /* Cuenta de 0 al valor, frenando al final */
            const dur = 1200;
            const t0 = performance.now();
            const paso = t => {
                const p = Math.min((t - t0) / dur, 1);
                const e = 1 - Math.pow(1 - p, 3);
                el.textContent = antes + relleno(Math.round(meta * e)) + despues;
                if (p < 1) requestAnimationFrame(paso);
            };
            requestAnimationFrame(paso);

        } else if (estilo === "taller") {
            /* Odómetro: cada dígito gira como un contador mecánico */
            el.textContent = "";
            if (antes) el.appendChild(document.createTextNode(antes));
            Array.from(valor).forEach((d, i) => {
                const caja = document.createElement("span");
                caja.className = "rd-odo";
                caja.setAttribute("aria-hidden", "true");
                const tira = document.createElement("span");
                tira.style.setProperty("--rd-d", (i * 0.12).toFixed(2) + "s");
                for (let n = 0; n <= 9; n++) {
                    const c = document.createElement("span");
                    c.textContent = n;
                    tira.appendChild(c);
                }
                caja.appendChild(tira);
                el.appendChild(caja);
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    tira.style.transform = "translateY(" + (-1.15 * Number(d)) + "em)";
                }));
            });
            if (despues) el.appendChild(document.createTextNode(despues));

            /* Al terminar de girar, deja el número como texto normal */
            setTimeout(() => { el.textContent = final; }, 1600 + largo * 120);

        } else if (estilo === "enfoque") {
            /* Lectura digital: dígitos al azar que se fijan de izquierda a derecha */
            const dur = 1100;
            const t0 = performance.now();
            const paso = t => {
                const p = Math.min((t - t0) / dur, 1);
                const fijos = Math.floor(p * (largo + 1));
                let s = "";
                for (let i = 0; i < largo; i++) {
                    s += i < fijos ? valor[i] : Math.floor(Math.random() * 10);
                }
                el.textContent = antes + s + despues;
                if (p < 1) requestAnimationFrame(paso);
                else el.textContent = final;
            };
            requestAnimationFrame(paso);
        }
    }


    /* ======================================================
       SELECTOR DE PRUEBA (solo con selectorAnimaciones: true)
       ====================================================== */
    function crearSelector() {
        const barra = document.createElement("div");
        barra.className = "rd-selector";
        barra.setAttribute("role", "group");
        barra.setAttribute("aria-label", "Probar estilo de animación");
        barra.innerHTML = "<b>ANIMACIÓN</b>";

        [...ESTILOS, ""].forEach(op => {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = op ? NOMBRES[op] : "Ninguna";
            b.setAttribute("aria-pressed", String(op === estilo));
            b.addEventListener("click", () => {
                try { localStorage.setItem("rdoce-anim", op); } catch (e) {}
                location.reload();
            });
            barra.appendChild(b);
        });

        document.body.appendChild(barra);
    }


    /* ======================================================
       ARRANQUE
       ====================================================== */
    function iniciar() {
        const style = document.createElement("style");
        style.textContent = CSS;
        document.head.appendChild(style);

        if (cfg.selectorAnimaciones && !pedido) crearSelector();

        if (!estilo || sinMovimiento || !("IntersectionObserver" in window)) return;

        const main = document.querySelector("main");
        if (!main) return;

        const secciones = Array.from(main.querySelectorAll(":scope > section"));
        if (!secciones.length) return;

        html.classList.add("rd-anim", "rd-" + estilo);

        prepararEntrada(secciones[0]);
        prepararSecciones(secciones.slice(1));
        prepararContadores();

        const obs = new IntersectionObserver(entradas => {
            entradas.forEach(en => {
                if (!en.isIntersecting) return;
                const el = en.target;
                el.classList.add("rd-in");
                obs.unobserve(el);
                if (el.dataset.rdNum) contar(el);
                el.querySelectorAll("[data-rd-num]").forEach(contar);
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });

        /* Doble cuadro para que el navegador pinte el estado
           inicial antes de animar la entrada. */
        requestAnimationFrame(() => requestAnimationFrame(() => {
            document.querySelectorAll("[data-rd]").forEach(el => obs.observe(el));
            document.querySelectorAll("[data-rd-num]").forEach(el => {
                if (!el.closest("[data-rd]")) obs.observe(el);
            });
        }));

        /* Red de seguridad: si algo quedó oculto, mostrarlo */
        setTimeout(() => {
            document.querySelectorAll("[data-rd]:not(.rd-in)").forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.top < innerHeight && r.bottom > 0) el.classList.add("rd-in");
            });
        }, 2500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
