import { getServerSideSitemapIndex, ISitemapField } from "next-sitemap";
import { GetServerSideProps } from "next";
import { NEXT_URL } from "@config/index";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Method to source urls from cms
  const response = await fetch(`${NEXT_URL}/api/products/allProducts`);
  const data = await response.json();

  const fields = data.map((product) => ({
    loc: `${NEXT_URL}/products/${product._id}`,
    lastmod: new Date(product.updatedAt).toISOString(),
  }));

  return getServerSideSitemapIndex(ctx, fields);
};

// Default export to prevent next.js errors
export default function SitemapIndex() {}
