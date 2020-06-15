// https://vuex.vuejs.org/en/modules.html

const requireModule = require.context('.', true, /\.js$/)
const modules = {}

requireModule.keys().forEach(fileName => {
  if (fileName === './index.js') return

  // Replace ./ and .js
  const path = fileName.replace(/(\.\/|\.js)/g, '')
  const [moduleName, imported] = path.split('/')

 /* 参考vuetify-material-dashboard-master
 if (!modules[moduleName]) {
    modules[moduleName] = {
      namespaced: true
    }
  }
  modules[moduleName][imported] = requireModule(fileName).default */
  
  modules[moduleName] = requireModule(fileName).default//改成按文件加载

})

export default modules
