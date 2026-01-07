export type TokenCardProps = {
  id: string;
  name: string;
  subtext: string;
  marketCap: string;
  followers: number;
  likes: number;
  dislikes: number;
  timeFrame: string;
  amount: string;
  imageUrl: string;
  description: string;
  socialLinks: {
    instagram?: string;
    website?: string;
    discord?: string;
    telegram?: string;
    twitter?: string;
  };
};



/*
export type TokenCardProps = {
    name: string
    id:string;
    subtext: string
    marketCap: string
    followers: number
    likes: number
    dislikes: number
    timeFrame: string
    amount: string
    imageUrl: string
    socialLinks: {
        instagram?: string
        website?: string
        discord?: string
        telegram?: string
        twitter?: string
    }
}

*/
