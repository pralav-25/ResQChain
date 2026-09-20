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

## Try the portals

After starting the local server, open [index.html](index.html) to choose a role,
or go directly to [civilian.html](civilian.html) or [shelter.html](shelter.html).

In the shelter portal, change capacity or an inventory quantity and save it.
Try a negative quantity to see validation, then enter a non-negative whole
number. Reload the page to return to the initial demonstration data.

The portals do not share a live backend. An edit in one tab will not synchronize
to another tab or send assistance requests to a real shelter.

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

## Shelter demo

The shelter page supports capacity and inventory edits, profile changes, local
practice alerts, and the request packing/delivery cycle. State belongs to the
current tab and resets on reload; no backend or emergency service is contacted.
Polling preserves unsaved form edits. Invalid quantities are rejected.

Run `node --test tests/*.test.mjs` to verify the demo state transitions.

## Restock planner

The shelter inventory view compares saved stock with undelivered demo requests
for water, meals, first-aid kits, and fuel. It displays available stock, requested
quantities, and any shortfall, updating after inventory saves and request changes.
Packed requests remain included until delivered. Unsaved form edits do not alter
the plan. This is a planning preview; it does not reserve or deduct stock.
