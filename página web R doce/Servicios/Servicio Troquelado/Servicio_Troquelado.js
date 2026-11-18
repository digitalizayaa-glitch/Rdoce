"use strict";

const PAGE = "servicios";
const WHATSAPP_NUMBER = "";
const EMAIL_TO = "ventas@rdocesa.cr";

const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");

if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
        mainNav.classList.toggle("open");
    });
}

document.querySelectorAll("[data-nav]").forEach(link => {
    if (link.dataset.nav === PAGE) {
        link.classList.add("active");
    }
});

document.querySelectorAll("[data-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
});

document.querySelectorAll("[data-email]").forEach(link => {

    link.addEventListener("click", event => {

        event.preventDefault();

        const subject =
            link.dataset.emailSubject ||
            "Consulta - Troquelados";

        const mailtoUrl =
            "mailto:" + EMAIL_TO + "?subject=" +
            encodeURIComponent(subject);

        window.location.href = mailtoUrl;
    });

});

document.querySelectorAll("[data-whatsapp]").forEach(button => {

    button.addEventListener("click", () => {

        if (!WHATSAPP_NUMBER) {
            alert("Falta configurar el número oficial de WhatsApp.");
            return;
        }

        const message =
            button.dataset.whatsappMessage ||
            "Hola, quisiera solicitar información sobre troquelados de R Doce.";

        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
            "_blank"
        );

    });

});