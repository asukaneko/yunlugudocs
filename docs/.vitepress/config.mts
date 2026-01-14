import { defineConfig } from 'vitepress'
import type { PluginOption } from 'vite'
import { 
  GitChangelog, 
  GitChangelogMarkdownSection, 
} from '@nolebase/vitepress-plugin-git-changelog/vite'
import {
  PageProperties,
  PagePropertiesMarkdownSection,
} from '@nolebase/vitepress-plugin-page-properties/vite'

export default defineConfig({
  vite: { 
    optimizeDeps: {
      exclude: [ 
        '@nolebase/vitepress-plugin-enhanced-readabilities/client', 
        'vitepress', 
        '@nolebase/ui', 
      ], 
    },
    ssr: { 
      noExternal: [ 
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可
        '@nolebase/vitepress-plugin-highlight-targeted-heading', 
        '@nolebase/vitepress-plugin-enhanced-readabilities', 
        '@nolebase/ui', 
      ], 
    }, 
    plugins: [
      PageProperties(),
      PagePropertiesMarkdownSection({
        excludes: ['index.md'],
      }),
      
      GitChangelog({ 
        // 填写在此处填写您的仓库链接
        repoURL: () => 'https://github.com/asukaneko/yunlugudocs', 
      }), 
      GitChangelogMarkdownSection({
        sections: {
          // 禁用页面历史
          disableChangelog: false,
          // 禁用贡献者
          disableContributors: true,
        },
      }) as any,
    ],
  }, 
  title: "中南云麓谷新生培训文档",
  description: "",
  lang: 'zh-CN',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    docFooter: { 
      prev: '上一页', 
      next: '下一页', 
    }, 
    outline: { 
      level: [2,4], // 显示2-4级标题
      label: '当前页大纲' // 文字显示
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short', // 可选值full、long、medium、short
        timeStyle: 'medium' // 可选值full、long、medium、short
      },
    },
    logo:'',
    nav: [
      { text: '主页', link: '/' },
      { text: '部门介绍', link: '' }
    ],
    sidebar: {
      '/wangluo/': [
        {
          text:'首页',
          link:'/wangluo/index.md'
        },
        {
          text: '〇、环境准备',
          collapsed: false,
          items: [
            { text: '开发环境搭建', link: '/wangluo/p0_prepare.md' },
          ]
        },
        {
          text: '一、工具介绍',
          collapsed: false,
          items: [
            { text: '计算机网络', link: '/wangluo/p1_network.md' },
            { text: 'git与github', link: '/wangluo/p1_github.md' },
            { text: 'apifox', link: '/wangluo/p1_apifox.md'},
          ]
        },
        {
          text: '二、后端实战',
          collapsed: false,
          items: [
            { text: 'Python Flask', link: '/wangluo/p2_flask.md' },
            { text: 'Node.js Express', link: '/wangluo/p3_nodejs.md' },
          ]
        },
        {
          text: '三、动手实践',
          collapsed: false,
          items: [
            { text: '你的第一个 API', link: '/wangluo/p4_practice.md' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/asukaneko/yunlugudocs' }
    ],

    search: {
      provider: 'local'
    },
    footer: {
      message: 'Released under the Apache 2.0 License',
      copyright: 'Copyright © 2025-present <a href="https://github.com/asukaneko">Asukaneko</a>'
    },
    editLink: {
      pattern: 'https://github.com/asukaneko/yunlugudocs',
      text: '在GitHub上编辑此页'
    }
  },
  ignoreDeadLinks: true,
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },
    math: true,
    image: {
      // 开启图片懒加载
      lazyLoading: true
    },
    // 组件插入h1标题下
    config(md) {
      // 创建 markdown-it 插件
      md.use((md) => {
        const defaultRender = md.render
        md.render = function (...args) {
          const [content, env] = args
          const isHomePage = env.path === '/' || env.relativePath === 'index.md'  // 判断是否是首页

          if (isHomePage) {
            return defaultRender.apply(md, args) // 如果是首页，直接渲染内容
          }
          // 在每个 md 文件内容的开头插入组件
          const defaultContent = defaultRender.apply(md, args)
          const component = '<ArticleMetadata />\n'
          return component + defaultContent
        }
      })
    }
  },
  lastUpdated: true
})
