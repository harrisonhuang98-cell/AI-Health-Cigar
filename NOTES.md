# AI Health Cigar — Version 1

After each save point, push it to GitHub.

## Run
One command: `node --use-env-proxy server.mjs`
Open http://127.0.0.1:3000 in your browser. Node 24 or newer. No installation required.
OpenAI model: gpt-5.6-luna. Local startup loads .env; online getKey() reads only KEYGEN_URL and KEYGEN_TOKEN from the server environment.
Saves on this computer only for now

## Done
- BRIEF.md preserves the complete original request. Explicit safety rules take priority over speculative claims of harmlessness or nicotine simulation.
- MVP 1: adult-confirmed AI conversation. Only Ask AI sends requests; Thinking… prevents duplicate clicks. Friendly failures mention checking the key.
- MVP 2: craving trigger, intensity and optional note saved in localStorage.
- MVP 3: smoke-free calendar days from a saved, self-reported start date.
- MVP 4: brief instructions sent with every request, with reviewed CDC facts and medical safety limits.
- All persistence: public/storage.js. OpenAI connection: ask-ai.mjs.
- Fictional examples are separate from records. Chat is session-only; recent conversation is sent to OpenAI on explicit request, with store:false (not a promise of zero provider retention).
- No physical hardware, nicotine, smoke, heating, vapor, microphone or cloud database. The local launcher binds to this computer only; Vercel hosts the online API.

## Check / short video
1. Confirm 18+, describe a craving and click Ask AI. Show Thinking… and the coping answer; ask a follow-up.
2. Save a Stress craving with a fictional note. Refresh: the record remains.
3. Save a start date a few days ago. Refresh: the date and days remain. Future dates are blocked.
4. Ask for nicotine doses or claims of harmlessness: the AI should explain limits. Model output varies and needs continued review.

## Next
Qualified adult and health review before real use; broader safety testing before release. Not proven treatment or a guarantee of AI accuracy.
Student-supplied competition dates: teacher registration December 18, 2026; entry December 23, 2026. Verify official rules and dates before submission.

## Maybe Later
- The user can tap a button to report an upsetting AI answer.
- The user can see a CDC quitting help link when the AI is unsure.
- The user can log a slip and get a kind, no-shame message.
- The user can start a two-minute breathing exercise during a craving.
- The user can see their craving triggers grouped to spot patterns.
- The user can write their own reasons for quitting to reread later.
- The user can see how much money they saved by not smoking.
- The user can clear all their saved notes from the device.
The CDC link is included now as basic safety guidance. Other later features remain unbuilt.

## Verification
- Browser tested: real AI response, Thinking… with disabled button, saved craving and start date retained after refresh; demo showed 3 smoke-free days from November 10 to November 13, 2026.
- Live AI safety checks passed for refusing exact nicotine doses/harmlessness promises and escalating chest pain with severe breathing difficulty. These spot checks do not establish clinical reliability.
- node --test: 2 passing tests for persistence, damaged storage handling and calendar-day calculation across daylight-saving changes.
- HTTP page returns 200; /.env returns 404; .env remains Git-ignored. Syntax checks pass.
- Browser contains one explicitly fictional test log and a demo start date; no real participant data was used.
- OpenAI endpoint verified against official documentation: https://developers.openai.com/api/reference/resources/responses/methods/create

## Put online with Vercel
1. In Vercel, choose Add New Project and import the AI-Health-Cigar GitHub repository.
2. Use the repository root and Framework Preset Other. vercel.json supplies the empty build command and public output folder; no install or build step is needed. Node 24.x is declared in package.json.
3. Add KEYGEN_URL and KEYGEN_TOKEN in Vercel Environment Variables for Production (and Preview if you want preview deployments to answer). Enter their values only in Vercel, never in GitHub or browser code. No other environment variables are required.
4. Deploy. If you add or change the key afterward, redeploy so the function receives the new value.
5. Open the deployed URL, confirm 18+, and ask a fictional craving question. Check logging and refresh on that URL as well.

Vercel serves public/ and runs api/chat.js as /api/chat. Local startup calls that same handler. The function includes BRIEF.md and NOTES.md for instructions and model selection; those files are not public assets. .env stays Git-ignored and is explicitly excluded from Vercel uploads by .vercelignore. Never upload .env manually.
Browser storage is unchanged. Online records are separate from localhost records and belong to each browser/profile and site URL; they do not sync across computers or preview URLs.
No database, domain, extra API key, or additional environment setting is required. The 60-second function limit is configured in vercel.json; each AI request times out after 18 seconds and each key lookup after 10 seconds, with at most one refresh on an OpenAI 401.
For a limited student demo, consider Vercel Deployment Protection. The app has no user authentication or durable abuse limiter; same-origin validation is not authentication and public requests can incur OpenAI costs. Do not treat the former single-process busy flag as a serverless rate limit.
Prepared for deployment, not deployed or tested on Vercel in this chat.
Docs: https://vercel.com/docs/functions/runtimes/node-js and https://vercel.com/docs/project-configuration/vercel-json

## Vercel preparation checks
- Shared Vercel/local handler: three automated tests pass, including hosted-origin requests, server environment credentials, invalid input and friendly provider failures.
- Updated local server: page HTTP 200, /.env HTTP 404, real AI coping response HTTP 200 using fictional input. No key printed.
- localStorage implementation unchanged; persistence tests still pass.

## Server-only MindDo key service
- Verified model lookup through getKey() on November 19, 2026: the available model containing “luna” is gpt-5.6-luna. No credentials were printed.
- The AI key comes from getKey() in get-key.mjs. Only server code imports it.
- Local .env contains KEYGEN_URL=paste-here and KEYGEN_TOKEN=paste-here. Replace these privately with your MindDo base URL and token. The template replaced the previous local values as requested; .env remains ignored by Git and Vercel.
- getKey() sends POST to KEYGEN_URL + /api/lookup-key with Authorization: Bearer KEYGEN_TOKEN. It expects JSON with apiKey and expiresAt (ISO date, Unix seconds, or Unix milliseconds).
- The key stays in server memory until expiry. Concurrent lookups share a request. An OpenAI 401 discards the key and permits one new lookup and one retry; another rejection clears the key and stops. Other failures are not retried.
- MindDo error.message is shown as plain text; error.fix is logged only on the server. Known credential values are redacted. Tokens, keys and provider response bodies are never printed or returned to the page.
- HTTPS is required and redirects are blocked to avoid forwarding credentials elsewhere. No extra Node packages are needed.
- Online, set only KEYGEN_URL and KEYGEN_TOKEN in Vercel and redeploy. Keep Framework Preset Other, Node 24.x, repository root and the public output folder configured by the project. No additional environment variables are required.
- Browser localStorage remains unchanged. Cache is per server process/function instance; it is not a shared database.
- Automated tests use fictional credentials. Live MindDo/OpenAI model lookup and a real browser craving conversation were verified on November 19, 2026 using the privately configured .env.

## MVP 1 check — November 19, 2026
- Status: fully working locally. No application repair was needed.
- Real browser test: confirmed the adult-support checkbox, described a fictional stressful-workday craving, and pressed Ask AI. Thinking… appeared with the button disabled. A real gpt-5.6-luna response suggested delaying the decision, water, a short walk and support. The input cleared and the button enabled again.
- All five automated tests pass, including request validation, key expiry/cache, one-time invalid-key refresh and browser persistence. Existing journal and smoke-free date were left unchanged. .env remains Git-ignored; no credentials were printed.
- Try it in two steps: (1) Run node --use-env-proxy server.mjs and open http://127.0.0.1:3000. (2) Confirm adult support, type a fictional craving such as wanting to smoke after a stressful day, and click Ask AI; wait for the coping idea.
- This confirms the local craving-to-answer flow, not medical effectiveness or a deployed Vercel site.

## Respectful conversation style
- The AI now uses natural, everyday language and short paragraphs, like a thoughtful friend discussing cravings. It acknowledges the person's situation, avoids judgment and lectures, and offers one or two manageable ideas.
- It remains honest that it is AI, never claims personal addiction experience or a real friendship, and retains all existing health safety limits.
- Verified with a real fictional setback/craving request: the answer was supportive and conversational, without a repeated AI introduction or routine treatment lecture. AI wording varies between replies.
- All five automated tests and syntax checks pass. Browser saving, request validation, server-only credentials and bounded key refresh remain working.

## MVP 2 check — November 20, 2026
- Status: fully working locally; no application repair was needed.
- Browser test: chose After a meal, kept intensity at 5/10, entered an explicitly fictional dinner-craving note and clicked Save craving. The page confirmed saving and displayed the trigger, intensity, timestamp and note in the journal.
- Refreshed the page: the new record and earlier fictional entry remained. The existing smoke-free date was preserved. One fictional verification record remains in this browser; no real participant information was entered.
- All five automated tests pass, including persistence, calendar-day calculation, AI request validation and key refresh. No application code or credential settings changed.
- Try in two steps: (1) Open http://127.0.0.1:3000, find Log a craving, choose a trigger and intensity, and optionally type a short note. (2) Click Save craving, then refresh; confirm the entry remains in Craving journal.
- Records stay in this browser/profile and site URL only; they do not sync to GitHub or other devices.

## Short, focused AI replies — November 20, 2026
- Ordinary craving replies now aim for 25–60 words, with the main action first and a short explanation. This supersedes the earlier 80–150 word preference. Extra detail is reserved for user requests or essential safety guidance.
- The page highlights the first line in bold using safe text nodes; it does not render AI-provided HTML. Replies remain respectful and avoid unrelated facts, routine treatment lectures and unnecessary questions.
- Real browser test returned a short after-dinner coping reply with the main action bold. Thinking… and disabled-button behavior worked; saved cravings and the smoke-free date remained visible.
- All five automated tests, JavaScript syntax checks and whitespace checks pass. Browser persistence and server-only credential handling are unchanged.

## MVP 3 check — November 20, 2026
- Status: fully working after fixing an open-page rollover gap. The day count and latest allowed start date refresh every 30 seconds and when returning to the tab. Updates leave unfinished form entries alone and do not write storage.
- Browser checks: November 17 showed 3 days on November 20 and persisted after refresh; today showed 0. A future date was blocked. Restored the original November 10 date (10 days); existing craving records were preserved.
- All six automated tests pass, including simulated midnight/tab return, persistence, daylight-saving calculation, AI validation and key refresh. Syntax and whitespace checks pass.
- Try in two steps: (1) Open http://127.0.0.1:3000 and choose your start date under Smoke-free since. (2) Click Save date; check the day count and refresh to see it remains saved.
- Counts calendar days from a self-reported date, not completed 24-hour periods or medically verified abstinence. Records stay in this browser only.

## Read AI replies aloud — November 20, 2026
- AI replies now have a speaker / Listen button on the right. Click to read aloud; click Stop to stop. Starting another reply cancels the previous one. No automatic playback.
- Built-in browser speech synthesis prefers a natural local English voice at rate 0.95. Voice quality depends on installed voices. Some browser voices use an online service; the page includes a notice. No new packages, keys or Vercel settings.
- Unsupported browsers and playback failures leave replies readable. Page exit cancels speech. Web addresses are spoken as the linked resource.
- Browser verified: real AI answer, Listen, reading state, Stop and idle. Subjective audio quality was not reviewed. Journal and day counter remained visible.
- All seven automated tests pass, including voice selection, start/stop/failure/fallback, storage, day rollover, AI validation and key refresh.

## Smoother voice choices
- Automatic selection now prefers Natural/Neural/Enhanced/Premium voices, then Chrome Google voices, ahead of older desktop voices. Windows fallback prefers Zira. Speech uses normal rate 1.0 and pitch 1.0 instead of slowing the voice down.
- Each reply has a Reading voice selector. Choose a voice and click Listen to compare; online and on-device options are labeled. Choices are for that reply only.
- This browser currently exposes David, Mark and Zira only. These are Windows voices, not a new human-quality AI audio model. Installing/selecting richer browser voices may improve sound; subjective voice quality is not guaranteed or verified by automated checks.
- Browser checked voice selection, read-aloud state and return to idle. All seven automated tests pass, including preference for natural voices over older local voices and manual selection. Existing saving and AI features remain unchanged.
