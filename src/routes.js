import loadableHandler from '@/components/loadableHandler'

module.exports = [
    {
        path: '/home',
        component: loadableHandler(() => import('./pages/home/index')),
    }
]
