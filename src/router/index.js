import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/components/view/orderPage.vue";
import POSOrder from "@/components/order/orderForm.vue";
import ListOrder from "@/components/order/listOrder.vue";
import LoginPage from "@/components/login/loginPages.vue";
import variationPage from "@/components/product/VariationPage.vue";
import uploadImages from "@/components/product/productPages.vue";
import productEdit from "@/components/product/productEdit.vue";
import productAdd from "@/components/product/productAdd.vue";
import customerList from "@/components/customer/customerList.vue";
import categoryPage from "@/components/product/category/categoryPage.vue";
import brandsPage from "@/components/product/brands/brandsPage.vue";
import customerAdd from "@/components/customer/customerAdd.vue";
import customerEdit from "@/components/customer/customerEdit.vue";
import employeePages from "@/components/employee/employeePages.vue";
import setAccount from "@/components/employee/setAccount.vue";
import NewPage from "@/components/news/NewsPage.vue";
import IntroPage from "@/components/news/intro/IntroPage.vue";
import ContactPage from "@/components/contact/ContactPage.vue";

import Cookies from "js-cookie";

const routes = [
    { path: "/", component: Dashboard, meta: { requiresAuth: true } },
    { path: "/order", component: POSOrder, meta: { requiresAuth: true } },
    { path: "/posorder", component: ListOrder, meta: { requiresAuth: true } },
    { path: "/login", component: LoginPage },
    { path: "/product", component: variationPage, meta: { requiresAuth: true } },
    { path: "/addproduct", component: uploadImages, meta: { requiresAuth: true } },
    { path: "/product/add", component: productAdd, meta: { requiresAuth: true } },
    { path: "/product/edit/:id", component: productEdit, props: true, meta: { requiresAuth: true } },
    { path: "/customer", component: customerList, meta: { requiresAuth: true } },
    { path: "/employee", component: employeePages, meta: { requiresAuth: true } },
    { path: "/customer/add", component: customerAdd, meta: { requiresAuth: true } },
    { path: "/customer/edit", component: customerEdit, meta: { requiresAuth: true } },
    { path: "/category", component: categoryPage, meta: { requiresAuth: true } },
    { path: "/brands", component: brandsPage, meta: { requiresAuth: true } },
    { path: "/contact", component: ContactPage , meta: { requiresAuth: true }},
    { path: "/employee/account/:id", name: "EmployeeAccount", component: setAccount, meta: { requiresAuth: true } },
    { path: "/news", name: "NewsPage", component: NewPage , meta: { requiresAuth: true }},
    { path: "/intro", name: "IntroPage", component: IntroPage , meta: { requiresAuth: true }},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard để kiểm tra trạng thái đăng nhập
router.beforeEach((to, from, next) => {
    const isAuthenticated = Cookies.get("authToken");
    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/login"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    } else {
        next(); // Cho phép truy cập nếu đã đăng nhập hoặc không cần xác thực
    }
});

export default router;
