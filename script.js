document.addEventListener("DOMContentLoaded", function () {

    const track = document.getElementById("testimonialsTrack");

    if (!track) {
        return;
    }

    /*
     * Duplikujeme referencie.
     * Vďaka tomu môže carousel plynulo pokračovať
     * bez viditeľného preskočenia.
     */

    const cards = Array.from(track.children);

    cards.forEach(function (card) {

        const clone = card.cloneNode(true);

        clone.setAttribute("aria-hidden", "true");

        track.appendChild(clone);

    });

});
