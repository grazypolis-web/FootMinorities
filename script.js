const MONTHS=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
let news=[];let filter={day:'',month:'',year:''};
const $=id=>document.getElementById(id);
document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('#year,#footerYear').forEach(e=>e.textContent=new Date().getFullYear());load();if($('search')){$('search').addEventListener('input',renderNews);$('clear').onclick=()=>{$('search').value='';renderNews()};$('calendar').onclick=()=>{$('panel').hidden=!$('panel').hidden};$('apply').onclick=()=>{filter={day:$('day').value,month:$('month').value,year:$('yearFilter').value};$('panel').hidden=true;renderNews()};$('reset').onclick=()=>{filter={day:'',month:'',year:''};$('day').value='';$('month').value='';$('yearFilter').value='';renderNews()}}});
async function load(){try{let r=await fetch('data/news.json');if(!r.ok)throw Error();news=await r.json();news.sort((a,b)=>new Date(b.date)-new Date(a.date));setupFilters();renderHome();renderNews()}catch(e){showError()}}
function setupFilters(){if(!$('yearFilter'))return;[...new Set(news.map(n=>new Date(n.date).getFullYear()))].sort((a,b)=>b-a).forEach(y=>$('yearFilter').insertAdjacentHTML('beforeend',`<option value="${y}">${y}</option>`));for(let i=1;i<=31;i++)$('day').insertAdjacentHTML('beforeend',`<option value="${i}">${i}</option>`)}
function renderHome(){if(!$('homeNews'))return;$('homeNews').innerHTML=news.slice(0,3).map(card).join('')||empty()}
function renderNews(){if(!$('allNews'))return;let q=($('search').value||'').trim().toLowerCase();let result=news.filter(n=>{let d=new Date(n.date);return(!q||`${n.title} ${n.description} ${n.category||''}`.toLowerCase().includes(q))&&(!filter.day||d.getDate()==filter.day)&&(!filter.month||d.getMonth()+1==filter.month)&&(!filter.year||d.getFullYear()==filter.year)});$('filters').textContent=[q?`Ricerca: "${q}"`:'' ,filter.day?`Giorno: ${filter.day}`:'',filter.month?`Mese: ${MONTHS[filter.month-1]}`:'',filter.year?`Anno: ${filter.year}`:''].filter(Boolean).join(' · ');$('allNews').innerHTML=result.length?result.map(card).join(''):`<div class="empty"><h2>No news available</h2><p>Non sono state trovate news corrispondenti ai filtri selezionati.</p></div>`}
function card(n){return `<article class="card"><div class="meta"><span>${esc(n.category||'News')}</span><time>${format(n.date)}</time></div><h2>${esc(n.title)}</h2><p>${esc(n.description)}</p><a href="${esc(n.url||'#')}">Leggi articolo →</a></article>`}
function format(s){let d=new Date(s);return `${String(d.getDate()).padStart(2,'0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`}
function empty(){return `<div class="empty"><h2>No news available</h2></div>`}function showError(){document.querySelectorAll('#homeNews,#allNews').forEach(e=>e.innerHTML='<div class="empty"><h2>Impossibile caricare le news</h2><p>Controlla data/news.json.</p></div>')}function esc(v){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
/* =====================================================
   STATISTICHE - NAZIONALI E PARTITE
   ===================================================== */

const teamsList = document.getElementById("teams-list");
const matchesPanel = document.getElementById("matches-panel");
const matchesOverlay = document.getElementById("matches-overlay");
const matchesContent = document.getElementById("matches-content");
const closePanelButton = document.getElementById("close-panel");

const reportLightbox = document.getElementById("report-lightbox");
const reportImage = document.getElementById("report-image");
const closeLightboxButton = document.getElementById("close-lightbox");


if (teamsList) {

    fetch("data/national_teams.json")
        .then(response => response.json())
        .then(teams => {

            teamsList.innerHTML = "";

            teams.forEach((team, index) => {

                const button = document.createElement("button");

                button.className = "team-item";

                button.innerHTML = `
                    <img src="${team.logo}" alt="${team.name}">
                    <span class="team-name">${team.name}</span>
                    <span class="team-arrow">→</span>
                `;

                button.addEventListener("click", () => {
                    openTeam(team);
                });

                teamsList.appendChild(button);

            });

        })
        .catch(error => {

            console.error("Errore caricamento nazionali:", error);

            teamsList.innerHTML = `
                <p>
                    Impossibile caricare le nazionali.
                </p>
            `;

        });

}


/* APRE LA LISTA DELLE PARTITE */

function openTeam(team) {

    matchesContent.innerHTML = `

        <h2 class="matches-title">
            ${team.name}
        </h2>

        <div id="matches-list"></div>

    `;

    const matchesList = document.getElementById("matches-list");

    if (!team.matches || team.matches.length === 0) {

        matchesList.innerHTML = `
            <p>No matches available.</p>
        `;

    } else {

        team.matches.forEach(match => {

            const matchButton = document.createElement("button");

            matchButton.className = "match-item";

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

            matchButton.addEventListener("click", () => {

                openReport(match.report);

            });

            matchesList.appendChild(matchButton);

        });

    }

    matchesPanel.classList.add("open");
    matchesOverlay.classList.add("open");

}


/* CHIUDE IL PANNELLO */

function closeMatchesPanel() {

    matchesPanel.classList.remove("open");
    matchesOverlay.classList.remove("open");

}

closePanelButton.addEventListener(
    "click",
    closeMatchesPanel
);

matchesOverlay.addEventListener(
    "click",
    closeMatchesPanel
);


/* APRE IL REFERTO */

function openReport(reportPath) {

    reportImage.src = reportPath;

    reportLightbox.classList.add("open");

}


/* CHIUDE IL REFERTO */

function closeReport() {

    reportLightbox.classList.remove("open");

    reportImage.src = "";

}

closeLightboxButton.addEventListener(
    "click",
    closeReport
);

reportLightbox.addEventListener(
    "click",
    event => {

        if (event.target === reportLightbox) {
            closeReport();
        }

    }
);


/* ESC PER CHIUDERE */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeMatchesPanel();
            closeReport();

        }

    }
);
