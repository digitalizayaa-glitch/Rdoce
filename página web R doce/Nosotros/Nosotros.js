"use strict";


const WHATSAPP_NUMBER = "";

const EMAIL_TO = "ventas@rdocesa.cr";


const menuButton =
    document.querySelector(".menu-button");

const mainNav =
    document.querySelector(".main-nav");


if (menuButton && mainNav) {

    menuButton.addEventListener("click", () => {

        const abierto =
            mainNav.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            String(abierto)
        );

    });

}


document
    .querySelectorAll("[data-year]")
    .forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


document
    .querySelectorAll("[data-email]")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const subject =
                    button.dataset.emailSubject ||
                    "Consulta sobre R Doce";

                const body =
                    "Hola, quisiera solicitar información sobre R Doce.";

                const mailtoUrl =
                    "mailto:" + EMAIL_TO + "?subject=" +
                    encodeURIComponent(subject) +
                    "&body=" +
                    encodeURIComponent(body);

                window.location.href = mailtoUrl;

            }
        );

    });


document
    .querySelectorAll("[data-whatsapp]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (!WHATSAPP_NUMBER) {

                    alert(
                        "Falta configurar el número oficial de WhatsApp de R Doce."
                    );

                    return;
                }

                const message =
                    "Hola, quisiera solicitar información sobre R Doce.";

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