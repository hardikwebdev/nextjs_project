export const MENUITEMS = [
  {
    Items: [
      {
        title: "Dashboard",
        icon: <i className="fe fe-home side-icon-color tx-20 mg-r-15"></i>,
        type: "sub",
        selected: false,
        active: false,
        path: `/admin/dashboard`,
        type: "link",
      },
      {
        title: "Category",
        icon: <i className="fe fe-grid side-icon-color tx-20 mg-r-15"></i>,
        type: "sub",
        selected: false,
        active: false,
        path: `/admin/categories`,
        type: "link",
      },
      {
        title: "Blogs",
        icon: <i className="fe fe-file-plus side-icon-color tx-20 mg-r-15"></i>,
        type: "sub",
        selected: false,
        active: false,
        children: [
          {
            path: `/admin/blogs/create-blog`,
            title: "Create Blog",
            type: "link",
            active: false,
            selected: false,
          },
          {
            path: `/admin/blogs/edit-blog`,
          },

          {
            path: `/admin/blogs`,
            title: "View Blogs",
            type: "link",
            active: false,
            selected: false,
          },
        ],
      },
      {
        title: "News",
        icon: <i className="far fa-newspaper side-icon-color tx-20 mg-r-15"></i>,
        type: "sub",
        selected: false,
        bookmark: true,
        active: false,
        children: [
          {
            path: `/admin/news/create-news`,
            type: "link",
            active: false,
            selected: false,
            title: "Create News",
          },
          {
            path: `/admin/news/edit-news`,
          },
          {
            path: `/admin/news`,
            type: "link",
            active: false,
            selected: false,
            title: "View News",
          },
        ],
      },
      {
        title: "Users",
        icon: <i className="fe fe-users side-icon-color tx-20 mg-r-15"></i>,
        type: "sub",
        selected: false,
        active: false,
        path: `/admin/users`,
        type: "link",
        children: [
          {
            path: `/admin/users/subscription`,
          },
          {
            path: `/admin/users/planHistory`,
          }
        ],
      },
      {
        title: "Configuration",
        icon: <i className="fe fe-settings side-icon-color tx-20 mg-r-15"></i>,
        type: "sub",
        selected: false,
        bookmark: true,
        active: false,
        children: [
          {
            path: `/admin/configurations/slider`,
            type: "link",
            active: false,
            selected: false,
            title: "Slider",
            children: [
              {
                path: `/admin/configurations/slider/home/Add-banner`,
              },
              {
                path: `/admin/configurations/slider/aboutus/Add-banner`,
              },
              {
                path: `/admin/configurations/slider/blog-block/Edit-block`,
              },
              {
                path: `/admin/configurations/slider/news-block/Edit-block`,
              },
            ]
          },
          {
            path: `/admin/configurations/generalconfigs`,
            type: "link",
            active: false,
            selected: false,
            title: "General Configs",
          },
          {
            path: `/admin/configurations/aboutus`,
            type: "link",
            active: false,
            selected: false,
            title: "About us",
            children: [
              {
                path: `/admin/configurations/aboutus/block/add-about`,
              }, {
                path: `/admin/configurations/aboutus/testimonial/add-testimonial`,
              }],
          },
          {
            path: `/admin/configurations/home-block`,
            type: "link",
            active: false,
            selected: false,
            title: "Home Block",
            children: [
              {
                path: `/admin/configurations/home-block/block/Edit-block`,
              },
              {
                path: `/admin/configurations/home-block/chat/EditChat`,
              }
            ],
          },
          {
            path: `/admin/configurations/tip`,
            type: "link",
            active: false,
            selected: false,
            title: "Tip",
            children: [
              {
                path: `/admin/configurations/tip/block/Edit-block`,
              },
              {
                path: `/admin/configurations/tip/header/EditChat`,
              }
            ],
          },
        ],
      },
      {
        title: "Subscriptions",
        icon: <i className="fab fa-wpforms tx-20 mg-r-15 side-icon-color"></i>,
        type: "sub",
        selected: false,
        active: false,
        bookmark: true,
        path: `/admin/subscription`,
        type: "link",
      },
    ],
  },
];
