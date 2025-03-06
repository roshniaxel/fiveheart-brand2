/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "fiveheart.ddev.site",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // ✅ Courses
        {
          source: "/api/courses",
          destination: "http://fiveheart.ddev.site/api/courses?_format=json",
        },
        {
          source: "/api/course-search-detail/:id",
          destination: "http://fiveheart.ddev.site/api/course-search-detail/:id?_format=json",
        },
        {
          source: "/api/course-search/:brand",
          destination: "http://fiveheart.ddev.site/api/course-search/:brand?_format=json",
        },

        // ✅ News (Newly Added)
        {
          source: "/api/news",
          destination: "http://fiveheart.ddev.site/api/news?_format=json",
        },

        // ✅ Paragraphs (Fix incorrect URL structure)
        {
          source: "/api/paragraph/:id",
          destination: "http://fiveheart.ddev.site/paragraph-api/:id?_format=json",
        },

        // ✅ Menus (Fix incorrect path)
        {
          source: "/api/menu/:slug",
          destination: "http://fiveheart.ddev.site/api/menu_items/:slug?_format=json",
        },

        // ✅ Partners
        {
          source: "/api/partners",
          destination: "http://fiveheart.ddev.site/api/partners?_format=json",
        },
      ],
    };
  },
};

module.exports = nextConfig;
