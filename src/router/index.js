import Vue from 'vue'
import Router from 'vue-router'
// 懒加载路由
const Manage = () => import('../views/Manage')
const Login = () => import('../views/safety/Login')
const quoteSearch = () => import('../views/quoteSearch')
const quoteImport = () => import('../views/quoteImport')
const favourites = () => import('../views/favourites')
const setting = () => import('../views/setting')
const dataAnalysis = () => import('../views/dataAnalysis')

// 运价导入页面子页面
const templateImport = () => import('../views/quotationImport/templateImport')
const manualEntry = () => import('../views/quotationImport/manualEntry')
const apiAccess = () => import('../views/quotationImport/apiAccess')

// 系统设置页面子页面
const place = () => import('../views/systemSetting/place')
const port = () => import('../views/systemSetting/port')
const placeRouter = () => import('../views/systemSetting/placeRouter')
const trunkRouter = () => import('../views/systemSetting/trunkRouter')
const charge = () => import('../views/systemSetting/charge')
const priceLevel = () => import('../views/systemSetting/priceLevel')
const companyPreferences = () => import('../views/systemSetting/companyPreferences')
const personalPreferences = () => import('../views/systemSetting/personalPreferences')
const exchangeRate = () => import('../views/systemSetting/exchangeRate')

Vue.use(Router)

let routerOpt = {
  mode: 'history',
  base: '/',
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { title: 'FMP-登录', keepAlive: false, permission: ['dashboard'] },
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage,
      meta: { title: '运费条件搜索', keepAlive: false, permission: ['dashboard'] },
      children: [
        {
          path: '/manage/quoteSearch',
          name: 'quoteSearch',
          component: quoteSearch,
          meta: { title: '运价搜索', keepAlive: false, permission: ['ahaha'] },
        },
        {
          path: '/manage/quoteImport',
          name: 'quoteImport',
          component: quoteImport,
          meta: { title: '运价导入', keepAlive: false, permission: ['ahaha'] },
          children: [
            {
              path: '/manage/quoteImport/templateImport',
              name: 'templateImport',
              component: templateImport,
              meta: { title: '运价导入-模板导入', keepAlive: false, permission: ['ahaha'] }
            },
            {
              path: '/manage/quoteImport/manualEntry',
              name: 'manualEntry',
              component: manualEntry,
              meta: { title: '运价导入-手工录入', keepAlive: false, permission: ['ahaha'] },
            },
            {
              path: '/manage/quoteImport/apiAccess',
              name: 'apiAccess',
              component: apiAccess,
              meta: { title: '运价导入-API接入', keepAlive: false, permission: ['ahaha'] },
            },
          ]
        },
        {
          path: '/manage/favourites',
          name: 'favourites',
          component: favourites,
          meta: { title: '我的收藏', keepAlive: false, permission: ['ahaha'] },
        },
        {
          path: '/manage/setting',
          name: 'setting',
          component: setting,
          meta: { title: '系统设置', keepAlive: false, permission: ['ahaha'] },
          children: [
            {
              path: '/manage/setting/place',
              name: 'place',
              component: place,
              meta: { title: '系统设置-门点', keepAlive: false, permission: ['ahaha'] }
            },
            {
              path: '/manage/setting/port',
              name: 'port',
              component: port,
              meta: { title: '系统设置-港站', keepAlive: false, permission: ['ahaha'] },
            },
            {
              path: '/manage/setting/placeRouter',
              name: 'placeRouter',
              component: placeRouter,
              meta: { title: '系统设置-门点路由', keepAlive: false, permission: ['ahaha'] }
            },
            {
              path: '/manage/setting/trunkRouter',
              name: 'trunkRouter',
              component: trunkRouter,
              meta: { title: '系统设置-干线路由', keepAlive: false, permission: ['ahaha'] },
            },
            {
              path: '/manage/setting/charge',
              name: 'charge',
              component: charge,
              meta: { title: '系统设置-收费条目', keepAlive: false, permission: ['ahaha'] },
            },
            {
              path: '/manage/setting/priceLevel',
              name: 'priceLevel',
              component: priceLevel,
              meta: { title: '系统设置-价格等级', keepAlive: false, permission: ['ahaha'] }
            },
            {
              path: '/manage/setting/companyPreferences',
              name: 'companyPreferences',
              component: companyPreferences,
              meta: { title: '系统设置-公司偏好', keepAlive: false, permission: ['ahaha'] },
            },
            {
              path: '/manage/setting/personalPreferences',
              name: 'personalPreferences',
              component: personalPreferences,
              meta: { title: '系统设置-个人偏好', keepAlive: false, permission: ['ahaha'] }
            },
            {
              path: '/manage/setting/exchangeRate',
              name: 'exchangeRate',
              component: exchangeRate,
              meta: { title: '系统设置-汇率', keepAlive: false, permission: ['ahaha'] },
            },
          ]
        },
        {
          path: '/manage/dataAnalysis',
          name: 'dataAnalysis',
          component: dataAnalysis,
          meta: { title: '数据分析', keepAlive: false, permission: ['ahaha'] },
        },
      ]
    },
  ]
}

// 获取本地存储的异步路由
let routesList = localStorage.getItem('asyncRoute')
try {
  routesList = JSON.parse(routesList)
  if (!Array.isArray(routesList)) {
    routesList = []
  }
} catch (e) {
  routesList = []
}

routesList.forEach(function (item, index) {
  item.component = () => import(`../views/${item.componentPath}`)
  
})


routerOpt.routes = routerOpt.routes.concat(routesList)

let routers = new Router(routerOpt)

export default routers
