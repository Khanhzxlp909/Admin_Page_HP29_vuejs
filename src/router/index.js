import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/components/view/orderPage.vue";
import POSOrder from "@/components/order/orderForm.vue";
import ListOrder from "@/components/order/listOrder.vue";
import LoginPage from "@/components/login/loginPages.vue";
import productPage from "@/components/product/productPage.vue";
import uploadImages from "@/components/product/uploadImagesProduct.vue";
import productEdit from "@/components/product/productEdit.vue";
import productAdd from "@/components/product/productAdd.vue";
import customerList from "@/components/customer/customerList.vue";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/order", component: POSOrder },
  { path: "/posorder", component: ListOrder },
  { path: "/login", component: LoginPage },
  { path: "/product", component: productPage }, // Trang danh sách sản phẩm
  { path: "/addproduct", component: uploadImages }, // Trang danh sách sản phẩm
  { path: "/product/add", component: productAdd }, // Trang thêm sản phẩm
  { path: "/product/edit/:id", component: productEdit, props: true }, // Trang sửa sản phẩm
  { path: "/customer", component: customerList }, // Trang danh sách khách hàng
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
