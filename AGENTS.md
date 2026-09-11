<!-- shared-guidance:begin -->
## Shared engineering rules

Before relevant work, read the locally committed rules below and
[REVIEW.md](REVIEW.md) before reviewing. These links are required reading,
not automatically discovered instruction files. Preserve stricter local rules.

- Read [development](.engineering/standards/development.md).
- Read [documentation](.engineering/standards/documentation.md).
- Read [git](.engineering/standards/git.md).
- Read [review](.engineering/standards/review.md).
- Read [verification](.engineering/standards/verification.md).

Read applicable nested instructions before changing their areas.
See [.engineering/NOTICE.md](.engineering/NOTICE.md) for attribution.
<!-- shared-guidance:end -->

# Project contributor guide

## Purpose

Saltcorn Money field plugin. Values are stored as scaled integers; field precision and optional currency control display and editing.

## Map

- [index.js](index.js): plugin API version 1, field attributes, display/edit fieldviews and read conversion.
- [package.json](package.json): package metadata and Jest script.
- [README.md](README.md): storage and display example; [LICENSE](LICENSE): original MIT attribution.

## Protected state and authority

Preserve contributor attribution, existing work and stored values. Changing decimal_points on an existing field changes interpretation of every stored integer; do not silently rescale or alter precision. Preserve hidden-input names and native field attributes. Keep `.history/` out of canonical guidance and never install/restart the plugin in a live Saltcorn instance for a documentation task.

## Contribution base and metadata

The verified contribution base is `main`. Without a real ticket, use `feature/<work-description>` and descriptive commit/PR subjects; never invent tracking identifiers. Use normal follow-up commits, preserve genuine attribution and the organization template's conditional disclosure footer. Review in French, use la claim and chiffrage when relevant, and do not use em dashes. These shared rules are proposed pending review of their source revision.

## Verification

No Node engine or runtime pin, lockfile, CI workflow or tracked tests is declared. package.json exposes `npm test` (Jest), but no test files were found: do not report this as a working test baseline. `node --check index.js` is an offline syntax check that does not load Saltcorn. Behavioral changes need synthetic cases for precision, zero, empty/null input, locale, currency, hidden form values and escaping, with an explicitly disposable Saltcorn environment if integration is needed. Runtime dependency ranges differ between dependencies and devDependencies; verify the chosen host compatibility instead of inventing a version pin. Guidance uses local link/path/manifest checks.

## Canonical documentation

Update [README.md](README.md) in the same PR when storage, precision, formatting or configuration behavior changes. Preserve the distinction between display value and stored integer. Do not copy historical package snapshots into current setup instructions.

## Nested guidance

No tracked nested AGENTS.md or AGENTS.override.md was found at adoption. Read this root guide, the locally committed shared rules and REVIEW.md explicitly before relevant work, including work started in a subdirectory. Do not rely on sibling checkouts or network access. Recheck applicable overrides when beginning a task; preserve personal overrides and report conflicts.

## Code Review Rules

Read the root REVIEW.md and relevant nested guidance before reviewing.

Rédiger la revue en français. Vérifier l'intégrité des montants stockés, la précision, les valeurs nulles et zéro, les locales, les devises et l'échappement HTML/attributs. Contrôler la synchronisation entre champ visible et champ caché, les états disabled/readonly et les contrats Saltcorn. Ne pas confondre vérification syntaxique et test de conversion ou de formulaire.
