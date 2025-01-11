import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/components/view/orderPage.vue";
import POSOrder from "@/components/order/orderForm.vue";
import ListOrder from "@/components/order/listOrder.vue";
import LoginPage from "@/components/login/loginPages.vue";
import productPage from "@/components/product/productPage.vue";
import productEdit from "@/components/product/productEdit.vue";
import customerList from "@/components/customer/customerList.vue";
//import customerEdit from "@/components/customer/customerEdit.vue";
//import customerAdd from "@/components/customer/customerAdd.vue";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/order", component: POSOrder },
  { path: "/posorder", component: ListOrder },
  { path: "/login", component: LoginPage },
  { path: "/product", component: productPage },
  { path: "/customer", component: customerList},
  { path: "/product/edit/:id", component: productEdit, props: true }, // Đảm bảo đã có props: true
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
