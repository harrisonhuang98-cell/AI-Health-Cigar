Please build a web app called AI Health Cigar. First, save this project brief as BRIEF.md in my project folder, and use it for every decision you make:

# Project brief: AI Health Cigar
## The competition
- I’m entering the Presidential SI Challenge (Standard Track), a national K–12 competition. My age group: High school (grades 9–12)
- Judges score only a written entry (a PDF of up to 10 pages) and a video of up to 4 minutes. They reward a clear understanding of the problem and a sensible use of AI.
- My deadlines: Cannot miss December 18, 2026 which is the day where the teacher needs to register you, and cannot miss December 23, 2026 when the entry needs to be done.
## The problem
- Adults struggle nicotine addiction because it acts as a reward system for your brain.
- Impact area: Health and wellbeing
- Why it matters (impact): If my project works I want to luanch a hypothetical design for a nicotine free cigarette that stimulates the same feeling as smoking on a real nicotine included cigarette but in reality is a nicotine free healthy cigar.
- Evidence it’s real: https://www.cdc.gov/mmwr/volumes/73/wr/mm7329a1.htm

Tobacco dependence is a chronic condition driven by nicotine addiction. Successful quitting can be increased by health care provider intervention and evidence-based treatment
- What people told me: Person A told me that he struggles a lot with smoking and regularly feels the urge to keep going especially under stress, when I asked if he ever considered a vape before to try and simulate the exact biological movements on smoking a cigarette he told me, "I have before but I realized that it was still unhealthy and causes lung disease". I asked him if he would use a device that incorporates the feeling of smoking on a real cigar but is actually a fake and healthy cigar containing no nicotine or has any downsides to health, and he said if it really existed he would give it a try.
## My solution
- My AI’s job: My AI helps by helping with unhealthy nicotine addiction that effects health of the smoker, which works better than a nicotine alternative or a vape because my device incorporates AI into stimulating a nicotine effect into a all healthy cigar with no health downsides.
- Tools that already exist, and how mine is different: Two existing tools are quitSTART, which offers games and progress badges, and SmokefreeTXT, which sends encouraging messages. My idea is different because it combines personalized AI support with a handheld device to help adults manage smoking urges without smoke, vapor, or nicotine.
- Safety plan: Risk	Plan
Physical safety: The device could hurt someone. Nicotine-free smoke can still contain harmful chemicals.	Build the first prototype without burning, heating, vapor, or inhaled substances. Have a qualified adult review its materials and electronics before anyone uses it. NCI explains nicotine-free smoke risks.
Physical safety: The AI could give wrong health advice. Someone might follow unsafe instructions or delay getting help.	Limit answers to reviewed quit-smoking information. Do not let AI diagnose illnesses, choose medicine doses, or tell users to stop treatment. When unsure, say so and link to CDC quitting guidance.
Physical safety: Children might see a cigar-shaped device as an invitation to try smoking.	Start with adults only. Use a design that does not look like a tobacco product. Any future testing with children needs specialist safety review and appropriate parent permission.
Emotional safety: Messages could shame, frighten, pressure, or bully users.	Use kind language: “A slip doesn’t erase your progress.” Avoid punishments, scary predictions, public rankings, and user-to-user messages. Include a button to report an upsetting answer.
Emotional and physical safety: Someone could ask off-topic or harmful questions.	Keep the AI focused on quitting support. Refuse instructions for harm, bullying, or making smoking devices. Offer a safe alternative; if someone describes immediate danger, direct them to urgent human help. Test these rules before release.
Data security: Users could type names, ages, smoking habits, health details, or private worries. Developers, an AI provider, or someone sharing their device might see them.
## My MVP features (build these first, in this order)
1. The user can describe a craving to the AI and get a coping idea.
2. The user can log each craving and what triggered it.
3. The user can track how many smoke-free days they have had.
4. The AI gives correct, safe answers to real questions.
## Maybe later (not yet)
- The user can tap a button to report an upsetting AI answer.
- The user can see a CDC quitting help link when the AI is unsure.
- The user can log a slip and get a kind, no-shame message.
- The user can start a two-minute breathing exercise during a craving.
- The user can see their craving triggers grouped to spot patterns.
- The user can write their own reasons for quitting to reread later.
- The user can see how much money they saved by not smoking.
- The user can clear all their saved notes from the device.
## My AI’s instructions
- When it answers: The user will click a button the device to turn on the AI that helps with stimulating nicotine in my healthy cigar but not actual nicotine. The AI listens to the user and comprehends the best nicotine plan and cessation working plan for them.
- Its job: Listen to the users personal preferences and addiction on nicotine and help with depends on that response to think.
- Who it talks to and how to sound: talking to the user it should sound like talking to someone real and exchanging advice.
- Facts it must use: | Area | What the AI would need to know or use |
|---|---|
| **The user’s nicotine use** | Products used, frequency, duration, time to first use after waking, other nicotine sources, previous quit attempts, and withdrawal experiences. Cigar count or puff count alone cannot establish absorbed nicotine. |
| **Relevant health information** | Age, pregnancy or breastfeeding, medical conditions, medications, and current symptoms—with a clinician involved when needed. |
| **The person’s experience** | Their goals, cravings, triggers, stress, sleep, routines, and preferences. The AI should summarize what it understood and ask the user to confirm, rather than treat an interpretation of their words as a diagnosis. |
| **Evidence about dependence** | Physical withdrawal and learned habits both matter. Withdrawal often peaks in the first few days, while situational cravings can recur much later. A plan needs ongoing support, not just a declining nicotine setting. [National Cancer Institute](https://www.cancer.gov/about-cancer/causes-prevention/risk/tobacco/withdrawal-fact-sheet) |
| **Effective cessation treatments** | Counseling and medication together offer the best chance of quitting smoking. Established options include nicotine replacement therapy and prescription medicines; this does not establish that a new nicotine cigar would work. [CDC](https://www.cdc.gov/tobacco/about/how-to-quit.html) |
| **Actual device delivery** | Independently measured nicotine delivered under different puff patterns, dose consistency, absorption, ingredient composition, temperature, contaminants, and failure conditions. A cartridge’s nicotine content is not the same as the amount entering someone’s body. |
| **Safety and outcomes** | Evidence that the complete product helps people quit, its adverse effects, and whether people compensate for reductions by puffing more or using other nicotine products. |
- Rules it must follow: Never promise harmlessness or a guaranteed cure. It must not call the cigar “healthy,” claim zero side effects, or guarantee that someone will stop being addicted.

Never invent nicotine doses from conversation. A user’s words, mood, or craving score cannot establish a safe dose. Any delivery must follow a clinically validated protocol with independent hardware limits.

Never secretly change nicotine delivery. Users must know whether they are receiving nicotine and consent to changes. A simulated sensation must never be presented as actual nicotine—or vice versa.

Never introduce nicotine to a non-user. It must not encourage experimentation, reward heavier use, or optimize for more puffs, dependence, or time spent using the product.

Never override safety controls. The AI must not bypass dose limits, lockouts, fault detection, or emergency stops—even when the user requests it. Uncertain or faulty delivery must trigger a safe stop.

Never dismiss concerning symptoms as ordinary withdrawal. Suspected poisoning, chest pain, severe breathing problems, or other urgent symptoms require stopping use and directing the person to appropriate medical help.

Never treat its interpretation as a diagnosis. It should confirm what the user means, acknowledge uncertainty, and involve qualified professionals when treatment decisions exceed its role.

Never assume emissions are safe for passersby. Invisible or nicotine-free aerosol is not proof of harmlessness. It must not claim that filters eliminate exposure without supporting evidence. EPA

Never impersonate a human or manipulate attachment. It can be personable, but must identify itself as AI, avoid shame or pressure, and support access to human care.

Never expose sensitive conversations or fabricate evidence. Health information needs clear privacy controls. Medical claims, device instructions, and citations must be verified.
- How to answer: The AI should usually answer in 80–150 words, using plain, supportive language. It should be too long and make the user lose interest

Now build Version 1 with my MVP features from BRIEF.md. Build them in order, starting with the first one, which is the main job, so someone from this group can use the AI part from start to finish. Make the difference from existing tools easy to see, follow my safety plan from the start, and make sure each feature can be shown clearly in a short video. Leave everything else out for now, and copy the features under “Maybe later” into NOTES.md under “Maybe Later”.

Then list my MVP features and tell me for each one whether it works and how to check it. Then make a save point and push it to GitHub.

I’m a student, not a professional programmer, so keep it simple and don’t make me read code or debug. I don’t have a database yet, so save data in the browser (localStorage) for now, with a few made-up sample items (no real people). Keep all saving in one small file so we can switch to a real database later. Run it on my computer, open it in my browser, and make a save point when saving works. Write “Saves on this computer only for now” in NOTES.md.

Connect the real AI from the start, using the OpenAI API. My key is already in .env, and the model to use is written in NOTES.md. Add a small server part that runs on my computer and passes messages to the AI, so the key stays on the server and is never sent to the page. Read the key only from .env, never print it, never ask me to paste it into this chat, and make sure .env is in .gitignore. Ask the AI only at the moment described in “When it answers”, and send my AI’s instructions from BRIEF.md with every message, as the AI’s system instructions. Keep the part that asks the AI in one small, clearly named file. While it’s waiting, show “Thinking…” and turn off the button so it can’t be pressed twice. If the AI can’t answer (an expired key or no internet), show a friendly message that says to check the key. Write in NOTES.md the one command that starts my project, then tell me that command.

Also create a short NOTES.md: how to run it, what’s done, and what’s next. Update it after every big change.