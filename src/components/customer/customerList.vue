<template>
  <div id="app" class="app sidebar-mini rtl">
    <!-- Navbar -->
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
            <a href="#"><b>Danh sách khách hàng</b></a>
          </li>
        </ul>
        <div id="clock"></div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-body">
              <div class="row element-button">
                <div class="col-sm-2">
                  <router-link
                    class="btn btn-add btn-sm"
                    to="/customer/add"
                    title="Thêm"
                  >
                    <i class="fas fa-plus"></i> Tạo mới khách hàng
                  </router-link>
                </div>
              </div>
              <table
                class="table table-hover table-bordered js-copytextarea"
                cellpadding="0"
                cellspacing="0"
                border="0"
                id="customerTable"
              >
                <thead>
                  <tr>
                    <th width="10"><input type="checkbox" id="all" /></th>
                    <th>ID khách hàng</th>
                    <th width="150">Họ và tên</th>
                    <th width="300">Địa chỉ</th>
                    <th>Ngày sinh</th>
                    <th>Giới tính</th>
                    <th>SĐT</th>
                    <th>Ghi chú</th>
                    <th width="100">Tính năng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="customer in paginatedCustomers" :key="customer.id">
                    <td width="10">
                      <input type="checkbox" :value="customer.id" />
                    </td>
                    <td @click="goToEdit(customer.id)">{{ customer.id }}</td>
                    <td @click="goToEdit(customer.id)">{{ customer.name }}</td>
                    <td @click="goToEdit(customer.id)">
                      {{ customer.address }}
                    </td>
                    <td @click="goToEdit(customer.id)">
                      {{ customer.creation_date }}
                    </td>
                    <td @click="goToEdit(customer.id)">
                      {{ customer.gender }}
                    </td>
                    <td @click="goToEdit(customer.id)">{{ customer.phone }}</td>
                    <td @click="goToEdit(customer.id)">{{ customer.note }}</td>
                    <td class="table-td-center">
                      <button
                        class="btn btn-primary btn-sm trash"
                        type="button"
                        title="Xóa"
                        @click="confirmDelete(customer.id)"
                      >
                        <i class="fas fa-trash-alt"></i>
                        Xóa
                      </button>
                      <button
                        class="btn btn-primary btn-sm edit"
                        type="button"
                        title="Sửa"
                        @click="goToEdit(customer.id)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Phân trang -->
              <div class="pagination">
                <button
                  :disabled="currentPage === 1"
                  @click="changePage(currentPage - 1)"
                  class="btn btn-primary btn-sm"
                >
                  Trước
                </button>
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="changePage(page)"
                  :class="['btn', 'btn-sm', currentPage === page ? 'btn-primary' : 'btn-secondary']"
                >
                  {{ page }}
                </button>
                <button
                  :disabled="currentPage === totalPages"
                  @click="changePage(currentPage + 1)"
                  class="btn btn-primary btn-sm"
                >
                  Tiếp
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
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const customers = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5); // Số khách hàng trên mỗi trang
    const totalItems = ref(0);

    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/admin/customer/result/all`
        );
        customers.value = response.data;
        totalItems.value = customers.value.length; // Cập nhật tổng số khách hàng
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu khách hàng:", error);
      }
    };

    const paginatedCustomers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return customers.value.slice(start, end);
    });

    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

    const changePage = (page) => {
      currentPage.value = page;
    };

    const goToEdit = (id) => {
      window.location.href = `/customer/edit?id=${id}`;
    };

    const confirmDelete = (id) => {
      if (confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
        deleteCustomer(id);
      }
    };

    const deleteCustomer = async (id) => {
      try {
        const url = `http://localhost:8080/admin/customer/delete/${id}`;
        await axios.get(url);
        fetchCustomers(); // Refresh danh sách sau khi xóa
        alert("Khách hàng đã được xóa thành công.");
      } catch (error) {
        console.error("Có lỗi xảy ra khi xóa khách hàng:", error);
        alert("Xóa khách hàng thất bại. Vui lòng thử lại.");
      }
    };

    onMounted(() => {
      fetchCustomers();
    });

    return {
      paginatedCustomers,
      currentPage,
      totalPages,
      fetchCustomers,
      changePage,
      confirmDelete,
      goToEdit,
    };
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 0 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination button:hover {
  background-color: #007bff;
  color: #fff;
}

.pagination button:disabled {
  background-color: #ddd;
  color: #aaa;
  cursor: not-allowed;
}

.pagination .btn-primary {
  background-color: #007bff;
  color: #fff;
  border: none;
}

.pagination .btn-primary:hover {
  background-color: #0056b3;
}

.pagination .btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
}

.pagination .btn-secondary:hover {
  background-color: #e0e0e0;
}

</style>
