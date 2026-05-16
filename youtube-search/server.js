const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── YouTube Search API ──────────────────────────────────────
app.get('/api/youtube/search', async (req, res) => {
  const { q, apiKey } = req.query;

  if (!q) {
    return res.status(400).json({ error: '请输入搜索关键词' });
  }
  if (!apiKey) {
    return res.status(400).json({ error: '请先填入 YouTube API Key' });
  }

  try {
    // Step 1: Search for videos
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
    if (items.length === 0) {
      return res.json({ videos: [], total: 0 });
    }

    const videoIds = items.map((item) => item.id.videoId).join(',');

    // Step 2: Get statistics (views, etc.)
    const statsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'statistics',
        id: videoIds,
        key: apiKey,
      },
    });

    const statsMap = {};
    (statsRes.data.items || []).forEach((v) => {
      statsMap[v.id] = v.statistics;
    });

    // Step 3: Merge results
    const videos = items.map((item) => {
      const snippet = item.snippet;
      const stats = statsMap[item.id.videoId] || {};
      return {
        videoId: item.id.videoId,
        title: snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        channel: snippet.channelTitle,
        views: formatNumber(stats.viewCount || '0'),
        thumbnail: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
        publishedAt: snippet.publishedAt,
      };
    });

    return res.json({ videos, total: videos.length });
  } catch (err) {
    console.error('YouTube API error:', err.response?.data || err.message);

    if (err.response?.status === 403) {
      return res.status(403).json({ error: 'API Key 无效或超出配额，请检查你的 YouTube Data API Key' });
    }
    if (err.response?.status === 400) {
      return res.status(400).json({ error: err.response.data?.error?.message || '请求参数错误' });
    }

    return res.status(500).json({ error: '搜索失败，请稍后重试' });
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
});
