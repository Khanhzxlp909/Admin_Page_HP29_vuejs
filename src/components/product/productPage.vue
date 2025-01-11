<template>
  <div id="app" class="app sidebar-mini rtl">
    <header class="app-header">
      <a
          class="app-sidebar__toggle"
          href="#"
          data-toggle="sidebar"
          aria-label="Hide Sidebar"
      ></a>
      <ul class="app-nav">
        <li>
          <a class="app-nav__item" href="/index.html">
            <i class="bx bx-log-out bx-rotate-180"></i>
          </a>
        </li>
      </ul>
    </header>

    <main class="app-content">
      <div class="app-title">
        <ul class="app-breadcrumb breadcrumb side">
          <li class="breadcrumb-item active">
            <a href="#"><b>Danh sách sản phẩm</b></a>
          </li>
        </ul>
        <div id="clock">{{ currentTime }}</div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-body">
              <div class="row element-button">
                <div class="col-sm-2">
                  <a
                      class="btn btn-add btn-sm"
                      href="form-add-san-pham.html"
                      title="Thêm"
                  >
                    <i class="fas fa-plus"></i> Tạo mới sản phẩm
                  </a>
                </div>
              </div>
              <table class="table table-hover table-bordered" id="sampleTable">
                <thead>
                <tr>
                  <th width="10">
                    <input
                        type="checkbox"
                        id="all"
                        @click="toggleAllCheckboxes"
                    />
                  </th>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Ảnh</th>
                  <th>Số lượng</th>
                  <th>Tình trạng</th>
                  <th>Giá tiền</th>
                  <th>Danh mục</th>
                  <th>Chức năng</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in products" :key="product.id">
                  <td width="10">
                    <input type="checkbox" v-model="product.selected"/>
                  </td>
                  <td>{{ product.id }}</td>
                  <td>{{ product.productID.name }}</td>
                  <td>
                    <img :src="getDefaultImageUrl(product.productID.imagesDTOS)"
                        alt=""
                        width="70px;"
                    />
                  </td>
                  <td>{{ product.quantity }}</td>
                  <td>
                    <span
                        :class="{
                            'badge bg-success': product.status,
                            'badge bg-danger': !product.status,
                          }"
                        >{{ product.status ? "Còn hàng" : "Hết hàng" }}</span
                        >
                  </td>
                  <td>{{ product.price }}</td>
                  <td>{{ product.productID.categoryID.name }}</td>
                  <td>
                    <button class="btn btn-edit" @click="editProduct(product)">
                      Sửa
                    </button>
                    <button class="btn btn-delete" @click="confirmDelete(product)">
                      Xóa
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie"; // Import thư viện js-cookie

export default {
  data() {
    return {
      currentTime: "",
      currentPage: 0, // Số trang hiện tại
      pageSize: 10, // Số sản phẩm mỗi trang
      totalPages: 0, // Tổng số trang
      products: [], // Dữ liệu sản phẩm
      selectedProduct: {
        code: "",
        name: "",
        quantity: "",
        status: "",
        price: "",
        category: "",
      },
    };
  },
  methods: {
    // Lấy danh sách sản phẩm
    fetchProducts(page = 0, size = 10) {
      axios
          .get(
              `http://localhost:8080/admin/variation/result/all?page=${page}&size=${size}`
          )
          .then((response) => {
            this.products = response.data.content;
            this.totalPages = response.data.totalPages;
            console.log(response.data.content);
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm:", error);
          });
    },
    getDefaultImageUrl(imagesDTOS) {
      if (imagesDTOS && imagesDTOS.length > 0) {
        const defaultImage = imagesDTOS.find((image) => image.set_Default); // Tìm ảnh có set_Default = true
        return defaultImage
            ? `http://localhost:8080/images/${defaultImage.cd_Images}`
            : "/img/default.jpg";
      }
      return "/img/default.jpg"; // Trường hợp không có hình ảnh
    },
    // Xóa sản phẩm
    deleteProduct(productId) {
      const token = Cookies.get("token"); // Lấy token từ cookies

      if (!token) {
        alert("Token không hợp lệ hoặc không tồn tại.");
        return;
      }
      const apiurl = "http://localhost:8080/admin/variation/delete/" + productId;
      console.log(token);
      console.log(apiurl);
      axios
          .get(apiurl, {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
            },
          })
          .then((response) => {
            // Sau khi xóa thành công, tải lại danh sách sản phẩm
            this.fetchProducts(this.currentPage, this.pageSize);
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi xóa sản phẩm:", error);
          });
    },
    // Xử lý xóa sản phẩm
    confirmDelete(product) {
      if (
          confirm(
              `Bạn có chắc chắn muốn xóa sản phẩm "${product.productID.name}"?`
          )
      ) {
        this.deleteProduct(product.id);
      }
    },
    updateTime() {
      const today = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      this.currentTime = today.toLocaleDateString("vi-VN", options);
    },
    // Chuyển trang
    changePage(page) {
      this.currentPage = page;
      this.fetchProducts(page, this.pageSize);
    },
    editProduct(product) {
      this.$router.push({path: `/product/edit/${product.id}`}); // Chuyển đến trang chỉnh sửa sản phẩm
    },
    toggleAllCheckboxes() {
      const allChecked = this.products.every((product) => product.selected);
      this.products.forEach((product) => (product.selected = !allChecked));
    },
  },
  mounted() {
    this.updateTime();
    this.fetchProducts(this.currentPage, this.pageSize);
  },
};
</script>
<style>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.page-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.page-button:hover {
  background-color: #0056b3;
}

.page-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.page-button.active {
  background-color: #28a745;
  color: white;
}

</style>
  