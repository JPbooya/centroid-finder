# AI-Suggested Improvements

Categories match the assignment. The AI read the code but did not run it, so confirm each item
before changing anything. Items marked **(high)** looked most valuable.

# Required

## Refactoring code
- Move the repeated "filename must not contain a path" check (process and thumbnail routes) into shared validation middleware.
- Centralize the job status strings (`processing`, `done`, `error`), which are literals spread across files.
- Make `jobs.js` open the database in an init function instead of on `require`, so it is easier to test.
- Remove dead code: unused `path` import in `app.js`; check whether `JavaCvFrameSource.frameRate()` is used.
- `LargestGroupSelector` re-scans a list the group finder already sorted; simplify.

## Adding tests
- **(high)** CI only runs the Java tests. Add a job that runs `npm test` in `server/`, and run CI on push as well as PRs.
- Java classes with no tests: `VideoSummaryApp`, `JavaCvFrameSource`, `ImageSummaryApp`, `Group`, `Coordinate`.
- `DfsBinaryGroupFinder` edge cases: ragged rows, 1x1 image, all-white image, very large frame (overflow).
- `CsvWriter` output format (number formatting, the "no group" row).
- Server: concurrent jobs on the same video, job timeout, recovery after a restart, path-traversal attempts.
- One end-to-end test with a tiny real video and the real JAR (everything is mocked today).

## Improving error handling
- **(high)** Java app exits with code 0 on failure, so the server scrapes stdout for a success message. Exit non-zero on failure, then simplify the success check in `runner.js`.
- **(high)** Jobs left as "processing" after a server restart stay that way forever. Mark them errored on startup and add a timeout for the Java process.
- Handle a `null` return from `converter.convert` in `JavaCvFrameSource` (corrupt or unsupported video) with a clear message.
- Bad or missing filenames return 500 in the process and thumbnail routes; 400/404 would be correct. *Check the front end first, since it may rely on the current codes.*
- Add a 404 handler and a final Express error-handling middleware.
- Kill running Java processes and mark their jobs errored when the server shuts down.
- DFS input validation does not match its Javadoc: ragged rows throw `ArrayIndexOutOfBounds` instead of `IllegalArgumentException`, and values other than 0/1 are accepted.

## Writing documentation
- **(high)** Replace the assignment text in the root `README.md` with: what the project is, prerequisites (JDK, Maven), how to build the JAR, `.env` variables, how to start the server, how to run tests.
- Document each API endpoint (parameters, status codes, job lifecycle).
- Document the CSV format, including what `-1,-1` means.
- Add Javadoc to `VideoProcessor`, `JavaCvFrameSource`, and `CsvWriter`.
- Update `humanImprovements.md`: parts of it refer to front-end files that now live in another repo.

# Optional

## Improving performance
- Thumbnails spawn ffmpeg on every request; add caching headers or cache the file.
- Cap the stdout/stderr buffering in `runner.js`, which grows without limit.
- Per-frame allocation in Java (a `Coordinate` object per pixel in the DFS) could be reduced, but only after measuring that it matters.

## Hardening security
- Cap the number of concurrent Java jobs so one client cannot exhaust memory.
- Add a `.env.example`. (`.env` is already untracked, so nothing needs deleting.)
- Run `npm audit`, and commit the pending `package-lock.json` change.
- Decide deliberately whether `/videos` should be served publicly, and configure CORS for the separate front-end repo.

## Bug fixes
- **(high)** Result CSVs collide: `runner.js` names the result `<filename>.csv`, so two jobs on the same video overwrite each other, and a new job deletes the previous result. Name results per job.
- **(high)** Possible integer overflow in `DfsBinaryGroupFinder`: coordinate sums are `int`, so a very large frame could give a wrong centroid. Prove it with a test, then use `long`.
- The videos folder is not created at startup (only results is), so uploads can fail on a fresh clone.
- `CsvWriter` writes a raw `double`, which can print like `1.0E-4`.

## Other
- Remove committed binaries that do not need to be tracked: `processor/binarized.png`, `processor/groups.csv`, `thumb.jpg`, the screenshot.
- Decide whether both the root and `server/` `package-lock.json` files are needed.

# Suggestions I rejected (and why)
- **Authentication, rate limiting, helmet.** Out of scope for a locally run class project. A concurrency cap covers the real risk.
- **Checking uploaded file contents, not just extensions.** Too large for the benefit here.
- **Consolidating the three Java entry points.** `ImageSummaryApp` is original assignment code, so changing it is risky for little gain.
- **`sqrt` removal, bulk raster reads, frame skipping.** Micro-optimizations that should wait for a profile. Frame skipping would also change the output the front end expects.
- **Removing the JUnit jar from the repo.** The README's compile command depends on it.
