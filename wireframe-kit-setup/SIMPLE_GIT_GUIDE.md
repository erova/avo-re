# Super Simple Git Setup (For First-Timers)

**Goal: Get this wireframe kit into a place where your team can access it.**

## Prerequisites

First, make sure you have:
1. A GitHub account (sign up at https://github.com/signup if not)
2. Git installed on your computer

**Check if Git is installed:**
Open Terminal and type:
```bash
git --version
```
If you see a version number, you're good! If not, install from https://git-scm.com/

## Step-by-Step Setup

### Part 1: Create the Repository on GitHub

1. Go to https://github.com/new
2. Fill in the form:
   - **Repository name**: `agentic-ui-wireframe-kit`
   - **Description**: "Wireframe patterns for agentic UIs at avo.re"
   - **Private or Public**: Choose Private (if just for your team)
   - **DO NOT** check "Add a README file" (we already have one)
3. Click the green "Create repository" button
4. **STOP** - keep this page open, you'll need it in a minute

### Part 2: Prepare Your Files

1. Open Terminal (Mac) or Command Prompt (Windows)
2. Navigate to where you want to keep this project:
   ```bash
   cd ~/Desktop  # or wherever you want it
   ```
3. Create the project folder:
   ```bash
   mkdir agentic-ui-wireframe-kit
   cd agentic-ui-wireframe-kit
   ```
4. **Now, copy all the files I created into this folder:**
   - PROJECT_CONTEXT.md
   - CLAUDE_INSTRUCTIONS.md
   - README.md
   - GIT_SETUP_GUIDE.md
   - The `components/`, `examples/`, `patterns/`, `templates/` folders

### Part 3: Upload to GitHub

Still in Terminal, run these commands one at a time:

```bash
# Initialize Git
git init

# Stage all files
git add .

# Commit the files
git commit -m "Initial commit: Wireframe kit setup"

# Connect to GitHub (COPY the URL from the GitHub page you kept open)
# It will look like: https://github.com/YOUR-USERNAME/agentic-ui-wireframe-kit.git
git remote add origin YOUR-GITHUB-URL-HERE

# Rename branch to main
git branch -M main

# Push everything to GitHub
git push -u origin main
```

**If it asks for credentials:**
- Username: Your GitHub username
- Password: Use a Personal Access Token (not your password)
  - Get one at: https://github.com/settings/tokens
  - Generate new token → Classic → Check "repo" → Generate
  - Copy that token and paste it when asked for password

### Part 4: Share with Your Team

Now that it's on GitHub, share it with your team:

**Option A: Add them as collaborators**
1. Go to your repo: `https://github.com/YOUR-USERNAME/agentic-ui-wireframe-kit`
2. Click "Settings" (top menu)
3. Click "Collaborators" (left sidebar)
4. Click "Add people"
5. Enter their GitHub usernames or emails

**Option B: Share the link**
If your repo is public, just send them:
`https://github.com/YOUR-USERNAME/agentic-ui-wireframe-kit`

### Part 5: Team Members Clone It

Your teammates can now get the files by running:

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/agentic-ui-wireframe-kit.git

# Go into the folder
cd agentic-ui-wireframe-kit

# Start reading
open README.md  # Mac
start README.md  # Windows
```

## When You Want to Add/Update Files

```bash
# Make your changes to files, then:
git add .
git commit -m "Describe what you changed"
git push
```

## When Your Teammate Updates Files

```bash
# Pull their latest changes
git pull
```

## Common Issues

**"Permission denied"**
- Make sure you're added as a collaborator
- Make sure you're using a personal access token, not password

**"Repository not found"**
- Double-check the URL
- Make sure you have access to the repo

**"Everything up-to-date"**
- This is good! Means you've already pushed

**Merge conflicts**
- Ask me! Send the error and I'll help you resolve it

## Alternative: Even Simpler Options

**If Git feels too complicated right now:**

1. **ZIP and share**: Zip the folder, upload to Google Drive, share with team
2. **Direct in Slack**: Create a channel, upload files directly
3. **Notion**: Copy content into Notion pages

**But Git is worth learning because:**
- Everyone can work simultaneously
- Full history of changes
- Industry standard for code/design systems
- Works with other tools easily

## Need More Help?

- Take the error message you get
- Ask me: "I got this error when trying to [what you were doing]: [paste error]"
- I'll help you fix it step by step

---

**Remember**: The goal is just to get these files somewhere your team can access them. Start simple, improve later!
