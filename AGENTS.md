# Project release preference

The user requests that each completed update to this project be pushed to GitHub and published as a versioned release, without asking again each time.

- Target: existing private repository `13784342876x-lab/resume-pulse-extension`.
- For each completed code update, increment the extension version consistently using `npm run version:set -- <version>`.
- Run `npm run check` and `npm run package`. Only release after both succeed.
- Commit only relevant project changes, push `main`, and push the matching `v<version>` tag to trigger the existing release workflow.
- Verify the workflow and downloadable ZIP; report failures honestly instead of claiming a release succeeded.
- Never upload personal resumes, profile exports, secrets, or temporary files. Keep the repository private.
- Do not force-push or replace published tags. Preserve unrelated user changes.
- This is part of the update workflow, not a request for a scheduled background task.
