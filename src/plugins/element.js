// 按需引入element-ui的组件
// element.js 全文内容如下，按自己需要引入就好了
import Vue from 'vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Input,
  InputNumber,
  Image,
  Select,
  Option,
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
  DropdownItem,
  Dialog,
  Col,
  Row,
  Progress,
  Table,
  TableColumn,
  Tooltip,
  Tabs,
  TabPane,
  Checkbox
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// 注册element-ui组件到Vue
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Image)
Vue.use(Option)
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
Vue.use(Dialog)
Vue.use(Col)
Vue.use(Row)
Vue.use(InputNumber)
Vue.use(Progress)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Checkbox)
// 服务模式
Vue.use(Loading)
// 指令模式
Vue.use(Loading.directive)
/*  挂载element提示信息类型到vue原型上 */
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$message = Message
