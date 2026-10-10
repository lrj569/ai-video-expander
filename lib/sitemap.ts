import type { MetadataRoute } from '@/src/compat/metadata';
import contentMetadata from '@/src/generated/content-metadata.json';
import { sitemapPolicies } from '@/src/lib/page-policy';
import { serverCmsApi } from './server-api';
import { websiteConfig } from '@/website-config';

const BASE_URL = websiteConfig.canonical.url.replace(/\/$/, '');

// 生成博客文章slug
function generateSlug(title: string, url?: string): string {
  // 如果 url 字段存在且包含连字符，直接使用
  if (url && url.includes('-')) {
    return url.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
  }
  
  // 否则使用原来的生成方式
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

function manifestDate(path: string): string | undefined {
  return contentMetadata.pages[path as keyof typeof contentMetadata.pages]?.lastModified;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = sitemapPolicies
    .filter((policy) => policy.sitemap === 'manifest' || policy.sitemap === 'cms-index')
    .map((policy) => ({
      url: `${BASE_URL}${policy.path === '/' ? '' : policy.path}`,
      lastModified: manifestDate(policy.path),
    }));

  try {
    const blogResponse = await serverCmsApi.getBlogList(1, 100, 0);
    const posts = Array.isArray(blogResponse?.list) ? blogResponse.list : [];
    const validUpdates = posts
      .map((post) => Number(post.updated_time))
      .filter((value) => Number.isFinite(value) && value > 0);
    const latestBlogUpdate = validUpdates.length
      ? new Date(Math.max(...validUpdates) * 1000).toISOString()
      : undefined;
    const blogIndex = sitemapEntries.find((entry) => entry.url === `${BASE_URL}/blog`);
    if (blogIndex && latestBlogUpdate) blogIndex.lastModified = latestBlogUpdate;

    for (const post of posts) {
      const slug = generateSlug(post.title, post.url);
      sitemapEntries.push({
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: Number.isFinite(Number(post.updated_time)) && Number(post.updated_time) > 0
          ? new Date(Number(post.updated_time) * 1000).toISOString()
          : undefined,
      });
    }
  } catch (error) {
    console.error('Sitemap: failed to fetch CMS blog posts; serving registered static routes only.', error);
  }

  return sitemapEntries;
}
