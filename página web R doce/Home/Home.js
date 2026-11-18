"use strict";


const PAGE = "inicio";

const WHATSAPP_NUMBER = (window.RDOCE_CONFIG || {}).whatsapp || "";

const EMAIL_TO = (window.RDOCE_CONFIG || {}).email || "ventas@rdocesa.cr";

const EMAIL_SUBJECT =
    "Consulta desde el sitio web de R Doce";

const WHATSAPP_MESSAGE =
    "Hola, quisiera solicitar información sobre los servicios de R Doce.";



/* MENÚ */

const menuButton =
    document.querySelector(".menu-button");

const mainNav =
    document.querySelector(".main-nav");


if (menuButton && mainNav) {

    menuButton.addEventListener(
        "click",
        () => {

            const open =
                mainNav.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(open)
            );

        }
    );

}


/* NAVEGACIÓN ACTIVA */

document
    .querySelectorAll("[data-nav]")
    .forEach(link => {

        if (link.dataset.nav === PAGE) {

            link.classList.add("active");

            link.setAttribute(
                "aria-current",
                "page"
            );

        }

    });


/* AÑO */

document
    .querySelectorAll("[data-year]")
    .forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


/* EMAIL */

document
    .querySelectorAll("[data-email]")
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const subject =
                    link.dataset.emailSubject ||
                    EMAIL_SUBJECT;

                const body =
                    "Hola, quisiera solicitar información a R Doce.";

                const mailtoUrl =
                    "mailto:" + EMAIL_TO + "?subject=" +
                    encodeURIComponent(subject) +
                    "&body=" +
                    encodeURIComponent(body);

                window.location.href = mailtoUrl;

            }
        );

    });


/* WHATSAPP */

document
    .querySelectorAll("[data-whatsapp]")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                if (!WHATSAPP_NUMBER) {

                    alert(
                        "Falta configurar el número oficial de WhatsApp de R Doce."
                    );

                    return;
                }

                const message =
                    button.dataset.whatsappMessage ||
                    WHATSAPP_MESSAGE;

                const url =
                    "https://wa.me/" +
                    WHATSAPP_NUMBER +
                    "?text=" +
                    encodeURIComponent(message);

                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    });