# National Football Archive — v1

Home, News, ricerca testuale, filtro per giorno/mese/anno, messaggio `No news available` e pagina Statistiche predisposta.

## Aggiungere una news
Modifica `data/news.json` aggiungendo un oggetto:

```json
{"id":4,"title":"Titolo","date":"2026-10-04","description":"Descrizione","category":"Nazionale","url":"#"}
```

Le news vengono ordinate automaticamente dalla più recente alla più vecchia; le prime tre compaiono nella Home.

## GitHub Pages
Carica tutti i file nel repository, poi `Settings → Pages → Deploy from a branch`, seleziona il branch principale e la cartella `/ (root)`.
