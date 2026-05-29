export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
}

export interface Category {
  id: string;
  label: string;
  description: string;
  data: SocialLink[];
}
