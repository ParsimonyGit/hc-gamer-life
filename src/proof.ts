/** Amazon listing for the HCG1. Reviews are shown verbatim; ratings are a dated snapshot. */
export const AMAZON_LISTING_URL = "https://www.amazon.com/dp/B07BHYZFLF";
export const AMAZON_RATING = "4.2";
export const AMAZON_RATING_COUNT = "485";
export const AMAZON_SNAPSHOT_LABEL = "Nov 18, 2026";

export type Review = { quote: string; author: string; title?: string };

/** Named Amazon reviews, also published on hcgamerlife.com. */
export const NAMED_REVIEWS: Review[] = [
  {
    title: "Ditch your turtle beaches and try these...",
    quote: "These headsets are almost all metal. I have Sennheiser 518 and they don't feel as well built as these. I was pretty shocked. They're really comfortable. You can wear these things for hours and hardly notice.",
    author: "Craig B."
  },
  {
    title: "Definetly a great purchase!",
    quote: "The very first time I used this headset my friends reported that not only could they hear me better and more clearly, but they weren’t getting a bunch of feedback from my end. No sound distortion!!",
    author: "Spencer H."
  },
  {
    title: "A gaming headset that's built to last",
    quote: "It's hard to find products that are well constructed, so I was pleasantly surprised when I first picked these up and wore them. They don't have the cheap plasticky feel that a lot of \"gaming\" headsets have.",
    author: "G Corgi"
  }
];

/** Excerpts shown on the Amazon listing's review highlights. Reviewer names are not shown there. */
export const AMAZON_EXCERPTS = {
  comfort: "Very comfortable, I have been off for the holidays and played for 10 hours straight some days and it didn't hurt my head.",
  partyChat: "It's well-cushioned and comfortable to wear for hours. The microphone makes my voice clear and crisp for Xbox party chat.",
  build: "The build quality of the headset is substantial. The cans hang from a curved chassis of spring steel which provides the gentle clamping force.",
  mic: "Microphone works flawlessly and I have been told it’s really clear, voices come through very well.",
  allAround: "These headphones are used for gaming and music. The construction, comfort and sound quality are all amazing!"
};
