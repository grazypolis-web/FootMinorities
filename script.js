/* =====================================================
   NEWS
   ===================================================== */

const MONTHS = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre"
];

let news = [];

let filter = {
    day: "",
    month: "",
    year: ""
};


const $ = id => document.getElementById(id);


/* =====================================================
   AVVIO
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    document
        .querySelectorAll("#year, #footerYear")
        .forEach(element => {
            element.textContent = new Date().getFullYear();
        });


    loadNews();


    /*
       FILTRI NEWS
    */

    if ($("search")) {

        $("search").addEventListener(
            "input",
            renderNews
        );


        if ($("clear")) {
            $("clear").onclick = () => {

                $("search").value = "";

                renderNews();

            };
        }


        if ($("calendar")) {
            $("calendar").onclick = () => {

                $("panel").hidden =
                    !$("panel").hidden;

            };
        }


        if ($("apply")) {
            $("apply").onclick = () => {

                filter = {
                    day: $("day").value,
                    month: $("month").value,
                    year: $("yearFilter").value
                };

                $("panel").hidden = true;

                renderNews();

            };
        }


        if ($("reset")) {
            $("reset").onclick = () => {

                filter = {
                    day: "",
                    month: "",
                    year: ""
                };

                $("day").value = "";
                $("month").value = "";
                $("yearFilter").value = "";

                renderNews();

            };
        }

    }

});


/* =====================================================
   CARICAMENTO NEWS
   ===================================================== */

async function loadNews() {

    try {

        const response =
            await fetch("data/news.json");


        if (!response.ok) {
            throw new Error(
                "Impossibile caricare news.json"
            );
        }


        news = await response.json();


        news.sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


        setupFilters();

        renderHome();

        renderNews();


    } catch (error) {

        console.error(
            "Errore caricamento news:",
            error
        );

        showError();

    }

}


/* =====================================================
   FILTRI
   ===================================================== */

function setupFilters() {

    if (!$("yearFilter")) {
        return;
    }


    [
        ...new Set(
            news.map(
                item =>
                    new Date(item.date)
                        .getFullYear()
            )
        )
    ]
        .sort((a, b) => b - a)
        .forEach(year => {

            $("yearFilter").insertAdjacentHTML(
                "beforeend",
                `<option value="${year}">${year}</option>`
            );

        });


    for (let day = 1; day <= 31; day++) {

        $("day").insertAdjacentHTML(
            "beforeend",
            `<option value="${day}">${day}</option>`
        );

    }

}


/* =====================================================
   HOME NEWS
   ===================================================== */

function renderHome() {

    if (!$("homeNews")) {
        return;
    }


    $("homeNews").innerHTML =
        news
            .slice(0, 3)
            .map(card)
            .join("")
        ||
        empty();

}


/* =====================================================
   PAGINA NEWS
   ===================================================== */

function renderNews() {

    if (!$("allNews")) {
        return;
    }


    const query =
        ($("search").value || "")
            .trim()
            .toLowerCase();


    const result =
        news.filter(item => {

            const date =
                new Date(item.date);


            const text =
                `${item.title}
                 ${item.description}
                 ${item.category || ""}`
                    .toLowerCase();


            return (

                (!query ||
                    text.includes(query))

                &&

                (!filter.day ||
                    date.getDate() == filter.day)

                &&

                (!filter.month ||
                    date.getMonth() + 1 ==
                    filter.month)

                &&

                (!filter.year ||
                    date.getFullYear() ==
                    filter.year)

            );

        });


    $("filters").textContent = [

        query
            ? `Ricerca: "${query}"`
            : "",

        filter.day
            ? `Giorno: ${filter.day}`
            : "",

        filter.month
            ? `Mese: ${MONTHS[filter.month - 1]}`
            : "",

        filter.year
            ? `Anno: ${filter.year}`
            : ""

    ]
        .filter(Boolean)
        .join(" · ");


    $("allNews").innerHTML =
        result.length

            ? result.map(card).join("")

            : `
                <div class="empty">

                    <h2>No news available</h2>

                    <p>
                        Non sono state trovate news
                        corrispondenti ai filtri selezionati.
                    </p>

                </div>
            `;

}


/* =====================================================
   CARD NEWS
   ===================================================== */

function card(item) {

    return `
        <article class="card">

            <div class="meta">

                <span>
                    ${esc(item.category || "News")}
                </span>

                <time>
                    ${format(item.date)}
                </time>

            </div>


            <h2>
                ${esc(item.title)}
            </h2>


            <p>
                ${esc(item.description)}
            </p>


            <a href="${esc(item.url || "#")}">
                Leggi articolo →
            </a>

        </article>
    `;

}


/* =====================================================
   FORMATTAZIONE DATA
   ===================================================== */

function format(dateString) {

    const date =
        new Date(dateString);


    return `
        ${String(date.getDate()).padStart(2, "0")}
        ${MONTHS[date.getMonth()]}
        ${date.getFullYear()}
    `;

}


/* =====================================================
   NEWS VUOTE
   ===================================================== */

function empty() {

    return `
        <div class="empty">

            <h2>
                No news available
            </h2>

        </div>
    `;

}


/* =====================================================
   ERRORE NEWS
   ===================================================== */

function showError() {

    document
        .querySelectorAll(
            "#homeNews, #allNews"
        )
        .forEach(element => {

            element.innerHTML = `
                <div class="empty">

                    <h2>
                        Impossibile caricare le news
                    </h2>

                    <p>
                        Controlla data/news.json.
                    </p>

                </div>
            `;

        });

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function esc(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

/* =====================================================
   STATISTICHE - NAZIONALI E PARTITE
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const teamsList =
        document.getElementById("teams-list");

    const matchesPanel =
        document.getElementById("matches-panel");

    const matchesOverlay =
        document.getElementById("matches-overlay");

    const matchesContent =
        document.getElementById("matches-content");

    const closePanelButton =
        document.getElementById("close-panel");

    const reportLightbox =
        document.getElementById("report-lightbox");

    const reportImage =
        document.getElementById("report-image");

    const closeLightboxButton =
        document.getElementById("close-lightbox");


    /* =====================================================
       CARICAMENTO NAZIONALI
       ===================================================== */

    if (teamsList) {

        fetch("data/national_teams.json")

            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Impossibile caricare national_teams.json"
                    );
                }

                return response.json();

            })

            .then(teams => {

                teamsList.innerHTML = "";

                teams.forEach(team => {

                    const button =
                        document.createElement("button");

                    button.className = "team-item";

                    button.innerHTML = `
                        <img
                            src="${team.logo}"
                            alt="${team.name}"
                        >

                        <span class="team-name">
                            ${team.name}
                        </span>

                        <span class="team-arrow">
                            →
                        </span>
                    `;

                    button.addEventListener(
                        "click",
                        () => openTeam(team)
                    );

                    teamsList.appendChild(button);

                });

            })

            .catch(error => {

                console.error(
                    "Errore caricamento nazionali:",
                    error
                );

                teamsList.innerHTML = `
                    <p>
                        Impossibile caricare le nazionali.
                    </p>
                `;

            });

    }


    /* =====================================================
       APRE LA LISTA DELLE PARTITE
       ===================================================== */

    function openTeam(team) {

        matchesContent.innerHTML = `

            <h2 class="matches-title">
                ${team.name}
            </h2>

            <div id="matches-list"></div>

        `;

        const matchesList =
            document.getElementById("matches-list");


        if (
            !team.matches ||
            team.matches.length === 0
        ) {

            matchesList.innerHTML = `
                <p>
                    No matches available.
                </p>
            `;

        } else {

            team.matches.forEach(match => {

                const matchButton =
                    document.createElement("button");

                matchButton.className =
                    "match-item";

                matchButton.innerHTML = `

                    <div class="match-date">
                        ${match.date}
                    </div>

                    <div class="match-score">
                        ${match.home}
                        ${match.homeScore}
                        -
                        ${match.awayScore}
                        ${match.away}
                    </div>

                `;

                matchButton.addEventListener(
                    "click",
                    () => openReport(match.report)
                );

                matchesList.appendChild(
                    matchButton
                );

            });

        }

        matchesPanel.classList.add("open");
        matchesOverlay.classList.add("open");

    }


    /* =====================================================
       CHIUDE IL PANNELLO
       ===================================================== */

    function closeMatchesPanel() {

        if (matchesPanel) {
            matchesPanel.classList.remove("open");
        }

        if (matchesOverlay) {
            matchesOverlay.classList.remove("open");
        }

    }


    if (closePanelButton) {

        closePanelButton.addEventListener(
            "click",
            closeMatchesPanel
        );

    }


    if (matchesOverlay) {

        matchesOverlay.addEventListener(
            "click",
            closeMatchesPanel
        );

    }


    /* =====================================================
       APRE IL REFERTO
       ===================================================== */

    function openReport(reportPath) {

        if (!reportPath) {

            console.error(
                "Nessun percorso del referto."
            );

            return;

        }

        reportImage.src = reportPath;

        reportLightbox.classList.add("open");

    }


    /* =====================================================
       CHIUDE IL REFERTO
       ===================================================== */

    function closeReport() {

        if (reportLightbox) {
            reportLightbox.classList.remove("open");
        }

        if (reportImage) {
            reportImage.src = "";
        }

    }


    if (closeLightboxButton) {

        closeLightboxButton.addEventListener(
            "click",
            closeReport
        );

    }


    if (reportLightbox) {

        reportLightbox.addEventListener(
            "click",
            event => {

                if (event.target === reportLightbox) {
                    closeReport();
                }

            }
        );

    }


    /* =====================================================
       TASTO ESC
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMatchesPanel();
                closeReport();

            }

        }
    );


    /* =====================================================
       STATISTICHE GENERALI
       ===================================================== */

    const totalTeamsElement =
        document.getElementById("total-teams");

    const totalMatchesElement =
        document.getElementById("total-matches");

    const totalGoalsElement =
        document.getElementById("total-goals");

    const lastMatchElement =
        document.getElementById("last-match");


    if (totalTeamsElement) {

        fetch("data/national_teams.json")

            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Impossibile caricare national_teams.json"
                    );
                }

                return response.json();

            })

            .then(teams => {

                /* NUMERO NAZIONALI */

                totalTeamsElement.textContent =
                    teams.length;


                /* TUTTE LE PARTITE */

                const allMatches =
                    teams.flatMap(
                        team => team.matches || []
                    );


                /* NUMERO PARTITE */

                totalMatchesElement.textContent =
                    allMatches.length;


                /* TOTALE GOL */

                const totalGoals =
                    allMatches.reduce(
                        (total, match) => {

                            return total
                                + Number(match.homeScore)
                                + Number(match.awayScore);

                        },
                        0
                    );


                totalGoalsElement.textContent =
                    totalGoals;


                /* ULTIMA PARTITA */

                if (allMatches.length > 0) {

                    const sortedMatches =
                        [...allMatches].sort(
                            (a, b) => {

                                const dateA =
                                    new Date(
                                        a.date
                                            .split("-")
                                            .reverse()
                                            .join("-")
                                    );

                                const dateB =
                                    new Date(
                                        b.date
                                            .split("-")
                                            .reverse()
                                            .join("-")
                                    );

                                return dateB - dateA;

                            }
                        );

                    lastMatchElement.textContent =
                        sortedMatches[0].date;

                } else {

                    lastMatchElement.textContent =
                        "—";

                }

            })

            .catch(error => {

                console.error(
                    "Errore caricamento statistiche:",
                    error
                );

            });

    }

});
