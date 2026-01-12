export type ExternalLinkType = "youtubeVideo" | "nicoVideo" | "link" | "embed";

export type ExternalLinkDefinition = {
  type: ExternalLinkType;
  value: string;
  title?: string | null;
  description?: string | null;
};
