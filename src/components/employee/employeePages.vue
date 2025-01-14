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
            <a href="#"><b>Tạo mới nhân viên</b></a>
          </li>
        </ul>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Thông tin nhân viên</h3>
            <div class="tile-body">
              <form @submit.prevent="submitForm">
                <div class="row">
                  <div class="form-group col-md-4">
                    <label for="employeeId">ID nhân viên:</label>
                    <input
                        v-model="employee.id"
                        class="form-control"
                        type="text"
                        id="employeeId"
                        disabled
                    />
                  </div>
                  <div class="form-group col-md-4">
                    <label for="employeeName">Họ và tên:</label>
                    <input
                        v-model="employee.name"
                        class="form-control"
                        type="text"
                        id="employeeName"
                        required
                    />
                  </div>
                  <div class="form-group col-md-4">
                    <label for="employeePhone">Số điện thoại:</label>
                    <input
                        v-model="employee.phone"
                        class="form-control"
                        type="text"
                        id="employeePhone"
                        required
                    />
                  </div>
                  <div class="form-group col-md-4">
                    <label for="employeeNote">Ghi chú:</label>
                    <input
                        v-model="employee.note"
                        class="form-control"
                        type="text"
                        id="employeeNote"
                    />
                  </div>
                  <div class="form-group col-md-4">
                    <label for="employeeStatus">Trạng thái:</label>
                    <select
                        v-model="employee.status"
                        class="form-control"
                        id="employeeStatus"
                        required
                    >
                      <option value="true">Hoạt động</option>
                      <option value="false">Không hoạt động</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <button class="btn btn-primary" type="submit">Lưu lại</button>
                  <a class="btn btn-secondary" href="/doc/table-data-table.html"
                  >Hủy bỏ</a
                  >
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="col-md-12 mt-4">
          <div class="tile">
            <h3 class="tile-title">Danh sách nhân viên</h3>
            <div class="tile-body">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và tên</th>
                  <th>Số điện thoại</th>
                  <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="emp in employees" :key="emp.id">
                  <td>{{ emp.id }}</td>
                  <td>{{ emp.name }}</td>
                  <td>{{ emp.phone }}</td>
                  <td>
                    <button @click="setAccount(emp.id)" class="btn btn-delete">Cấp tài khoản</button>
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

<style scoped>
.app-title {
  margin-bottom: 20px;
}

.row .form-group {
  margin-bottom: 15px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      employee: {
        id: null,
        name: "",
        position: "",
        phone: "",
        note: "",
        status: true,
      },
      employees: [],
    };
  },
  methods: {
    async submitForm() {
      try {
        console.log("Bắt đầu gửi form...");
        console.log("Dữ liệu nhân viên:", this.employee);

        const token = Cookies.get("token");

        if (!token) {
          console.error("Token không tồn tại hoặc người dùng chưa đăng nhập.");
          alert("Chưa đăng nhập hoặc token không tồn tại!");
          return;
        }

        const api = "http://localhost:8080/admin/employee/save";

        const payload = {
          name: this.employee.name,
          position: this.employee.position,
          phone: this.employee.phone,
          note: this.employee.note,
          status: this.employee.status,
        };

        const response = await axios.post(api, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("Phản hồi từ API:", response.data);
        alert("Tạo nhân viên thành công!");
        this.fetchEmployees();
      } catch (error) {
        console.error("Lỗi khi gửi form:", error);

        if (error.response) {
          console.error("Chi tiết lỗi từ server:", error.response.data);
        }

        alert("Có lỗi xảy ra, vui lòng thử lại!");
      }
    },
    setAccount(id) {
      this.$router.push({
        name: 'EmployeeAccount',
        params: { id: id }
      });
    },
    async fetchEmployees() {
      try {
        const token = Cookies.get("token");

        if (!token) {
          console.error("Token không tồn tại hoặc người dùng chưa đăng nhập.");
          return;
        }

        const api = "http://localhost:8080/admin/employee/findall";
        const response = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        this.employees = response.data;
        console.log("Danh sách nhân viên:", this.employees);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
      }
    },
  },
  mounted() {
    this.fetchEmployees();
  },
};
</script>
