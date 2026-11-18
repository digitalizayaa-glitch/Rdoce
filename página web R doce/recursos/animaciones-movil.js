"use strict";

/* =========================================================
   ANIMACIONES PARA CELULAR Y TABLET
   Solo se activan en pantallas de hasta 900px y cuando el
   usuario no tiene activado "reducir movimiento".
   ========================================================= */

(function () {

    const mobile =
        window.matchMedia("(max-width: 900px)");

    const reducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)");

    if (
        !mobile.matches ||
        reducedMotion.matches ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    const root = document.documentElement;

    root.classList.add("anim-movil");


    /* ---------- Elementos que aparecen al hacer scroll ---------- */

    const REVEAL_SELECTORS = [
        "main .breadcrumb",
        "main .section-label",
        "main .eyebrow",
        "main h1",
        "main h2",
        "main h3",
        "main .red-line",
        "main p",
        "main .btn",
        "main .button",
        "main .service-card",
        "main .process-card",
        "main .thermal-card",
        "main .navigation-card",
        "main .contact-cards > *",
        "main .work-cards > *",
        "main .feature",
        "main .client",
        "main .platform-link",
        "main .quality-box",
        "main .equipment-title",
        "main .service-link",
        "main .image-slot",
        "main .image-placeholder",
        "main img",
        ".site-footer .footer-brand",
        ".site-footer .footer-links",
        ".site-footer .footer-contact"
    ].join(",");

    const ZOOM_SELECTORS =
        ".image-slot, .image-placeholder, img";

    const candidates =
        Array.from(document.querySelectorAll(REVEAL_SELECTORS));

    const marked = new Set();

    candidates.forEach(element => {

        /* Si un contenedor ya se anima, no animar también su contenido */

        let parent = element.parentElement;

        while (parent) {
            if (marked.has(parent)) {
                return;
            }
            parent = parent.parentElement;
        }

        marked.add(element);

        element.classList.add("anim-reveal");

        if (element.matches(ZOOM_SELECTORS)) {
            element.classList.add("anim-zoom");
        }

    });


    const observer = new IntersectionObserver(
        entries => {

            let order = 0;

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                const element = entry.target;

                /* Pequeño escalonado entre elementos que aparecen juntos */

                element.style.setProperty(
                    "--anim-delay",
                    Math.min(order * 80, 400) + "ms"
                );

                order += 1;

                element.classList.add("anim-visible");

                /* Al terminar, quitar el retraso para que el toque responda al instante */

                element.addEventListener(
                    "transitionend",
                    () => element.style.removeProperty("--anim-delay"),
                    { once: true }
                );

                observer.unobserve(element);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -6% 0px"
        }
    );

    marked.forEach(element => observer.observe(element));


    /* ---------- Sombra del encabezado al bajar ---------- */

    const header =
        document.querySelector(".site-header");

    if (header) {

        const updateHeader = () => {
            header.classList.toggle(
                "anim-scrolled",
                window.scrollY > 8
            );
        };

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );

    }

})();
