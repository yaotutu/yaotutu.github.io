import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import { marked } from "marked";

export async function GET(context) {
  const posts = await getCollection("blog");
  const siteUrl = context.site;
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: siteUrl,
    items: posts.map((post) => {
      const { body } = post;

      // 使用 marked 解析 Markdown 内容，并调整图片路径
      const content = marked(body).replace(/src="([^"]+)"/g, (match, src) => {
        // 如果路径是相对路径，转换为绝对路径
        if (!src.startsWith("http") && !src.startsWith("//")) {
          return `src="${new URL(src, siteUrl).toString()}"`;
        }
        return match;
      });

      return {
        ...post.data,
        link: `/blog/${post.slug}/`,
        content, // 替换后的内容
      };
    }),
  });
}
