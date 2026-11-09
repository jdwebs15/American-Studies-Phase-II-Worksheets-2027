# Audit report — American Studies Phase II rebuild

## Delivered scope

All 12 blocks are included: 12 newly authored 40-question Introductions, 12 newly authored 30-question Reviews, and the 12 original Vocabulary question sets. There are **840 newly authored Intro/Review questions**. No inherited Introduction prompts remain. Vocabulary has 28 questions in Blocks 1–11 and 40 in Block 12; these original questions, options, answers, sources, explanations, and hints are preserved exactly.

Each worksheet owns its questions directly inside its HTML as embedded JSON. There are no external `questions.js` files, shared content pools, or runtime question-bank requests. Shared JavaScript handles interaction, scoring, persistence, and reporting only. Vocabulary’s existing application code and styling are preserved; its original question content was embedded without alteration.

## Actual measured worksheet results

The table reports authored option positions, not runtime permutations. Introductions use 10/10/10/10; Reviews rotate 7/7/8/8. New runs independently shuffle question and option order.

| Block | Assignment | Count | Authored A/B/C/D | Correct uniquely longest | Large length gaps | Maximum key streak |
|---|---|---:|---|---:|---:|---:|
| 1 | introduction | 40 | 10/10/10/10 | 1/40 | 0 | 2 |
| 1 | review | 30 | 7/8/8/7 | 3/30 | 0 | 2 |
| 2 | introduction | 40 | 10/10/10/10 | 1/40 | 0 | 2 |
| 2 | review | 30 | 7/7/8/8 | 3/30 | 0 | 2 |
| 3 | introduction | 40 | 10/10/10/10 | 1/40 | 0 | 2 |
| 3 | review | 30 | 8/7/7/8 | 1/30 | 0 | 2 |
| 4 | introduction | 40 | 10/10/10/10 | 4/40 | 0 | 2 |
| 4 | review | 30 | 8/8/7/7 | 2/30 | 0 | 2 |
| 5 | introduction | 40 | 10/10/10/10 | 2/40 | 0 | 2 |
| 5 | review | 30 | 7/8/8/7 | 1/30 | 0 | 2 |
| 6 | introduction | 40 | 10/10/10/10 | 2/40 | 0 | 2 |
| 6 | review | 30 | 7/7/8/8 | 6/30 | 0 | 2 |
| 7 | introduction | 40 | 10/10/10/10 | 2/40 | 0 | 2 |
| 7 | review | 30 | 8/7/7/8 | 0/30 | 0 | 2 |
| 8 | introduction | 40 | 10/10/10/10 | 4/40 | 0 | 2 |
| 8 | review | 30 | 8/8/7/7 | 4/30 | 0 | 2 |
| 9 | introduction | 40 | 10/10/10/10 | 4/40 | 0 | 2 |
| 9 | review | 30 | 7/8/8/7 | 3/30 | 0 | 2 |
| 10 | introduction | 40 | 10/10/10/10 | 5/40 | 0 | 2 |
| 10 | review | 30 | 7/7/8/8 | 3/30 | 0 | 2 |
| 11 | introduction | 40 | 10/10/10/10 | 1/40 | 0 | 2 |
| 11 | review | 30 | 8/7/7/8 | 6/30 | 0 | 2 |
| 12 | introduction | 40 | 10/10/10/10 | 2/40 | 0 | 2 |
| 12 | review | 30 | 8/8/7/7 | 3/30 | 0 | 2 |
| 1 | Vocabulary — preserved | 28 | 7/7/7/7 | 4/28 | 12 | legacy |
| 2 | Vocabulary — preserved | 28 | 7/7/7/7 | 5/28 | 13 | legacy |
| 3 | Vocabulary — preserved | 28 | 7/7/7/7 | 4/28 | 15 | legacy |
| 4 | Vocabulary — preserved | 28 | 7/7/7/7 | 2/28 | 12 | legacy |
| 5 | Vocabulary — preserved | 28 | 7/7/7/7 | 2/28 | 10 | legacy |
| 6 | Vocabulary — preserved | 28 | 7/7/7/7 | 1/28 | 15 | legacy |
| 7 | Vocabulary — preserved | 28 | 7/7/7/7 | 2/28 | 7 | legacy |
| 8 | Vocabulary — preserved | 28 | 7/7/7/7 | 5/28 | 12 | legacy |
| 9 | Vocabulary — preserved | 28 | 7/7/7/7 | 3/28 | 16 | legacy |
| 10 | Vocabulary — preserved | 28 | 7/7/7/7 | 4/28 | 12 | legacy |
| 11 | Vocabulary — preserved | 28 | 7/7/7/7 | 0/28 | 14 | legacy |
| 12 | Vocabulary — preserved | 40 | 10/10/10/10 | 6/40 | 9 | legacy |

Vocabulary measurements are observational. Its original content was deliberately preserved rather than rewritten or rebalanced. New Intro/Review quality requirements were not retroactively imposed on those supplemental legacy questions.

## Ohio alignment and historical-content review

The official Ohio source was obtained before new question authoring. `standards/ALIGNMENT-BLUEPRINT.md` records every exact Content Statement and Expectation, the official elaboration as required historical knowledge, the cognitive actions, and all mapped question IDs. All CS 1–33 have Introduction and Review coverage. The block labels and numbers remain consistent with the uploaded repository.

| Block | Historical topic | Statements |
|---|---|---|
| 1 | Declaration and Northwest Ordinance | 4, 5 |
| 2 | Constitution and Ratification | 6, 7 |
| 3 | World Power and Isolationism | 14, 15 |
| 4 | Migration, Culture, and the 1920s | 16, 17, 18 |
| 5 | Depression, World War II, and Mobilization | 19, 20, 21 |
| 6 | Nuclear Age and Containment | 22, 23 |
| 7 | Cold War at Home and Abroad | 24, 25, 26 |
| 8 | Rights Movements and Postwar Prosperity | 27, 28 |
| 9 | Migration, Demographics, and Public Policy | 29, 30 |
| 10 | Globalized and Post–Cold War America | 31, 32, 33 |
| 11 | Historical Thinking and Skills | 1, 2, 3 |
| 12 | Industrialization and Progressivism | 8, 9, 10, 11, 12, 13 |

Authoring and revision review addressed historical mechanisms, comparison, institutional effects, significance, and evidence use rather than filling Intro/Review assignments with vocabulary identification. The first content pass exposed weak sweeping distractors, length bias, and similar tasks; these were revised in the actual worksheet HTML. A potentially defensible alternate answer was corrected during revision. Flagged near-duplicate tasks were replaced with different evidence or reasoning targets. Each question has one authored key and four distinct choices.

This is an authoring/revision review, not an independent expert historical review. Automated tests cannot certify historical truth, subtle ambiguity, equivalent meanings, pedagogical difficulty, or answer leakage across every possible reading. Teachers should review instructional suitability and any locally taught interpretations before classroom use. CS 2’s independent written-thesis skill exceeds what multiple-choice selection alone demonstrates; the worksheets assess thesis selection, evidentiary support, refutation, and refinement.

## Automated content checks

`python3 tests/audit.py --strict-content` passes with **0 structural failures and 0 content-warning groups** for the 24 rebuilt worksheets. The checks read the embedded HTML content actually served to students. They measure counts, four-option structure, keys, exact option duplication, near-equivalent option wording, authored position balance, length disparities, repeated position sequences, streaks, exact/near-duplicate prompts within worksheets and between Intro/Review, repeated distractor wording, sweeping-distractor candidates, source/hint policies, standards IDs, HTML paths, and Vocabulary content fingerprints.

Length screening flags a five-word correct-answer advantage over the longest distractor or a 2:1 ratio against the shortest. Worksheet-level uniquely-longest bias is flagged above 40%. The maximum authored position streak is two and repeated four-position patterns are rejected. Exact and lexical near-duplicate prompt findings are zero under the documented thresholds. No all-of-the-above or none-of-the-above options are present. Thresholds were not relaxed to remove findings. Item IDs and measured values are in `tests/audit-results.json`.

A zero-warning result is a screening result, not proof of historical accuracy or universal difficulty. Vocabulary remains a supplemental legacy resource and retains its original quality measurements, including length-gap candidates shown above.

## Historical sources and guidance

All 480 Introduction questions link to anchored sections in 12 included historical readers. These provide the exact relevant official historical explanations, a clearly named CS section, explicit reasoning goals, and attribution. The readers are local static files, so the primary support does not depend on an external website being reachable on a school network. Each question has its own corrective hint and Where to Look guidance identifying the relevant section. Readers also link additional National Archives and OpenStax historical reading where applicable.

Source validation measured **480/480 valid local file/anchor references** and **44 unique HTTP citations with no failures**. Results are in `tests/source-results.json`. One source URL returning 404 was removed; an optional page that did not adequately address its assigned topic was also removed from that use. The official PDF extract’s text was separately checked against the downloaded official pages. Legacy Vocabulary external links were preserved and were not individually network-validated.

Reviews include no instructional links, hints, or Where to Look fields. Their scenarios and any evidence needed for the question are supplied in the prompt. The question text does not pretend constructed instructional scenarios are authentic quotations or archival records.

## Functional tests

24 worksheet-level Node test groups pass completion logic, first-answer preservation, failed-state restoration, stale-save merging, multiple runs, randomization, and malformed/mismatched saves. Chromium tests completed all 24 Intro/Review worksheets using their actual embedded content. Additional edge cases tested corrected Intro mastery, a failed Review, refresh, failed-file import, a failed run followed by a successful run, cumulative attempts, repeated restarts, completion tickets, keyboard interaction, 375px layout, hub links, backend-shaped payloads, and network failure.

Recorded browser checks: 33. No page errors.

- B1 introduction: full clean completion and payload
- B1 review: full clean completion and payload
- B2 introduction: full clean completion and payload
- B2 review: full clean completion and payload
- B3 introduction: full clean completion and payload
- B3 review: full clean completion and payload
- B4 introduction: full clean completion and payload
- B4 review: full clean completion and payload
- B5 introduction: full clean completion and payload
- B5 review: full clean completion and payload
- B6 introduction: full clean completion and payload
- B6 review: full clean completion and payload
- B7 introduction: full clean completion and payload
- B7 review: full clean completion and payload
- B8 introduction: full clean completion and payload
- B8 review: full clean completion and payload
- B9 introduction: full clean completion and payload
- B9 review: full clean completion and payload
- B10 introduction: full clean completion and payload
- B10 review: full clean completion and payload
- B11 introduction: full clean completion and payload
- B11 review: full clean completion and payload
- B12 introduction: full clean completion and payload
- B12 review: full clean completion and payload
- Intro: one wrong, corrected mastery, original 39/40 retained
- Review: first error survives refresh and corrections; no completion ticket
- Review: failed run then clean run yields 61 cumulative attempts; original score retained
- Completed state survives reload
- Failed Review progress-file download/import preserves failure
- Repeated restarts preserve history and reshuffle
- 375px layout and keyboard answer interaction
- Network failure retains local progress and reports unconfirmed send
- Hub: all 12 blocks and 36 assignments

All 12 preserved Vocabulary applications also completed successfully in Chromium with correct answers and no page errors. Their gameplay and reset behavior remain the original supplemental design. The Intro/Review first-answer rule does not apply to Vocabulary.

The responsive mobile page and hub were inspected visually. This is not a full assistive-technology certification, school Chromebook/network test, print certification, or cross-browser matrix. The preferred Phase I reference was not supplied; the rebuilt interface is consistent and modern but is not claimed to be an exact visual reproduction.

## Persistence, ticket rules, and reporting

Review success requires a completed run whose 30 first responses are all correct. An incorrect first response permanently fails that run; corrections produce a practice record without a completion ticket. Restart creates a newly shuffled run and retains earlier runs and attempts. First-ever-run and current-run first scores are separate. Intro success requires all 40 corrected, while keeping the original first responses. No 50-attempt redo threshold is applied. Ordered immutable attempt events survive save/restore and stale merges.

Tickets emphasize student name and cumulative total attempts. Supporting fields include original and current first scores, corrected mastery, current/cumulative attempts, runs/sessions, period, and completion time. Tracking includes first start, end, elapsed, active/away time, tab departures, copy/paste counts, and per-question timing.

The uploaded Apps Script endpoint is preserved exactly. The URL-encoded save wrapper and JSONP load conventions remain; outer reporting field names are retained and run/cumulative/success fields are additive. All browser tests mock or abort backend requests. **No live Apps Script save or load was performed.** Backend source was not supplied; schema acceptance, permissions, quotas, and spreadsheet columns require a live integration check. The browser explicitly distinguishes local saving and a sent-but-unconfirmed request from confirmed server receipt.

V2 assignment keys separate the new run schema from legacy records. Old-format cloud saves are rejected with a clear message rather than silently converted. Legacy migration is not implemented. Local JSON progress export/import is available if server access is blocked. Browser storage is not a tamper-resistant assessment server; persistence protects normal refresh/reopen/restart behavior.

## Teacher review and remaining validation limits

- Confirm alignment with the wording and emphasis of your own lecture and approved curriculum, especially modern policy interpretations and the multiple-choice limits for CS 2.
- Perform an authorized live backend save/load with a test identity and check the destination spreadsheet. No live integration pass is claimed.
- Test on the actual school Chromebook and network; external optional readings and Apps Script may be blocked even though the core worksheets and included readings are local static assets.
- Compare the design with your preferred Phase I reference if exact visual matching is required.
- Review preserved Vocabulary’s legacy length/source findings if revising that supplemental material is later authorized.

The repository requires no runtime build service or external JavaScript dependency. The archive includes every block, the original Vocabulary content, all supporting assets, reusable audits, standards, and deployment instructions. No main-branch overwrite, merge, or production deployment is authorized by this artifact.
