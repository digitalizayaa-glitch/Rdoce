"use strict";


const PAGE = "servicios";

const WHATSAPP_NUMBER = "";

const EMAIL_TO =
    "ventas@rdocesa.cr";


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


document
    .querySelectorAll("[data-nav]")
    .forEach(link => {

        if (link.dataset.nav === PAGE) {

            link.classList.add("active");

        }

    });


document
    .querySelectorAll("[data-year]")
    .forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


document
    .querySelectorAll("[data-email]")
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const subject =
                    link.dataset.emailSubject ||
                    "Consulta sobre servicios de R Doce";

                const mailtoUrl =
                    "mailto:" + EMAIL_TO + "?subject=" +
                    encodeURIComponent(subject);

                window.location.href = mailtoUrl;

            }
        );

    });


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
                    "Hola, quisiera solicitar información sobre los servicios de R Doce.";

                const url =
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    });