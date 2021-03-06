const dev = process.env.NODE_ENV !== "production";

export const NEXT_URL = dev
  ? "http://localhost:3000"
  : "https://bloomshair.co.uk";

export const POSTS_PER_PAGE = 6;

const productionUrl = "https://web.squarecdn.com/v1/square.js";
const sandBoxUrl = "https://sandbox.web.squarecdn.com/v1/square.js";

export const paymentFormUrl = dev ? sandBoxUrl : productionUrl;
