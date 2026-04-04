export function formatClassLabel(input: {
  grade: number;
  section: string;
  stream: string | null;
}): string {
  const streamPart = input.stream ? ` · ${input.stream}` : "";
  return `Grade ${input.grade} · Section ${input.section}${streamPart}`;
}
