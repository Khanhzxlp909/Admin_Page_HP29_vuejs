<template>
  <div id="app" class="app sidebar-mini rtl">
    <main class="app-content">
      <div class="app-title">
        <ul class="app-breadcrumb breadcrumb side">
          <li class="breadcrumb-item active">
            <a href="/"><b>Home/</b></a> <a href="#"><b>Danh sách sản phẩm</b></a>
          </li>
        </ul>
        <div id="clock">{{ currentTime }}</div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="tile-body">
            <div class="row element-button">
              <div class="col-sm-2">
                <router-link class="btn btn-add btn-sm" to="/order" title="Thêm">
                  <i class="fas fa-plus"></i> Tạo mới đơn hàng
                </router-link>
              </div>
              <div class="col-sm-2">
                <button class="btn btn-delete btn-sm nhap-tu-file" type="button" title="Nhập" @click="importFromFile">
                  <i class="fas fa-file-upload"></i> Tải từ file
                </button>
              </div>
              <div class="col-sm-2">
                <button class="btn btn-delete btn-sm print-file" type="button" title="In" @click="printTable">
                  <i class="fas fa-print"></i> In dữ liệu
                </button>
              </div>
              <div class="col-sm-2">
                <button class="btn btn-delete btn-sm print-file js-textareacopybtn" type="button" title="Sao chép"
                        @click="copyData">
                  <i class="fas fa-copy"></i> Sao chép
                </button>
              </div>
              <div class="col-sm-2">
                <a class="btn btn-excel btn-sm" href="#" title="Xuất Excel">
                  <i class="fas fa-file-excel"></i> Xuất Excel
                </a>
              </div>
              <div class="col-sm-2">
                <button class="btn btn-delete btn-sm pdf-file" type="button" title="Xuất PDF" @click="exportToPDF">
                  <i class="fas fa-file-pdf"></i> Xuất PDF
                </button>
              </div>
              <div class="col-sm-2">
                <button class="btn btn-delete btn-sm" type="button" title="Xóa" @click="deleteAll">
                  <i class="fas fa-trash-alt"></i> Xóa tất cả
                </button>
              </div>
            </div>
            <table class="table table-hover table-bordered" id="sampleTable">
              <thead>
              <tr>
                <th>ID đơn hàng</th>
                <th>Khách hàng</th>
                <th>Code voucher</th>
                <th>Phương thức thanh toán</th>
                <th>Ghi chú</th>
                <th>Tổng tiền</th>
                <th>Tình trạng</th>
                <th>Tính năng</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in orders" :key="item.id" @click="viewOrderDetails(item.id)">
                <td>{{ item.id }}</td>
                <td>{{ item.customerID.name }}</td>
                <td>{{ item.code_Voucher }}</td>
                <td>{{ item.paymentMethod.note }}</td>
                <td>{{ item.note }}</td>
                <td>{{ formatPrice(item.total_Payment) }}</td>
                <td>
                  <span :class="{
                      'badge bg-danger': item.status === 0,
                      'badge bg-warning': item.status === 1,
                      'badge bg-success': item.status === 2
                    }">
                    {{ item.status === 0 ? "Đã Hủy" : item.status === 1 ? "Đang chờ xác nhận" : "Đã xác nhận" }}
                  </span>

                </td>
                <td>
                  <button class="btn btn-primary btn-sm trash" type="button" title="Huỷ đơn hàng"
                          @click="confirmDelete(item.id)">
                    <i class="fas fa-trash-alt"></i> Huỷ đơn hàng
                  </button>
                  <h1></h1>
                  <button class="btn btn-primary btn-sm edit" type="button" title="Sửa đơn hàng"
                  >
                    <i class="fa fa-edit"></i> Sửa đơn hàng
                  </button>
                  <h1></h1>
                  <button class="btn btn-success btn-sm edit" type="button" title="Sửa đơn hàng"
                          @click="succressOrder(item.id)">
                    <i class="fa fa-edit"></i> Xác nhận đơn hàng
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="alert">
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
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết đơn hàng</h5>
            <button style="color: black" type="button" class="close" @click="showModal = false">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="du--lieu-san-pham">

              <table class="table table-hover table-bordered">
                <thead>
                <tr>
                  <th class="so--luong">Mã hàng</th>
                  <th class="so--luong">Tên sản phẩm</th>
                  <th class="so--luong" width="10">Ảnh</th>
                  <th class="so--luong">Số lượng</th>
                  <th class="so--luong">Giá bán</th>
                  <th class="so--luong text-center">Chủng loại</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="orderDetails.length === 0">
                  <td colspan="7">Không tìm thấy sản phẩm nào.</td>
                </tr>
                <tr v-for="orderDetails in orderDetails" :key="orderDetails">
                  <td>{{ orderDetails.variationID.sku }}</td>
                  <td>{{ orderDetails.variationName }}</td>
                  <td>
                    <!--                    <img :src="getDefaultImageUrl(product.productID.imagesDTOS)" alt="" width="70px"/>-->
                  </td>
                  <td>{{ orderDetails.quantity }}</td>
                  <td>{{ formatPrice(orderDetails.unit_Price) }}</td>
                  <td>{{ formatPrice(orderDetails.price) }}</td>
                  <!--                  <td>{{ product.productID.categoryID.name }}</td>-->
                </tr>
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="closebtn" @click="showModal = false">Đóng</button>
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
      orders: [],
      selectedOrders: [],
      currentPage: 0, // Số trang hiện tại
      pageSize: 15, // Số sản phẩm mỗi trang
      showModal: false, // Biến để hiển thị modal
      orderDetails: null, // Cần thêm nếu chưa có
    };
  },
  mounted() {
    this.fetchProducts(this.currentPage, this.pageSize); // Gọi hàm để lấy tất cả sản phẩm khi component được mount
    // Gọi hàm để lấy tất cả khách hàng khi component được mount
  },
  methods: {
    async viewOrderDetails(orderId) {
      const token = Cookies.get("authToken");
      console.log("token", token);
      console.log(orderId);

      try {
        const response = await axios.get(`http://localhost:8080/admin/orders/history/getprd/${orderId}`);
        console.log("Chi tiết đơn hàng:", response.data); // Kiểm tra dữ liệu trả về
        this.orderDetails = response.data;
        this.showModal = true;
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      }
    },
    parsePrice(priceString) {
      // Chuyển đổi giá từ chuỗi sang số
      return parseFloat(priceString.replace(/\./g, '').replace(' ₫', ''));
    },
    formatPrice(price) {
      // Định dạng giá thành chuỗi
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
    },
    async fetchProducts(page, size) {
      try {
        const response = await axios.get(`http://localhost:8080/admin/orders/findall?page=${page}&size=${size}`);
        this.orders = response.data.content; // Lấy danh sách order
        this.totalPages = response.data.page.totalPages;
        console.log("Dữ liệu:", this.orders);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    },
    changePage(page) {
      if (page < 0 || page >= this.totalPages) return; // Kiểm tra giới hạn trang
      this.currentPage = page;
      this.fetchProducts(this.currentPage, this.pageSize); // Tải dữ liệu trang mới
    },
    importFromFile() {
      // Logic to import orders from a file
    },
    printTable() {
      const tab = document.getElementById('sampleTable');
      const win = window.open('', '', 'height=700,width=700');
      win.document.write(tab.outerHTML);
      win.document.close();
      win.print();
    },
    copyData() {
      // Logic to copy data
    },
    exportToPDF() {
      // Logic to export to PDF
    },
    deleteAll() {
      // Logic to delete all selected orders
    },
    async confirmDelete(orderId) {
      console.log(orderId);
      const token = Cookies.get("token"); // Lấy token từ cookies
      const apiCancel = `http://localhost:8080/admin/orders/cancelOrder/${orderId}`; // Đường dẫn API để hủy đơn hàng

      try {
        const response = await axios.get(apiCancel, {
          headers: {
            Authorization: `Bearer ${token}` // Thêm token vào header
          }
        });

        if (response.status === 200) {
          alert("Đơn hàng đã được hủy thành công!");
          // Cập nhật lại danh sách đơn hàng
          this.fetchProducts(this.currentPage, this.pageSize);
        } else {
          alert("Không thể hủy đơn hàng. Vui lòng thử lại!");
        }
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        alert("Có lỗi xảy ra khi hủy đơn hàng.");
      }
    },
    async succressOrder(orderId) {
      // Logic to edit a specific order
      console.log(orderId);
      const token = Cookies.get("authToken"); // Lấy token từ cookies
      const apiCancel = `http://localhost:8080/admin/orders/sucressorder/${orderId}`; // Đường dẫn API để hủy đơn hàng

      try {
        const response = await axios.get(apiCancel);

        if (response.status === 200) {
          alert("Đơn hàng đã được xác nhận thành công!");
          // Cập nhật lại danh sách đơn hàng
          this.fetchProducts(this.currentPage, this.pageSize);
        } else {
          alert("Không thể xác nhận đơn hàng. Vui lòng thử lại!");
        }
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        alert("Có lỗi xảy ra khi hủy đơn hàng.");
      }
    },
    toggleAllCheckboxes(event) {
      const isChecked = event.target.checked;
      this.selectedOrders = isChecked ? this.orders.map(order => order.id) : [];
    }
  },
  filters: {
    currency(value) {
      return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(value);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-header {
  background: white;
  color: black;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 1000px;
  max-height: 80%;
  overflow-y: auto;
}

.close {
  background: black;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.close:hover {
  background: red;
}

.closebtn {
  background: black;
  border: 1px;
  font-size: 18px;
  cursor: pointer;
}

.closebtn:hover {
  background: red;
}

</style>