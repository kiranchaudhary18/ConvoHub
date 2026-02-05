module.exports = {
  siteUrl: 'https://convohub.in',
  generateRobotsTxt: true,
  sitemapSize: 50000,
  changefreq: 'daily',
  priority: 0.7,
  
  robotsTxtOptions: {
    sitemaps: [
      'https://convohub.in/sitemap.xml',
      'https://convohub.in/sitemap-0.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/private', '/uploads', '/_next', '/chat/*'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
    ],
  },

  exclude: [
    '/admin',
    '/api/*',
    '/private',
    '/uploads',
    '/404',
    '/500',
    '/_next/*',
    '/chat/*',
    '/*.json$',
  ],

  staticPages: [
    {
      loc: 'https://convohub.in',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: 'https://convohub.in/login',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: 'https://convohub.in/register',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    },
  ],

  transform: async (config, path) => {
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/login' || path === '/register') {
      priority = 0.8;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
