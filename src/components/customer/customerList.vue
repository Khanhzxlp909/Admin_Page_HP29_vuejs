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
                  <a
                    class="btn btn-add btn-sm"
                    href="form-add-customer.html"
                    title="Thêm"
                    ><i class="fas fa-plus"></i> Tạo mới khách hàng</a
                  >
                </div>
                <div class="col-sm-2">
                  <a
                    class="btn btn-delete btn-sm nhap-tu-file"
                    type="button"
                    title="Nhập"
                    @click="importFromFile"
                    ><i class="fas fa-file-upload"></i> Tải từ file</a
                  >
                </div>
                <div class="col-sm-2">
                  <a
                    class="btn btn-delete btn-sm print-file"
                    type="button"
                    title="In"
                    @click="printTable"
                    ><i class="fas fa-print"></i> In dữ liệu</a
                  >
                </div>
                <div class="col-sm-2">
                  <a
                    class="btn btn-delete btn-sm print-file js-textareacopybtn"
                    type="button"
                    title="Sao chép"
                    @click="copyToClipboard"
                    ><i class="fas fa-copy"></i> Sao chép</a
                  >
                </div>
                <div class="col-sm-2">
                  <a class="btn btn-excel btn-sm" href="" title="In"
                    ><i class="fas fa-file-excel"></i> Xuất Excel</a
                  >
                </div>
                <div class="col-sm-2">
                  <a
                    class="btn btn-delete btn-sm pdf-file"
                    type="button"
                    title="In"
                    @click="exportToPDF"
                    ><i class="fas fa-file-pdf"></i> Xuất PDF</a
                  >
                </div>
                <div class="col-sm-2">
                  <a
                    class="btn btn-delete btn-sm"
                    type="button"
                    title="Xóa"
                    @click="deleteAll"
                    ><i class="fas fa-trash-alt"></i> Xóa tất cả
                  </a>
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
                  <tr v-for="customer in customers" :key="customer.id">
                    <td width="10">
                      <input type="checkbox" :value="customer.id" />
                    </td>
                    <td>{{ customer.id }}</td>
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.address }}</td>
                    <td>{{ customer.creation_date }}</td>
                    <td>{{ customer.gender }}</td>
                    <td>{{ customer.phone }}</td>
                    <td>{{ customer.note }}</td>
                    <td class="table-td-center">
                      <button
                        class="btn btn-primary btn-sm trash"
                        type="button"
                        title="Xóa"
                        @click="confirmDelete(customer.id)"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                      <button
                        class="btn btn-primary btn-sm edit"
                        type="button"
                        title="Sửa"
                        @click="editCustomer(customer)"
                      >
                        <i class="fas fa-edit"></i>
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

    <!-- Modal for editing customer -->
    <div
      class="modal fade"
      id="ModalUP"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      data-backdrop="static"
      data-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div class="row">
              <div class="form-group col-md-12">
                <span class="thong-tin-thanh-toan">
                  <h5>Chỉnh sửa thông tin khách hàng cơ bản</h5>
                </span>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label class="control-label">ID khách hàng</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="selectedCustomer.id"
                  disabled
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Họ và tên</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="selectedCustomer.name"
                  required
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Số điện thoại</label>
                <input
                  class="form-control"
                  type="number"
                  v-model="selectedCustomer.phone"
                  required
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Địa chỉ</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="selectedCustomer.address"
                  required
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Ngày sinh</label>
                <input
                  class="form-control"
                  type="date"
                  v-model="selectedCustomer.creation_date"
                />
              </div>
              <div class="form-group col-md-6">
                <label for="genderSelect" class="control-label"
                  >Giới tính</label
                >
                <select
                  class="form-control"
                  v-model="selectedCustomer.gender"
                  id="genderSelect"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div class="form-group col-md-12">
                <label class="control-label">Ghi chú</label>
                <textarea
                  class="form-control"
                  v-model="selectedCustomer.note"
                ></textarea>
              </div>
            </div>
            <button class="btn btn-save" type="button" @click="saveCustomer">
              Lưu lại
            </button>
            <a class="btn btn-cancel" data-dismiss="modal" href="#">Hủy bỏ</a>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for editing customer -->
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const customers = ref([]);
    const selectedCustomer = ref({
      id: "",
      name: "",
      address: "",
      phone: "",
      creation_date: "",
      gender: "Nam",
      note: "",
    });

    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/admin/customer/result/all"
        );
        customers.value = response.data; // Giả sử API trả về danh sách khách hàng
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu khách hàng:", error);
      }
    };

    const editCustomer = (customer) => {
      selectedCustomer.value = { ...customer }; // Sao chép thông tin khách hàng vào modal
      $("#ModalUP").modal("show"); // Hiện modal
    };

    const saveCustomer = async () => {
      try {
        await axios.put(
          `http://localhost:8080/admin/customer/${selectedCustomer.value.id}`,
          selectedCustomer.value
        );
        fetchCustomers(); // Cập nhật danh sách khách hàng sau khi lưu
        $("#ModalUP").modal("hide"); // Ẩn modal
      } catch (error) {
        console.error("Có lỗi xảy ra khi lưu thông tin khách hàng:", error);
      }
    };

    const confirmDelete = (id) => {
      if (confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
        deleteCustomer(id);
      }
    };

    const deleteCustomer = async (id) => {
      try {
        await axios.delete(`http://localhost:8080/admin/customer/${id}`);
        fetchCustomers(); // Cập nhật danh sách khách hàng sau khi xóa
      } catch (error) {
        console.error("Có lỗi xảy ra khi xóa khách hàng:", error);
      }
    };

    const importFromFile = () => {
      // Logic để nhập từ file
    };

    const printTable = () => {
      // Logic để in bảng
    };

    const copyToClipboard = () => {
      // Logic để sao chép
    };

    const exportToPDF = () => {
      // Logic để xuất PDF
    };

    const deleteAll = () => {
      // Logic để xóa tất cả
    };

    onMounted(() => {
      fetchCustomers(); // Lấy danh sách khách hàng khi component được gắn
    });

    return {
      customers,
      selectedCustomer,
      fetchCustomers,
      editCustomer,
      saveCustomer,
      confirmDelete,
      deleteCustomer,
      importFromFile,
      printTable,
      copyToClipboard,
      exportToPDF,
      deleteAll,
    };
  },
};
</script>

<style scoped>
/* Thêm các kiểu CSS tùy chỉnh ở đây */
</style>
