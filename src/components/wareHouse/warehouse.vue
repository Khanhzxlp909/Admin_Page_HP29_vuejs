<template>
  <div class="app sidebar-mini rtl">
    <main class="app-content">
      <div class="app-title">
        <ul class="app-breadcrumb breadcrumb">
          <li class="breadcrumb-item active">
            <a href="/"><b>Home/</b></a> <a href="#"><b>Danh sách đơn hàng</b></a>
          </li>
        </ul>
        <div id="clock">{{ currentTime }}</div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Tạo mới đơn hàng nhập kho</h3>
            <div class="tile-body">
              <form @submit.prevent="submitForm" class="row">
                <!-- Chọn nhà cung cấp -->
                <div class="form-group col-md-4">
                  <label class="control-label">Chọn nhà cung cấp</label>
                  <select class="form-control" v-model="order.supplierId" @change="setSupplierInfo">
                    <option v-for="supplier in suppiller" :key="supplier.id" :value="supplier.id">
                      {{ supplier.name }}
                    </option>
                  </select>
                </div>

                <!-- Nhân viên hiện tại -->
                <div class="form-group col-md-4">
                  <label class="control-label">Nhân viên hiện tại</label>
                  <input class="form-control" type="text" v-model="order.employeeName" readonly>
                </div>

                <!-- Ghi chú -->
                <div class="form-group col-md-4">
                  <label class="control-label">Ghi chú đơn hàng</label>
                  <textarea class="form-control" v-model="order.note" rows="4"></textarea>
                </div>

                <!-- Nút lưu -->
                <div class="tile-footer col-md-12">
                  <button class="btn btn-save" type="submit">Lưu lại</button>
                  <router-link class="btn btn-cancel" to="/orders">Hủy bỏ</router-link>
                </div>
              </form>
              <div class="row element-button">
                <div class="col-sm-2">
                  <button class="btn btn-add btn-sm" @click="navigateToAddSupplier" title="Thêm">
                    <i class="fas fa-plus"></i> Tạo mới nhà phân phối
                  </button>
                </div>

              </div>
            </div>
            <div class="du--lieu-san-pham">
              <table class="table table-hover table-bordered">
                <thead>
                <tr>
                  <th class="so--luong">ID</th>
                  <th class="so--luong">Tên nhà phân phối</th>
                  <th class="so--luong">Nhân viên</th>
                  <th class="so--luong">Ghi chú</th>
                  <th class="so--luong">Tổng giá</th>
                  <th class="so--luong">Ngày tạo</th>
                  <th class="so--luong">Mã kho</th>
                  <th class="so--luong">Nhập sản phẩm</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="warehouse.length === 0">
                  <td colspan="7">Không tìm thấy hàng nào.</td>
                </tr>
                <tr v-for="item in warehouse" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.supplier.name }}</td>
                  <td>{{ item.employee.name }}</td>
                  <td>{{ item.note }}</td>
                  <td>{{ formatPrice(item.total_Amount) }}</td>
                  <td>{{ item.creation_date }}</td>
                  <td>{{ item.code_Inventory }}</td>
                  <td>
                    <button class="btn btn-primary" @click="viewOrderDetails(item.id, item.supplier.id)">
                      Nhập sản phẩm
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
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      products: [],
      warehouse: [],
      suppiller: [],
      order: {
        supplierId: '',
        supplierName: '',
        supplierPhone: '',
        supplierAddress: '',
        productId: '',
        quantity: '',
        status: true,
        note: '',
        employeeName: ''
      },
      currentTime: new Date().toLocaleString()
    };
  },
  mounted() {
    this.fetchSuppiller() // Gọi hàm để lấy danh sách nhân viên khi component được mount
    // this.updateClock(); // Cập nhật đồng hồ
    this.fetchProducts(); // Cập nhật đồng hồ
    this.fetchWarehouse(); // Cập nhật đồng hồ
    this.order.employeeName = JSON.parse(Cookies.get("admin")).name
  },
  methods: {
    navigateToAddSupplier() {
      this.$router.push("/supplier");
    },
    formatPrice(price) {
      // Định dạng giá thành chuỗi
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
    },
    async viewOrderDetails(id, supplierId) {
      console.log(id, supplierId);
      // this.$router.push(`/warehouse/warehouseDetails?id=${id}&supplierId=${supplierId}`);
      this.$router.push({
        path: '/warehouse/warehouseDetails',
        query: {id, supplierId}
      });
    },
    async fetchProducts() {
      try {
        const response = await axios.get(`http://localhost:8080/admin/variation/result/all`);
        this.products = response.data.content; // Lấy danh sách sản phẩm
        console.log("Dữ liệu sản phẩm:", this.products);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm:", error);
      }
    },

    async fetchWarehouse() {
      try {
        const response = await axios.get(`http://localhost:8080/admin/warehouse/findall`);
        this.warehouse = response.data; // Lấy danh sách sản phẩm
        console.log("Dữ liệu kho:", this.warehouse);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu kho:", error);
      }
    },
    async submitForm() {
      const token = Cookies.get("token");
      console.log("token abc: ", token);
      const apiUrl = "http://localhost:8080/admin/warehouse/save"
      const method = 'post';
      const employee = JSON.parse(Cookies.get("admin"));
      const payload = {
        supplier: {
          id: this.order.supplierId,
        },
        status: this.order.status,
        note: this.order.note,
        edit_Date: this.order.creationDate,
        creation_date: this.order.creationDate,
        employee: {
          id: employee.ID
        },
      };
      console.log(payload)
      try {
        const response = await axios({
          method,
          url: apiUrl,
          data: payload,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        // console.log(response.data));
        alert('Đơn hàng đã được lưu thành công!');
        // this.$router.push('/orders');
        this.fetchWarehouse()
      } catch (error) {
        console.error("Lỗi khi lưu đơn hàng:", error);
        alert("Đã xảy ra lỗi khi lưu đơn hàng!");
      }
    },
    async fetchSuppiller() {
      try {
        const response = await axios.get('http://localhost:8080/admin/warehouse/suppiller/get'); // Đường dẫn API để lấy danh sách nhân viên
        this.suppiller = response.data; // Lưu danh sách nhân viên

      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy danh sách nhân viên:", error);
      }
    },
    updateClock() {
      setInterval(() => {
        this.currentTime = new Date().toLocaleString(); // Cập nhật thời gian hiện tại
      }, 1000);

    }
  }
};
</script>

<style scoped>
/* Thêm các kiểu CSS tùy chỉnh nếu cần */
</style>