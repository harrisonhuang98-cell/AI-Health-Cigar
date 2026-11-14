# AI Health Cigar — Version 1

After each save point, push it to GitHub.

## Run
One command: `node --use-env-proxy server.mjs`
Open http://127.0.0.1:3000 in your browser. Node 24 or newer. No installation required.
OpenAI model: gpt-5.6-luna. Local startup loads .env; online the API reads only the server environment variable OPENAI_API_KEY.
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
3. Add OPENAI_API_KEY in Vercel Environment Variables for Production (and Preview if you want preview deployments to answer). Enter it only in Vercel, never in GitHub or browser code. No other environment variables are required.
4. Deploy. If you add or change the key afterward, redeploy so the function receives the new value.
5. Open the deployed URL, confirm 18+, and ask a fictional craving question. Check logging and refresh on that URL as well.

Vercel serves public/ and runs api/chat.js as /api/chat. Local startup calls that same handler. The function includes BRIEF.md and NOTES.md for instructions and model selection; those files are not public assets. .env stays Git-ignored and is explicitly excluded from Vercel uploads by .vercelignore. Never upload .env manually.
Browser storage is unchanged. Online records are separate from localhost records and belong to each browser/profile and site URL; they do not sync across computers or preview URLs.
No database, domain, extra API key, or additional environment setting is required. The 60-second function limit is configured in vercel.json; the upstream request times out after 55 seconds.
For a limited student demo, consider Vercel Deployment Protection. The app has no user authentication or durable abuse limiter; same-origin validation is not authentication and public requests can incur OpenAI costs. Do not treat the former single-process busy flag as a serverless rate limit.
Prepared for deployment, not deployed or tested on Vercel in this chat.
Docs: https://vercel.com/docs/functions/runtimes/node-js and https://vercel.com/docs/project-configuration/vercel-json

## Vercel preparation checks
- Shared Vercel/local handler: three automated tests pass, including hosted-origin requests, server environment credentials, invalid input and friendly provider failures.
- Updated local server: page HTTP 200, /.env HTTP 404, real AI coping response HTTP 200 using fictional input. No key printed.
- localStorage implementation unchanged; persistence tests still pass.
