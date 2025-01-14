import {createRouter, createWebHistory} from "vue-router";
import Dashboard from "@/components/view/orderPage.vue";
import POSOrder from "@/components/order/orderForm.vue";
import ListOrder from "@/components/order/listOrder.vue";
import LoginPage from "@/components/login/loginPages.vue";
import productPage from "@/components/product/productPage.vue";
import uploadImages from "@/components/product/uploadImagesProduct.vue";
import productEdit from "@/components/product/productEdit.vue";
import productAdd from "@/components/product/productAdd.vue";
import customerList from "@/components/customer/customerList.vue";

import wareHouse from "@/components/wareHouse/warehouse.vue";
import wareHouseDetail from "@/components/wareHouse/WarehouseDetail.vue";

import customerAdd from "@/components/customer/customerAdd.vue";
import customerEdit from "@/components/customer/customerEdit.vue";

import categoryPage from "@/components/product/category/categoryPage.vue";
import brandsPage from "@/components/product/brands/brandsPage.vue";
import employeePages from "@/components/employee/employeePages.vue";
import setAccount from "@/components/employee/setAccount.vue";


const routes = [
    {path: "/", component: Dashboard},
    {path: "/order", component: POSOrder},
    {path: "/posorder", component: ListOrder},
    {path: "/login", component: LoginPage},
    {path: "/product", component: productPage}, // Trang danh sách sản phẩm
    {path: "/addproduct", component: uploadImages}, // Trang danh sách sản phẩm
    {path: "/product/add", component: productAdd}, // Trang thêm sản phẩm
    {path: "/product/edit/:id", component: productEdit, props: true}, // Trang sửa sản phẩm
    {path: "/customer", component: customerList}, // Trang danh sách khách hàng
    {path: "/employee", component: employeePages}, // Trang danh sách khách hàng

    {path: "/warehouse", component: wareHouse}, // Trang danh sách khách hàng
    {path: "/warehouse/warehouseDetails", component: wareHouseDetail}, // Trang danh sách khách hàng

    {path: "/customer/add", component: customerAdd}, // Trang them khách hàng
    {path: "/customer/edit", component: customerEdit}, // Trang sua thong tin khách hàng

    {path: "/category", component: categoryPage}, // Trang sua thong tin khách hàng

    {path: "/brands", component: brandsPage}, // Trang sua thong tin khách hàng

    {
        path: '/employee/account/:id', // Định nghĩa route với tham số :id
        name: 'EmployeeAccount',
        component: setAccount,
    },




];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
