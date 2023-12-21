// 按需引入element-ui的组件
// element.js 全文内容如下，按自己需要引入就好了
import Vue from 'vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Input,
  Button,
  Upload,
  Menu,
  Submenu,
  MenuItem,
  Icon,
  Loading,
  Message,
  MessageBox,
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// 注册element-ui组件到Vue
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Upload)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Icon)
Vue.use(Avatar)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
/*  挂载element提示信息类型到vue原型上 */
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$message = Message;
