export type DealSummary = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  cause: string;
};

export type DealDetail = DealSummary & {
  description: string;

  images: string[];

  url: string;

  user?: {
    name: string;
    avatarUrl: string;
  };
};
