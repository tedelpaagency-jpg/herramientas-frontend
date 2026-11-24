export interface VideoEmbedInfo {
  type: 'youtube' | 'vimeo' | 'loom' | 'direct' | 'unsupported';
  embedUrl: string | null;
  rawUrl: string;
}

export const parseVideoUrl = (rawUrl?: string | null): VideoEmbedInfo => {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { type: 'unsupported', embedUrl: null, rawUrl: '' };
  }

  const url = rawUrl.trim();
  if (!url) {
    return { type: 'unsupported', embedUrl: null, rawUrl: '' };
  }

  // 1. YouTube
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
      rawUrl: url,
    };
  }

  // 2. Vimeo
  // Matches: vimeo.com/123456789
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
      rawUrl: url,
    };
  }

  // 3. Loom
  // Matches: loom.com/share/ID or loom.com/embed/ID
  const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/i);
  if (loomMatch && loomMatch[1]) {
    return {
      type: 'loom',
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      rawUrl: url,
    };
  }

  // 4. Direct video file (mp4, webm, ogg)
  if (/\.(mp4|webm|ogg)($|\?)/i.test(url)) {
    return {
      type: 'direct',
      embedUrl: url,
      rawUrl: url,
    };
  }

  // 5. Already an embed URL or iframe safe URL
  if (url.includes('/embed/') || url.includes('player.')) {
    return {
      type: 'direct',
      embedUrl: url,
      rawUrl: url,
    };
  }

  return {
    type: 'unsupported',
    embedUrl: null,
    rawUrl: url,
  };
};

export default parseVideoUrl;
