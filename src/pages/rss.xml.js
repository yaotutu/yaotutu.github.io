import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import { marked } from "marked";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => {
      const { body } = post;
      return {
        ...post.data,
        link: `/blog/${post.slug}/`,
        content: marked(body),
      };
    }),
  });
}
