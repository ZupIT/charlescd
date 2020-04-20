export type ExpandClick = {
  status?: boolean | undefined;
  persist: boolean;
};

export type SubLink = {
  id: string;
  text: string;
  to: string;
};

export type Link = {
  id: string;
  icon: string;
  text: string;
  to?: string;
  subItems?: SubLink[];
};
