export type Organisation = {
  id: string;
  name: string;
  created_at: string;
};

export type Topic = {
  id: string;
  title: string;
  organisation: Organisation;
  metadatas: any;
  started_at: string;
};
