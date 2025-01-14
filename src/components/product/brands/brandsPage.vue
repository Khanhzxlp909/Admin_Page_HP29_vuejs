<template>
  <div id="app" class="app sidebar-mini rtl">
    <header class="app-header">
      <a class="app-sidebar__toggle" href="#" data-toggle="sidebar" aria-label="Hide Sidebar"></a>
      <ul class="app-nav">
        <li>
          <a class="app-nav__item" href="/brands">
            <i class="bx bx-log-out bx-rotate-180"></i>
          </a>
        </li>
      </ul>
    </header>

    <main class="app-content">
      <div class="app-title">
        <ul class="app-breadcrumb breadcrumb side">
          <li class="breadcrumb-item active">
            <a href="#"><b>Danh sách thương hiệu</b></a>
          </li>
        </ul>
        <div id="clock">{{ currentTime }}</div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-body">
              <form @submit.prevent="addBrand" class="row">
                <div class="form-group col-md-4">
                  <label for="brandName">Tên thương hiệu:</label>
                  <input
                      type="text"
                      id="brandName"
                      v-model="brand.name"
                      class="form-control"
                      required
                  />
                </div>

                <div class="form-group col-md-4">
                  <label for="brandName">Ghi chú:</label>
                  <input
                      type="text"
                      id="brandName"
                      v-model="brand.note"
                      class="form-control"
                      required
                  />
                </div>
                <button type="submit" class="btn btn-primary">
                  Thêm thương hiệu
                </button>
              </form>
              <table class="table table-hover table-bordered mt-3" id="sampleTable">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên thương hiệu</th>
                  <th>Ghi chú</th>
                  <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in brands" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.note }}</td>
                  <td>
                    <button class="btn btn-warning btn-sm" @click="editBrand(item)">Sửa</button>
                    <button class="btn btn-danger btn-sm" @click="confirmDelete(item)">Xóa</button>
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
import Cookies from "js-cookie";

export default {
  data() {
    return {
      currentTime: "",
      currentPage: 0,
      pageSize: 5,
      totalPages: 0,
      brands: [],
      brand: { name: "" },
    };
  },
  methods: {
    async fetchBrands(page = 0, size = 5) {
      const token = Cookies.get("token");
      if (!token) {
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/admin/brands/get?page=${page}&size=${size}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.brands = response.data.content;
        console.log(this.brands);
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thương hiệu:", error);
        alert("Không thể tải danh sách thương hiệu.");
      }
    },
    async addBrand() {
      const token = Cookies.get("token");
      if (!token) {
        alert("Bạn cần đăng nhập.");
        return;
      }

      try {
        await axios.post("http://localhost:8080/admin/brands/save", this.brand, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.fetchBrands(this.currentPage, this.pageSize);
        this.brand = { name: "" }; // Reset form
      } catch (error) {
        console.error("Lỗi khi thêm thương hiệu:", error);
        alert("Không thể thêm thương hiệu.");
      }
    },
    async deleteBrand(id) {
      const token = Cookies.get("token");
      if (!token) {
        alert("Bạn cần đăng nhập.");
        return;
      }

      try {
        await axios.get(`http://localhost:8080/admin/brands/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.fetchBrands(this.currentPage, this.pageSize);
      } catch (error) {
        console.error("Lỗi khi xóa thương hiệu:", error);
        alert("Không thể xóa thương hiệu.");
      }
    },
    confirmDelete(brand) {
      if (confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${brand.name}"?`)) {
        this.deleteBrand(brand.id);
      }
    },
    editBrand(brand) {
      this.brand = { ...brand }; // Copy dữ liệu để chỉnh sửa
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchBrands(page, this.pageSize);
    },
  },
  mounted() {
    this.fetchBrands(this.currentPage, this.pageSize);
  },
};
</script>

<style>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.page-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
}
.page-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
