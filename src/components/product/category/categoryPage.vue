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
          <a class="app-nav__item" href="/order">
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
              <form @submit.prevent="addCategory" class="row">
                <div class="form-group col-md-3">
                  <label for="productPrice">Name:</label>
                  <input
                      type="text"
                      id="productPrice"
                      v-model="this.category.name"
                      class="form-control"
                      required
                  />
                </div>
                <div class="form-group col-md-3">
                  <label for="variationstatus">Tình trạng:</label>
                  <select
                      id="variationstatus"
                      v-model="category.status"
                      class="form-control"
                  >
                    <option value="true">Còn hàng</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">
                  Thêm danh mục
                </button>
              </form>
              <div class="row element-button">
                <div class="col-sm-2">
                  <button
                      class="btn btn-add btn-sm"
                      @click="navigateToAddVariation"
                      title="Thêm"
                  >
                    <i class="fas fa-plus"></i> Tạo mới biến thể
                  </button>
                </div>
                <div class="col-sm-2">
                  <button
                      class="btn btn-add btn-sm"
                      @click="navigateToAddProduct"
                      title="Thêm"
                  >
                    <i class="fas fa-plus"></i> Tạo mới sản phẩm
                  </button>
                </div>
              </div>
              <table class="table table-hover table-bordered" id="sampleTable">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên danh mục</th>
                  <th>Tình trạng</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in this.category" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>
                      <span
                          :class="{
                          'badge bg-success': item.status,
                          'badge bg-danger': !item.status,
                        }"
                      >{{ item.status ? "Đang hoạt động" : "Không còn hoạt động" }}</span
                      >
                  </td>
                  <td>
                    <button
                        class="btn btn-delete"
                        @click="confirmDelete(item)"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
              <div class="pagination">
                <button
                    class="page-button"
                    :disabled="currentPage === 0"
                    @click="changePage(currentPage - 1)"
                >
                  Previous
                </button>
                <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
                <button
                    class="page-button"
                    :disabled="currentPage >= totalPages - 1"
                    @click="changePage(currentPage + 1)"
                >
                  Next
                </button>
              </div>
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
      pageSize: 5, // Số sản phẩm mỗi trang
      totalPages: 0, // Tổng số trang
      category: [],
    };
  },

  methods: {
    navigateToAddVariation() {
      this.$router.push("/category"); // Chuyển hướng đến `productAdd.vue`
    },
    navigateToAddProduct() {
      this.$router.push("/addproduct"); // Chuyển hướng đến `productAdd.vue`
    },
    // Xóa sản phẩm
    addCategory() {
      const token = Cookies.get("token");
      if (!token) {
        alert("Token không hợp lệ hoặc không tồn tại.");
        return;
      }
      const apiurl = "http://localhost:8080/admin/category/save";
      const data = {
        name: this.category.name,
        status: this.category.status,
      };
      axios
          .post(apiurl, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("Thêm danh sách thẩm thanh cong");
            this.fetchCategory(this.currentPage, this.pageSize);
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi thêm danh sách thẩm:", error);
          });
    },
    deleteCategory(categoryId) {
      const token = Cookies.get("token");
      if (!token) {
        alert("Token Needless hợp lệ hoặc Needless tồn tại.");
        return;
      }
      const apiurl = "http://localhost:8080/admin/category/delete/" + categoryId;
      axios
          .get(apiurl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("Thanh cong");
            this.fetchCategory(this.currentPage, this.pageSize);
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi xóa danh sách thẩm:", error);
          });
    },
    // Xử lý xóa sản phẩm
    confirmDelete(product) {
      if (
          confirm(
              `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`
          )
      ) {
        this.deleteCategory(product.id);
      }
    },
    // Chuyển trang
    changePage(page) {
      this.currentPage = page;
      this.fetchvariations(page, this.pageSize);
    },
    editProduct(product) {
      this.$router.push({path: `/product/edit/${product.id}`}); // Chuyển đến trang chỉnh sửa sản phẩm
    },
    toggleAllCheckboxes() {
      const allChecked = this.variations.every((product) => product.selected);
      this.variations.forEach((product) => (product.selected = !allChecked));
    },
    // Lấy danh sách sản phẩm
    async fetchCategory(page = 0, size = 5) {
      const token = Cookies.get("token");

      if (!token) {
        console.error("Token không tồn tại trong cookie. Vui lòng đăng nhập.");
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }

      try {
        console.log("Fetching products với token:", token);

        const response = await axios.get(
            `http://localhost:8080/admin/category/get?page=${page}&size=${size}`);
        this.category = response.data.content;

        console.log("Danh sách sản phẩm:", this.category);
      } catch (error) {
        console.error("Lỗi khi fetch products:", error);
        if (error.response?.status === 401) {
          alert("Không có quyền truy cập. Vui lòng đăng nhập lại.");
          this.$router.push("/login");
        } else {
          alert("Không thể tải danh sách sản phẩm.");
        }
      }
    },

    // Gửi request thêm sản phẩm
  },
  mounted() {
    this.fetchCategory(this.currentPage, this.pageSize);
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
