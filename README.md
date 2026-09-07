# ResQChain

[![Checks](https://github.com/pralav-25/ResQChain/actions/workflows/ci.yml/badge.svg)](https://github.com/pralav-25/ResQChain/actions/workflows/ci.yml)

A disaster-response prototype that gives civilians and shelter operators
separate, focused workflows for emergency information, assistance requests,
capacity, and resource visibility.

[View the live prototype](https://res-q-chain.vercel.app)

## Experiences

- **Public landing page:** explains the response model and routes users to the
  appropriate portal
- **Civilian portal:** local alerts, safe zones, weather, nearby support,
  shelters, and assistance requests
- **Shelter portal:** facility capacity, inventory, pending requests, and alert
  broadcasting

## Stack

- HTML, CSS, and JavaScript
- Tailwind CSS via CDN
- Leaflet with OpenStreetMap tiles
- Font Awesome

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Scope and data

This repository is a front-end prototype. Alerts, forecasts, facility details,
profiles, and aid requests are demonstration data; it is not an operational
emergency service.

## Demo behavior

The shelter portal uses its bundled in-memory mock API. Capacity, inventory,
requests, and alerts reset when the page reloads. No localhost backend is needed.
The civilian forms demonstrate validation and feedback; submissions are not
transmitted. A prominent notice identifies the demo on every portal.

## Validation

With Python 3 and Node.js installed, run `python3 scripts/check_site.py`.
GitHub Actions checks page resources, fragments, duplicate IDs, and inline
JavaScript syntax. There are no live emergency-service integrations to test.
