# shinchan

This repository contains a small static-site scaffold to host video seasons and episodes.

Quick start

1. Serve locally:

```bash
npm start
# then open http://localhost:8080
```

2. Add more content:

- Edit `data/seasons.json` to add a new season object or append episodes to an existing season's `episodes` array.
- Each episode entry should have an `ep` (label) and `url` (video mp4 URL).

Deployment

- This is a static site — you can deploy it on GitHub Pages, Netlify, Vercel, or any static host. Commit the files and follow your host's deploy flow.

Auto-deploy to GitHub Pages

- A GitHub Actions workflow is included: `.github/workflows/deploy.yml`. On every push to `main` the action will publish the repository root to the `gh-pages` branch using the built-in `GITHUB_TOKEN`.
- After the first successful run, enable Pages in the GitHub repository Settings → Pages and select the `gh-pages` branch (root) as the source, or use the URL shown in Settings.

If the action cannot push because of repository policies, you can manually enable Pages to serve from the `main` branch (root) via the repository Settings.
