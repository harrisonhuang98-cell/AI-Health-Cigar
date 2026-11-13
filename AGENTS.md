# Project save points

- After every working change, verify it as appropriate and create a Git commit with a short, clear message.
- When the user says "go back", restore the last save point and explain what was undone. If there are uncommitted changes, restore the latest commit. If the working tree is clean, undo the most recent change commit with a new revert commit to preserve history. Do not undo the initial save point.
- Do not commit secrets or ignored generated files.
- Follow NOTES.md: after each save point, push it to GitHub.
