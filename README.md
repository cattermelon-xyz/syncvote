# syncvote-fe

Repo for SyncVote: Front end and Edge functions.

Branch naming convention:

- All production branches should be named `release-YYYYMMDD:HH:MM`
- All code lives in the `main` branch. Other feature branch should be short-lived and should be merge into `main` within a few days.
- Production and development code should be seperated by `.env/VITE_ENV` condition.
- There are 2 possible values for VITE_ENV: "dev" and "production"
