# Quick Start Guide - Get Running in 10 Minutes

## What You Have

✅ Database is set up in Supabase (stories, tasks, emails tables)
✅ Core app structure is built
✅ All the hard parts are done

## What You Need to Do

### 1. Download the Project (2 minutes)

I've created all the files. You need to:
1. Download the `devour-v2` folder
2. Put it somewhere on your computer

### 2. Install Node.js (if needed)

Check if you have Node.js:
```bash
node --version
```

If it says "command not found", download from: https://nodejs.org
(Choose the LTS version)

### 3. Install Dependencies (3 minutes)

Open terminal/command prompt in the `devour-v2` folder:

```bash
cd devour-v2
npm install
```

This downloads all required packages. Takes about 2-3 minutes.

### 4. Add Your API Keys (2 minutes)

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Open `.env.local` in a text editor

3. Replace the placeholders:
```
NEXT_PUBLIC_SUPABASE_URL=https://lqiblpeifgizacjffmlk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
```

### 5. Run the App (1 minute)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## What Works Right Now

✅ App loads
✅ Connects to Supabase
✅ Shows sidebar navigation
✅ Basic dashboard structure

## What You Need to Build

❌ Story cards (the individual boxes in columns)
❌ Detail panel (when you click a story)
❌ New story form

These are React components. You can build them with Claude Code.

## Option A: I Finish Building It

If you want me to complete all the components right now, tell me and I'll:
1. Create StoryColumn.tsx
2. Create StoryCard.tsx
3. Create StoryDetailPanel.tsx
4. Create NewStoryModal.tsx

Takes about 20-30 more minutes.

## Option B: You Build with Claude Code

Use Claude Code and give it these prompts one at a time:

### Prompt 1: Build StoryCard
```
Create components/StoryCard.tsx

A React component that displays a story in the kanban board.

Props:
- story: Story (from ../types.ts)
- onClick: () => void
- onQuickPass: () => void  
- onTrash: () => void

Design:
- White card with rounded corners
- Border: border-devour-border (from Tailwind config)
- Padding: p-4
- Hover effect: shadow-md

Layout:
- Top row: ID badge (left), action buttons (right, show on hover)
- Title: font-medium text-base
- Author: text-sm text-gray-600
- Tags: Show as small pills at bottom
- Category badge: "JOURNAL" in small gray text

Use Lucide React for icons.
```

### Prompt 2: Build StoryColumn
```
Create components/StoryColumn.tsx

A column in the kanban board that holds story cards.

Props:
- stage: Stage (from ../types.ts)
- stories: Story[]
- onStoryClick: (story: Story) => void
- onStoryUpdate: (id: string, updates: Partial<Story>) => void
- onStoryDelete: (id: string) => void

Design:
- Column header: uppercase stage name, story count
- Scrollable list of StoryCard components
- "Add New" button at top

Use the StoryCard component you just built.
```

### Prompt 3: Build StoryDetailPanel
```
Create components/StoryDetailPanel.tsx

Side panel that slides in from right showing story details.

Props:
- story: Story
- onClose: () => void
- onUpdate: (updates: Partial<Story>) => void
- onDelete: () => void

Design:
- Fixed position on right side
- Width: 600px
- White background
- Close button (X) in top right
- Tabs: DETAILS, EMAIL
- Form fields for all story properties
- Save/Cancel buttons at bottom

Fields to include:
- Title, Author, Email
- Stage (dropdown)
- Assignee (buttons: Unassigned, HK, SK)
- Word Count, Genre, Logline
- Tags (editable list)
- Editorial Notes (textarea)
```

### Prompt 4: Build NewStoryModal
```
Create components/NewStoryModal.tsx

Modal for creating new submissions.

Props:
- onClose: () => void
- onCreate: (story: Partial<Story>) => void

Design:
- Centered modal overlay
- Form with fields:
  * File upload (manuscript)
  * Title
  * Author  
  * Email
  * Stage (default: New Submission)
  * Assignee

Generate a random ID using DatabaseService.generateStoryId()
Submit button calls onCreate with the form data.
```

## Testing

Once components are built:

1. **Test creating a story**
   - Click "NEW ENTRY"
   - Fill in the form
   - Submit
   - Should appear in "New Submission" column

2. **Test updating a story**
   - Click a story card
   - Edit fields in detail panel
   - Save
   - Changes should persist

3. **Test real-time sync**
   - Open two browser windows
   - Make changes in one
   - See updates in the other

## Deploy to Vercel

When ready to deploy:

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Then deploy on vercel.com
# Add environment variables in Vercel dashboard
```

## Need Help?

**If something breaks:**
1. Check browser console (F12) for errors
2. Check terminal where `npm run dev` is running
3. Verify `.env.local` has correct keys
4. Try `npm install` again

**If database isn't working:**
1. Go to Supabase dashboard
2. Check "Table Editor" - do tables exist?
3. Check "SQL Editor" history - did schema run successfully?
4. Check browser network tab - are requests failing?

## Status Check

Right now you should have:
- ✅ Supabase database running
- ✅ Project files downloaded
- ⏳ Components to build (4 components)
- ⏳ Testing needed
- ⏳ Deploy to Vercel

**Ready to continue? Tell me:**
- "Option A" - I'll finish building all components
- "Option B" - I'll guide you through Claude Code
- Or any questions/issues you're having
