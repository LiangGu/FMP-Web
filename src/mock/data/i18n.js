export const getI18nData = req => {
    console.log('@@@Mock请求参数：', req)
    return {
        'code': 200,
        'message': 'success',
        'data': {
            menu: {
                demo: '案例',
                doc: "文档",
                system: '系统管理',
                basicAbility: '基础能力',
                frameworkFunctions: "框架功能",
                rightControl: '权限控制',
                noAccess: '无权限页面',
                sendPost: "发送请求",
                frosPackerDoc: '多环境打包'
            },
        }
    }
}
