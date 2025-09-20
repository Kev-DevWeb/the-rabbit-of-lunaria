export function getYouTubeEmbedId(url: string): string | null {
  let embedId = null;
  const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(youtubeRegex);
  if (match && match[2].length === 11) {
    embedId = match[2];
  }
  return embedId;
}
