export type DocType = {
  slug: string;
  title: string;
  content?: React.ReactElement;
  createdAt: number;
};

export type DocNode = {
  type: "file" | "directory";
  name: string;
  slug: string;
  path: string;
  children?: DocNode[];
  createdAt: number;
};
