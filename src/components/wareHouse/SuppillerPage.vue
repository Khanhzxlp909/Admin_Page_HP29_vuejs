<template>
  <div id="app" class="app sidebar-mini rtl">
    <header class="app-header">
      <a class="app-sidebar__toggle" href="#" data-toggle="sidebar" aria-label="Hide Sidebar"></a>
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
            <a href="#"><b>Danh sách danh mục</b></a>
          </li>
        </ul>
        <div id="clock">{{ currentTime }}</div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-body">

              <!-- Form Nhà phân phối -->
              <form @submit.prevent="isEditing ? updateSupplier() : addSupplier()" class="form">
                <div class="form-group">
                  <label for="name">Tên Nhà phân phối:</label>
                  <input v-model="form.name" type="text" id="name" class="form-control" placeholder="Nhập tên..."
                         required/>
                  <span class="error" v-if="errors.name">{{ errors.name }}</span>
                </div>

                <div class="form-group">
                  <label for="phone">Số điện thoại:</label>
                  <input v-model="form.phone" type="text" id="phone" class="form-control"
                         placeholder="Nhập số điện thoại..." required/>
                  <span class="error" v-if="errors.phone">{{ errors.phone }}</span>
                </div>

                <div class="form-group">
                  <label for="address">Địa chỉ:</label>
                  <input v-model="form.address" type="text" id="address" class="form-control"
                         placeholder="Nhập địa chỉ..." required/>
                  <span class="error" v-if="errors.address">{{ errors.address }}</span>
                </div>

                <div class="form-group">
                  <label for="status">Tình trạng:</label>
                  <select v-model="form.status" id="status" class="form-control">
                    <option :value="true">Đang hoạt động</option>
                    <option :value="false">Ngừng hoạt động</option>
                  </select>
                </div>

                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? "Cập nhật Nhà phân phối" : "Thêm Nhà phân phối" }}
                </button>
                <button type="button" class="btn btn-secondary ml-2" @click="resetForm">Hủy</button>
              </form>

              <!-- Danh sách Nhà phân phối -->
              <table class="table">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Tình trạng</th>
                  <th>Chức năng</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in suppliers" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.phone }}</td>
                  <td>{{ item.address }}</td>
                  <td>
            <span :class="{'badge bg-success': item.status, 'badge bg-danger': !item.status}">
              {{ item.status ? "Đang hoạt động" : "Ngừng hoạt động" }}
            </span>
                  </td>
                  <td>
                    <button class="btn btn-warning btn-sm" @click="editSupplier(item)">Sửa</button>
                    <button class="btn btn-danger btn-sm" @click="confirmDelete(item)">Xóa</button>
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
import {ref, reactive, onMounted} from "vue";
import axios from "axios";

export default {
  setup() {
    const suppliers = ref([]);
    const isEditing = ref(false);
    const form = reactive({
      id: null,
      name: "",
      phone: "",
      address: "",
      status: true
    });

    const errors = reactive({
      name: null,
      phone: null,
      address: null
    });

    // Lấy danh sách Nhà phân phối
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/warehouse/suppiller/findall'); // Đường dẫn API để lấy danh sách nhân viên
        suppliers.value = response.data;
      } catch (error) {
        console.error("Lỗi khi tải Nhà phân phối:", error);
      }
    };

    // Kiểm tra dữ liệu hợp lệ
    const validateForm = () => {
      let valid = true;

      if (!form.name.trim()) {
        errors.name = "Tên không được để trống hoặc chỉ có khoảng trắng.";
        valid = false;
      } else {
        errors.name = null;
      }

      if (!form.phone.match(/^\d{10}$/)) {
        errors.phone = "Số điện thoại phải có 10 chữ số.";
        valid = false;
      } else {
        errors.phone = null;
      }

      if (!form.address.trim()) {
        errors.address = "Địa chỉ không được để trống hoặc chỉ có khoảng trắng.";
        valid = false;
      } else {
        errors.address = null;
      }

      return valid;
    };

    // Thêm Nhà phân phối
    const addSupplier = async () => {
      if (!validateForm()) return;
      try {
        await axios.post("http://localhost:8080/admin/warehouse/suppiller/save", form);
        alert("Thêm Nhà phân phối thành công!");
        fetchSuppliers();
        resetForm();
      } catch (error) {
        console.error("Lỗi khi thêm Nhà phân phối:", error);
      }
    };

    // Sửa Nhà phân phối
    const editSupplier = (supplier) => {
      Object.assign(form, supplier);
      isEditing.value = true;
    };

    // Cập nhật Nhà phân phối
    const updateSupplier = async () => {
      if (!validateForm()) return;
      try {
        await axios.post("http://localhost:8080/admin/warehouse/suppiller/update", form);
        alert("Cập nhật Nhà phân phối thành công!");
        fetchSuppliers();
        resetForm();
      } catch (error) {
        console.error("Lỗi khi cập nhật Nhà phân phối:", error);
      }
    };

    // Xóa Nhà phân phối
    const confirmDelete = (supplier) => {
      if (confirm(`Bạn có chắc chắn muốn xóa Nhà phân phối "${supplier.name}"?`)) {
        deleteSupplier(supplier.id);
      }
    };

    const deleteSupplier = async (id) => {
      try {
        await axios.get(`http://localhost:8080/admin/warehouse/suppiller/delete/${id}`);
        alert("Xóa Nhà phân phối thành công!");
        fetchSuppliers();
      } catch (error) {
        console.error("Lỗi khi xóa Nhà phân phối:", error);
      }
    };

    // Reset form
    const resetForm = () => {
      form.id = null;
      form.name = "";
      form.phone = "";
      form.address = "";
      form.status = true;
      isEditing.value = false;
    };

    onMounted(fetchSuppliers);

    return {
      suppliers,
      form,
      errors,
      isEditing,
      addSupplier,
      updateSupplier,
      editSupplier,
      confirmDelete,
      resetForm
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}

.form-group {
  margin-bottom: 10px;
}

.error {
  color: red;
  font-size: 12px;
}

.table {
  width: 100%;
  margin-top: 20px;
}

.badge {
  padding: 5px;
  border-radius: 5px;
}

.bg-success {
  background-color: green;
  color: white;
}

.bg-danger {
  background-color: red;
  color: white;
}
</style>
