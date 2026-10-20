# Kartoons Catalog — Stremio addon starter

A minimal, editable Stremio catalog for series and movies. **This does not scrape Kartoons.to or extract streams from third-party hosts.** It starts with two placeholders. Only add metadata you may reuse and playback URLs you are authorized to distribute or access.

## Deploy without local coding

1. Create a GitHub account if needed, then create a new public or private repository.
2. In the repository, choose **Add file → Upload files** and upload `package.json`, `index.js`, `catalog.json`, and `render.yaml` (not the zip itself). Commit the files.
3. Sign in to [Render](https://dashboard.render.com/), select **New → Blueprint**, connect your repository, and apply the Blueprint. If Blueprint isn't available, create a **Web Service** with runtime `Node`, build command `npm install`, and start command `npm start`.
4. Wait for deployment, then open `https://YOUR-SERVICE.onrender.com/manifest.json`. It should return JSON.
5. In Stremio's addon interface, install from `https://YOUR-SERVICE.onrender.com/manifest.json` (the location of this field varies by Stremio version).
6. To customize, edit `catalog.json` on GitHub and commit. Render should redeploy automatically if automatic deploys are enabled.

## Add shows and episodes

Each `catalog.json` item must have a unique `id` starting `kartoons:`, a `type` (`series` or `movie`), and `name`. Series may include an `episodes` array. Each episode needs a unique `id`, `title`, `season`, and `episode`.

For movies, `streams` belongs on the movie. For series, `streams` belongs on each episode. Each stream object is `{ "name": "My authorized video", "url": "https://example.org/video.mp4" }`.

The playback URL must be directly compatible with Stremio, publicly reachable or otherwise accessible to the player, and authorized. A webpage link is not necessarily a video URL. Empty streams intentionally produce no playable results.

## Limitations

- Catalog is a manually edited JSON file, not a live feed from Kartoons.to.
- No automatic scraping, DRM circumvention, embed extraction, or third-party stream discovery.
- Search support is basic and depends on the Stremio client.
- Free hosting availability, sleep policies, and deployment options may change.
