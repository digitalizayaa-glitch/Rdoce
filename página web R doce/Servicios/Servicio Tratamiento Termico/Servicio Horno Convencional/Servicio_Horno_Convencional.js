"use strict";


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
    .querySelectorAll("[data-year]")
    .forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });



const EMAIL =
    "ventas@rdocesa.cr";


document
    .querySelectorAll("[data-email]")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const subject =
                    button.dataset.emailSubject ||
                    "Consulta para R Doce";

                const body =
                    "Hola, quisiera solicitar información sobre el servicio de horno convencional de R Doce.";


                const url =
                    "mailto:" + EMAIL + "?subject=" +
                    encodeURIComponent(subject) +
                    "&body=" +
                    encodeURIComponent(body);


                window.location.href = url;

            }
        );

    });



const WHATSAPP_NUMBER = "";


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
                    "Hola, quisiera solicitar información sobre el servicio de horno convencional de R Doce.";


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