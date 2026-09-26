document.addEventListener("DOMContentLoaded", function () {

    /*
     * ==============================
     * HEADER
     * ==============================
     */

    const headerContainer = document.getElementById("site-header");

    if (headerContainer) {

        fetch("header.html")
            .then(response => {

                if (!response.ok) {
                    throw new Error("Header sa nepodarilo načítať.");
                }

                return response.text();

            })
            .then(html => {

                headerContainer.innerHTML = html;

                setActivePage();

            })
            .catch(error => {

                console.error("Header error:", error);

            });

    }


    /*
     * ==============================
     * FOOTER
     * ==============================
     */

    const footerContainer = document.getElementById("site-footer");

    if (footerContainer) {

        fetch("footer.html")
            .then(response => {

                if (!response.ok) {
                    throw new Error("Footer sa nepodarilo načítať.");
                }

                return response.text();

            })
            .then(html => {

                footerContainer.innerHTML = html;

            })
            .catch(error => {

                console.error("Footer error:", error);

            });

    }


    /*
     * ==============================
     * ACTIVE PAGE
     * ==============================
     */

    function setActivePage() {

        const path = window.location.pathname.toLowerCase();

        let currentPage = "home";


        if (
            path.includes("about")
        ) {
            currentPage = "about";
        }

        else if (
            path.includes("payroll")
        ) {
            currentPage = "services";
        }

        else if (
            path.includes("cennik")
        ) {
            currentPage = "pricing";
        }

        else if (
            path.includes("faq")
        ) {
            currentPage = "faq";
        }


        const activeLink = document.querySelector(
            `.main-nav a[data-page="${currentPage}"]`
        );


        if (activeLink) {
            activeLink.classList.add("active");
        }

    }

});
