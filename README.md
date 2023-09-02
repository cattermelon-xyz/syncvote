# Monorepo for syncvote

Repo for SyncVote:

```md
.vscode/
| default.code-workspace
| local.code-workspace
docs/
supabase/
components/
| DirectedGraph/ (ReactJS lib)
| RichTextEditor/ (ReactJS lib)
| Icon/ (ReactJS lib)
| Banner/ (ReactJS lib)
utils/ (TypeScript lib)
| src/function
| | getImageUrl
| | idString (createIdString, extractIdFromIdString)
| | subtractArray
| | supabaseClient
| | dal (getData, setData)
| index.ts
apps/
| syncvote/
| | webapp/ (ReactJS app)
| | service/ (Golang project)
| admin
| | webapp/ (ReactJS app)
votemachines/
| singlevote/
| | weblib/ (ReactJS lib)
| | web2/ (Golang lib)
| polling/
| | weblib/ (ReactJS lib)
| | web2/ (Golang lib)
| veto/
| | weblib/ (ReactJS lib)
| | web2/ (Golang lib)
| upvote/
| | weblib/ (ReactJS lib)
| | web2/ (Golang lib)
```

Development example: Let's take a look at components/DirectedGraph

Branch naming convention:

- All production branches should be named `release-YYYYMMDD:HH:MM`
- All code lives in the `main` branch. Other feature branch should be short-lived and should be merge into `main` within a few days.
- Production and development code should be seperated by `.env/VITE_ENV` condition.
- There are 2 possible values for VITE_ENV: "dev" and "production"
