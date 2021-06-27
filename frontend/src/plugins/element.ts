import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/ru'
import { App } from '@vue/runtime-core'

export default (app:App) => {
  app.use(ElementPlus, { locale })
}
