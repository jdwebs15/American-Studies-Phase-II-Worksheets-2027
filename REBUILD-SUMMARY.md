# Rebuild summary

All 12 blocks are included, retaining Block 12's `industrialization-progressivism-*` paths. The date-independent hub links 12 Introductions, 12 Reviews, and 12 Vocabulary supplements. The Intro/Review set contains 840 newly authored questions; no inherited Introduction prompts remain.

## Worksheet-owned questions

Each worksheet's `index.html` contains its own questions in an `assignment-data` JSON script element. There are no external question-bank files or shared question pools. Shared CSS/JavaScript handles the interface, randomization, scoring, saving, reporting, and tickets. Vocabulary's original question content is preserved exactly; its former external question file is embedded in the worksheet HTML. Its legacy app and styling remain unchanged.

## Student behavior

Introductions link local historical readings and specific guidance, provide individual corrective hints, and require 40/40 corrected mastery while retaining first answers. Reviews supply independent scenarios, have no instructional support links, and issue a ticket only for 30/30 first answers in one run. A failed run remains failed after corrections or refresh. A new run reshuffles questions and options and preserves prior scores and attempts. Name, eight periods, school email, device saving, progress-file export/import, and backend send/load controls are included.

Tickets emphasize STUDENT NAME and TOTAL ATTEMPTS. First-ever/current scores, corrected mastery, current/cumulative attempts, runs, sessions, class period, and completion time remain visible.

## Sources and standards

Twelve included historical readers contain 33 anchored, attributed official historical explanations and additional historical links. The official American History PDF extract contains the source's printed pages 101–120; its text was verified unchanged after whitespace normalization. Exact Content Statements, Expectations for Learning, elaborations, cognitive actions, and question mappings appear in the alignment blueprint.

## Validation

The strict content/structure audit passes without flagged findings for the rebuilt assignments. All 24 Intro/Review applications and 12 preserved Vocabulary applications completed in Chromium; required failure/save/restart edge cases passed. All 480 Intro source anchors and the readers' unique external HTTP citations were checked. See the report and machine-readable test results for actual measurements.

Automated screening does not independently certify historical accuracy. The audit documents teacher review items, CS 2's written-thesis assessment limits, preserved Vocabulary findings, and device/accessibility validation limits.

## Backend

The original Apps Script URL and save/load conventions are retained. Additional run fields are additive. Live submissions and cloud loading were not tested; all automated requests were mocked or aborted. Check the real destination spreadsheet before classroom use. V2 assignment keys separate the new run schema; old cloud saves are not silently migrated. Downloaded progress files provide a fallback.

## Preview and testing

From the extracted repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. HTTP provides a stable storage origin; avoid relying on `file://` behavior.

Development validation requires Python 3 and Node.js. The published site requires neither.

```sh
python3 tests/audit.py --strict-content
node tests/core.test.cjs
python3 tests/sources.py
```

For browser validation, install the development-only Playwright dependency with `npm install` and its browser with `npx playwright install chromium`, then run:

```sh
python3 tests/run.py --sources
```

Set `CHROMIUM_PATH` if using a particular system browser. Tests use port 8765 and intercept Apps Script traffic. They do not create live student records. No node_modules or development caches belong in the deployment ZIP.

## GitHub Pages deployment after your review

1. Preserve the original repository as a fallback and review the new material in a separate development branch.
2. Extract the ZIP. Put the contents of its top-level repository folder at the intended Pages root, keeping `shared/`, `sources/`, `standards/`, and `worksheets/` together.
3. Preview all 36 assignment links under the real repository subpath. Confirm source access, an authorized backend save/load, and student Chromebook behavior.
4. Merge or deploy only with your explicit approval. No change to live main or production is required for downloading and reviewing this ZIP.

The runtime site uses static HTML/CSS/JavaScript, without a build service or third-party script libraries.
