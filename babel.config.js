module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    [
      "component",
      {
        // 引入umy-ui
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      },
      'element-ui'
    ],
    [
      "import",
      {
        "libraryName": "vxe-table",
        'style': true
      },
      'vxe-table'
    ]
  ]
}
