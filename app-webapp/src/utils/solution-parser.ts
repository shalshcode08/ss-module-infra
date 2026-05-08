export type ContentSegment = { type: "text"; content: string } | { type: "image"; id: string };

export function extractSolution(raw: string): string {
  const complete = raw.match(/\[SOLUTION\]([\s\S]*?)\[\/SOLUTION\]/);
  if (complete) return complete[1].trimStart();

  const partial = raw.match(/\[SOLUTION\]([\s\S]*)/);
  if (partial) return partial[1].trimStart();

  return raw;
}

export function convertCodeTags(content: string): string {
  return content.replace(
    /\[CODE lang="([^"]+)"\]([\s\S]*?)\[\/CODE\]/g,
    (_, lang, code) => `\`\`\`${lang}\n${code.trim()}\n\`\`\``,
  );
}

export function parseSegments(content: string): ContentSegment[] {
  const parts = content.split(/\[IMAGE:([a-z0-9]+)\]/);
  const segments: ContentSegment[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      if (parts[i]) segments.push({ type: "text", content: parts[i] });
    } else {
      segments.push({ type: "image", id: parts[i] });
    }
  }

  return segments;
}

export function processSolution(raw: string): ContentSegment[] {
  return parseSegments(convertCodeTags(extractSolution(raw)));
}
