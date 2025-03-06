/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "dev-fiveheart.pantheonsite.io",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // ✅ Courses
        {
          source: "/api/courses",
          destination: "https://dev-fiveheart.pantheonsite.io/api/courses?_format=json",
        },
        {
          source: "/api/course-search-detail/:id",
          destination: "https://dev-fiveheart.pantheonsite.io/api/course-search-detail/:id?_format=json",
        },
        {
          source: "/api/course-search/:brand",
          destination: "https://dev-fiveheart.pantheonsite.io/api/course-search/:brand?_format=json",
        },

        // ✅ News (Newly Added)
        {
          source: "/api/news",
          destination: "https://dev-fiveheart.pantheonsite.io/api/news?_format=json",
        },

        // ✅ Paragraphs (Fix incorrect URL structure)
        {
          source: "/api/paragraph/:id",
          destination: "https://dev-fiveheart.pantheonsite.io/paragraph-api/:id?_format=json",
        },

        // ✅ Menus (Fix incorrect path)
        {
          source: "/api/menu/:slug",
          destination: "https://dev-fiveheart.pantheonsite.io/api/menu_items/:slug?_format=json",
        },

        // ✅ Partners
        {
          source: "/api/partners",
          destination: "https://dev-fiveheart.pantheonsite.io/api/partners?_format=json",
        },
      ],
    };
  },
};

module.exports = nextConfig;
