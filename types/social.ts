export type SocialLink = {
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
};

export type Category = {
  id: string;
  label: string;
  description: string;
  data: SocialLink[];
};
