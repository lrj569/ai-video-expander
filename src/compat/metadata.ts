export type Metadata = Record<string, any>;

export namespace MetadataRoute {
  export type Sitemap = Array<{
    url: string;
    lastModified?: string | Date;
  }>;

  export type Robots = {
    rules: Array<{
      userAgent: string | string[];
      allow?: string | string[];
      disallow?: string | string[];
    }>;
    sitemap?: string;
    host?: string;
  };
}
