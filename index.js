const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const entries = require('./catalog.json');
const manifest = {
  id: 'community.kartoons.catalog.starter',
  version: '1.0.0',
  name: 'Kartoons Catalog (Starter)',
  description: 'Custom catalog starter. Add metadata and authorized playback links to catalog.json.',
  resources: ['catalog', 'meta', 'stream'],
  types: ['series', 'movie'],
  catalogs: [
    { type: 'series', id: 'kartoons-series', name: 'Kartoons — Series', extra: [{ name: 'search', isRequired: false }] },
    { type: 'movie', id: 'kartoons-movies', name: 'Kartoons — Movies', extra: [{ name: 'search', isRequired: false }] }
  ],
  idPrefixes: ['kartoons:']
};
const builder = new addonBuilder(manifest);
function toPreview(item) {
  return { id: item.id, type: item.type, name: item.name, poster: item.poster || undefined, description: item.description || undefined };
}
builder.defineCatalogHandler(async ({ type, extra }) => {
  const query = (extra?.search || '').trim().toLowerCase();
  return { metas: entries.filter(x => x.type === type && (!query || x.name.toLowerCase().includes(query))).map(toPreview) };
});
builder.defineMetaHandler(async ({ type, id }) => {
  const item = entries.find(x => x.id === id && x.type === type);
  if (!item) return { meta: null };
  const meta = { ...toPreview(item), background: item.background || undefined };
  if (type === 'series') meta.videos = (item.episodes || []).map(e => ({ id: e.id, title: e.title, season: e.season, episode: e.episode, released: e.released || undefined }));
  return { meta };
});
builder.defineStreamHandler(async ({ type, id }) => {
  const item = entries.find(x => x.type === type && (x.id === id || (x.episodes || []).some(e => e.id === id)));
  if (!item) return { streams: [] };
  const target = item.id === id ? item : item.episodes.find(e => e.id === id);
  return { streams: (target.streams || []).filter(s => /^https?:\/\//i.test(s.url || '')).map(s => ({ name: s.name || 'Authorized stream', url: s.url })) };
});
serveHTTP(builder.getInterface(), { port: Number(process.env.PORT || 7000) });
