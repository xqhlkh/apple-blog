const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const KEYS_FILE = path.join(__dirname, 'keys.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── Key Management ──────────────────────────────────────────
function readKeys() {
  try {
    if (fs.existsSync(KEYS_FILE)) {
      const data = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
      return data.keys || [];
    }
  } catch {}
  return [];
}

function writeKeys(keys) {
  fs.writeFileSync(KEYS_FILE, JSON.stringify({ keys }, null, 2), 'utf-8');
}

// GET /api/keys — list keys (masked)
app.get('/api/keys', (req, res) => {
  const keys = readKeys();
  const masked = keys.map((k, i) => ({
    index: i,
    preview: k.slice(0, 8) + '...' + k.slice(-4),
    isDefault: i === 0,
  }));
  res.json({ keys: masked, total: keys.length });
});

// POST /api/keys — add a key
app.post('/api/keys', (req, res) => {
  const { key } = req.body;
  if (!key || !key.trim()) {
    return res.status(400).json({ error: '请输入 API Key' });
  }
  const trimmed = key.trim();
  const keys = readKeys();
  if (keys.includes(trimmed)) {
    return res.status(409).json({ error: '该 Key 已存在' });
  }
  keys.push(trimmed);
  writeKeys(keys);
  res.json({ success: true, total: keys.length });
});

// DELETE /api/keys/:index — remove a key
app.delete('/api/keys/:index', (req, res) => {
  const idx = parseInt(req.params.index, 10);
  const keys = readKeys();
  if (isNaN(idx) || idx < 0 || idx >= keys.length) {
    return res.status(404).json({ error: 'Key 不存在' });
  }
  keys.splice(idx, 1);
  writeKeys(keys);
  res.json({ success: true, total: keys.length });
});

// ─── YouTube Search ──────────────────────────────────────────
// Searches with ALL available keys, returns combined results (deduplicated)
app.get('/api/youtube/search', async (req, res) => {
  const { q, keyIndex } = req.query;

  if (!q) {
    return res.status(400).json({ error: '请输入搜索关键词' });
  }

  const keys = readKeys();
  if (keys.length === 0) {
    return res.status(400).json({ error: '请先添加 YouTube API Key（页面顶部可添加）' });
  }

  // Pick which key(s) to use
  let selectedKeys = keys;
  const idx = parseInt(keyIndex, 10);
  if (!isNaN(idx) && idx >= 0 && idx < keys.length) {
    selectedKeys = [keys[idx]]; // use specific key
  }

  try {
    const allVideos = [];
    const seenIds = new Set();

    // Search with each key (usually just one)
    for (const apiKey of selectedKeys) {
      try {
        const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q,
            type: 'video',
            maxResults: 12,
            key: apiKey,
          },
        });

        const items = searchRes.data.items || [];
        if (items.length === 0) continue;

        const videoIds = items.map((item) => item.id.videoId).filter(Boolean);

        if (videoIds.length === 0) continue;

        // Get statistics
        const statsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: 'statistics',
            id: videoIds.join(','),
            key: apiKey,
          },
        });

        const statsMap = {};
        (statsRes.data.items || []).forEach((v) => {
          statsMap[v.id] = v.statistics;
        });

        for (const item of items) {
          const vid = item.id.videoId;
          if (!vid || seenIds.has(vid)) continue;
          seenIds.add(vid);

          const snippet = item.snippet;
          const stats = statsMap[vid] || {};
          allVideos.push({
            videoId: vid,
            title: snippet.title,
            url: `https://www.youtube.com/watch?v=${vid}`,
            channel: snippet.channelTitle,
            views: formatNumber(stats.viewCount || '0'),
            thumbnail: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
            publishedAt: snippet.publishedAt,
          });
        }
      } catch (keyErr) {
        // This key failed, try next one
        console.error(`Key ${apiKey.slice(0, 8)}... failed:`, keyErr.response?.status);
        continue;
      }
    }

    if (allVideos.length === 0 && selectedKeys.length > 0) {
      return res.status(500).json({ error: '所有 Key 均搜索失败，请检查 API Key 是否有效' });
    }

    res.json({ videos: allVideos, total: allVideos.length });
  } catch (err) {
    console.error('YouTube API error:', err.response?.data || err.message);
    res.status(500).json({ error: '搜索失败，请稍后重试' });
  }
});

// ─── Helpers ─────────────────────────────────────────────────
function formatNumber(num) {
  const n = parseInt(num, 10);
  if (isNaN(n)) return '0';
  return n.toLocaleString('en-US');
}

// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`YouTube Search running at http://localhost:${PORT}`);
  console.log(`Keys file: ${KEYS_FILE} (${readKeys().length} keys loaded)`);
});
