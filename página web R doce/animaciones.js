/* ==========================================================
   ANIMACIONES DEL SITIO R DOCE — estilo "Taller", intensidad media
   ----------------------------------------------------------
   Se carga solo desde config.js. Se activa con
   animaciones: "taller"   (o "" para apagarlas)

   Tres partes:
     1. Entrada al cargar  (bloque principal de cada página)
     2. Aparición al bajar (secciones, tarjetas, fotos)
     3. Contadores tipo odómetro (01, 02…, 45 T)

   Pensado para personas adultas que navegan en el celular:
     - Todo termina rápido (menos de 1 segundo) para no demorar
       la lectura. En celular, aún más corto y sin escalonar de más.
     - Movimientos cortos y verticales: nada entra de costado.
     - Si la persona tiene desactivadas las animaciones en su
       dispositivo, no se anima nada.
     - Si este archivo falla, el contenido se ve igual.
   ========================================================== */

(function () {
    "use strict";

    const cfg = window.RDOCE_CONFIG || {};
    const html = document.documentElement;

    if (cfg.animaciones !== "taller") return;

    const sinMovimiento =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const celular =
        window.matchMedia &&
        window.matchMedia("(max-width: 768px)").matches;

    /* Ritmo: en celular las tarjetas van una por fila, así que
       escalonar casi no aporta y solo hace esperar. */
    const RITMO = celular
        ? { heroPaso: 0.06, grupoPaso: 0.04, grupoMax: 2 }
        : { heroPaso: 0.08, grupoPaso: 0.06, grupoMax: 4 };


    /* ======================================================
       CSS — los estados iniciales solo existen con html.rd-anim
       ====================================================== */
    const CSS = `
    html.rd-anim { overflow-x: clip; }

    .rd-anim [data-rd] {
        --rd-dur: .6s;
        --rd-y: 14px;
        opacity: 0;
        transform: translateY(var(--rd-y));
        clip-path: inset(0 0 99% 0);
        transition:
            opacity .3s linear var(--rd-d, 0s),
            transform var(--rd-dur) cubic-bezier(.16,1,.3,1) var(--rd-d, 0s),
            clip-path var(--rd-dur) cubic-bezier(.16,1,.3,1) var(--rd-d, 0s);
    }

    /* Título principal: se descubre de izquierda a derecha, como un corte */
    .rd-anim [data-rd="titulo"] {
        --rd-dur: .7s;
        transform: none;
        clip-path: inset(0 99% 0 0);
        transition:
            opacity .15s linear var(--rd-d, 0s),
            clip-path var(--rd-dur) cubic-bezier(.65,0,.35,1) var(--rd-d, 0s);
    }

    /* Textos: solo suben y aparecen, sin corte, para leerse enseguida */
    .rd-anim [data-rd="texto"] {
        --rd-dur: .5s;
        --rd-y: 10px;
        clip-path: none;
    }

    /* Línea roja: se traza */
    .rd-anim [data-rd="linea"] {
        opacity: 1;
        transform: scaleX(0);
        transform-origin: left center;
        clip-path: none;
        transition: transform .45s cubic-bezier(.65,0,.35,1) var(--rd-d, 0s);
    }

    /* Fotos: se descubren de abajo hacia arriba */
    .rd-anim [data-rd="foto"] {
        --rd-dur: .75s;
        transform: none;
        transition:
            opacity .2s linear var(--rd-d, 0s),
            clip-path var(--rd-dur) cubic-bezier(.65,0,.35,1) var(--rd-d, 0s);
    }

    .rd-anim [data-rd].rd-in {
        opacity: 1;
        transform: none;
        clip-path: inset(0 0 0 0);
    }
    .rd-anim [data-rd="texto"].rd-in,
    .rd-anim [data-rd="linea"].rd-in { clip-path: none; }
    .rd-anim [data-rd].rd-fin { will-change: auto; transition: none; }

    /* Celular: recorridos y tiempos más cortos */
    @media (max-width: 768px) {
        .rd-anim [data-rd] { --rd-dur: .45s; --rd-y: 10px; }
        .rd-anim [data-rd="titulo"] { --rd-dur: .55s; }
        .rd-anim [data-rd="texto"] { --rd-dur: .4s; --rd-y: 8px; }
        .rd-anim [data-rd="foto"] { --rd-dur: .55s; }
    }

    /* Contador tipo odómetro */
    .rd-num { font-variant-numeric: tabular-nums; }
    .rd-odo {
        display: inline-block;
        height: 1.15em;
        line-height: 1.15em;
        overflow: hidden;
        vertical-align: bottom;
    }
    .rd-odo > span {
        display: block;
        transition: transform 1s cubic-bezier(.16,1,.3,1) var(--rd-d, 0s);
    }
    .rd-odo > span > span { display: block; height: 1.15em; }
    `;


    /* ======================================================
       QUÉ SE ANIMA
       ====================================================== */
    const GRUPOS = [
        '[class*="grid"]',
        '[class*="cards"]',
        ".values-list",
        ".contact-cards"
    ].join(",");

    const NUMEROS = [
        "[data-contar]",
        ".service-number",
        ".card-number",
        ".process-card > span",
        ".machine-grid h3",
        "[class*='number']"
    ].join(",");

    function marcar(el, tipo, retardo) {
        if (!el || el.hasAttribute("data-rd")) return;
        el.setAttribute("data-rd", tipo);
        el.style.setProperty("--rd-d", retardo.toFixed(2) + "s");
    }

    function tipoDe(el) {
        if (el.matches("h1")) return "titulo";
        if (el.matches(".red-line")) return "linea";
        if (el.matches(".image-slot, .image-placeholder, img, .map-box, [class*='image'], [class*='media'], [class*='thumb']")) return "foto";
        if (el.matches("p, h2, h3, .breadcrumb, .eyebrow, .section-label, .hero-badge, [class*='buttons']")) return "texto";
        return "bloque";
    }

    function dentroDeMarcado(el) {
        return !!(el.parentElement && el.parentElement.closest("[data-rd]"));
    }

    /* 1. Entrada al cargar */
    function prepararEntrada(hero) {
        let i = 0;
        hero.querySelectorAll(
            ".breadcrumb, .hero-badge, .eyebrow, .section-label, h1, .red-line, p, [class*='buttons'], .image-slot, .image-placeholder, img"
        ).forEach(el => {
            if (dentroDeMarcado(el)) return;
            marcar(el, tipoDe(el), 0.05 + i * RITMO.heroPaso);
            i++;
        });
    }

    /* 2. Aparición al bajar */
    function prepararSecciones(secciones) {
        const profundidad = el => { let n = 0; while ((el = el.parentElement)) n++; return n; };

        secciones.forEach(sec => {
            /* Grupos de tarjetas: de adentro hacia afuera, para que
               cada tarjeta se anime una vez y no la columna entera */
            Array.from(sec.querySelectorAll(GRUPOS))
                .sort((a, b) => profundidad(b) - profundidad(a))
                .forEach(grupo => {
                    if (dentroDeMarcado(grupo)) return;
                    const hijos = Array.from(grupo.children)
                        .filter(h => !h.matches("script, style") && !h.querySelector("[data-rd]"));
                    if (hijos.length < 2) return;
                    hijos.forEach((h, n) =>
                        marcar(h, tipoDe(h), Math.min(n, RITMO.grupoMax) * RITMO.grupoPaso));
                });

            /* Títulos, textos y fotos sueltas */
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
        document.querySelectorAll(NUMEROS).forEach(el => {
            if (el.dataset.rdNum || el.closest(".rd-float, header, footer")) return;
            const texto = (el.getAttribute("data-contar") || el.textContent).trim();
            /* En los títulos de máquinas solo cuentan las toneladas
               ("Perkins 45 T"); los modelos ("Haas VF3") no se tocan */
            if (el.matches("h3") && !el.hasAttribute("data-contar") && !/\d+\s*T$/.test(texto)) return;
            const m = texto.match(/^(\D*?)(\d{1,6})(\D*)$/);
            if (!m) return;
            el.classList.add("rd-num");
            el.dataset.rdNum = JSON.stringify({ antes: m[1], valor: m[2], despues: m[3] });
        });
    }

    function contar(el) {
        if (!el.dataset.rdNum || el.dataset.rdContado) return;
        el.dataset.rdContado = "1";

        const { antes, valor, despues } = JSON.parse(el.dataset.rdNum);
        const final = antes + valor + despues;
        el.setAttribute("aria-label", final.trim());

        el.textContent = "";
        if (antes) el.appendChild(document.createTextNode(antes));
        Array.from(valor).forEach((d, i) => {
            const caja = document.createElement("span");
            caja.className = "rd-odo";
            caja.setAttribute("aria-hidden", "true");
            const tira = document.createElement("span");
            tira.style.setProperty("--rd-d", (i * 0.08).toFixed(2) + "s");
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

        /* Al terminar, deja el número como texto normal */
        setTimeout(() => { el.textContent = final; }, 1200 + valor.length * 80);
    }


    /* ======================================================
       ARRANQUE
       ====================================================== */
    function iniciar() {
        if (sinMovimiento || !("IntersectionObserver" in window)) return;

        const main = document.querySelector("main");
        if (!main) return;
        const secciones = Array.from(main.querySelectorAll(":scope > section"));
        if (!secciones.length) return;

        const style = document.createElement("style");
        style.textContent = CSS;
        document.head.appendChild(style);

        html.classList.add("rd-anim");

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
                /* Al terminar, quita la transición: si el texto cambia de
                   tamaño (zoom, girar el celular) no vuelve a animarse */
                setTimeout(() => el.classList.add("rd-fin"), 1600);
            });
        }, { rootMargin: celular ? "0px 0px -4% 0px" : "0px 0px -8% 0px", threshold: 0 });

        requestAnimationFrame(() => requestAnimationFrame(() => {
            document.querySelectorAll("[data-rd]").forEach(el => obs.observe(el));
            document.querySelectorAll("[data-rd-num]").forEach(el => {
                if (!el.closest("[data-rd]")) obs.observe(el);
            });
        }));

        /* Red de seguridad: lo que esté en pantalla y siga oculto, se muestra */
        setTimeout(() => {
            document.querySelectorAll("[data-rd]:not(.rd-in)").forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.top < innerHeight && r.bottom > 0) el.classList.add("rd-in");
            });
        }, 2000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
