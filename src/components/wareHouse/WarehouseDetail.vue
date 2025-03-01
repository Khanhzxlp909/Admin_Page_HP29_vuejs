<template>
  <div class="app sidebar-mini rtl">
    <!-- Navbar -->
    <header class="app-header">
      <ul class="app-nav">
        <li>
          <a class="app-nav__item" href="/order">
            <i class='bx bx-log-out bx-rotate-180'></i>
          </a>
        </li>
      </ul>
    </header>

    <main class="app app-ban-hang">
      <div class="row">
        <div class="col-md-12">
          <div class="app-title">
            <ul class="app-breadcrumb breadcrumb">
              <li class="breadcrumb-item"><a href="#"><b>Kho hàng</b></a></li>
            </ul>
            <div id="clock"></div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
          <div class="tile">
            <h3 class="tile-title">Phần mềm nhập kho</h3>
            <input type="text" id="myInput" ref="myInput" @input="myFunction"
                   placeholder="Nhập mã sản phẩm hoặc tên sản phẩm để tìm kiếm...">
            <div class="du--lieu-san-pham">
              <table class="table table-hover table-bordered">
                <thead>
                <tr>
                  <th class="so--luong">Mã hàng</th>
                  <th class="so--luong">Tên sản phẩm</th>
                  <th class="so--luong" width="10">Ảnh</th>
                  <th class="so--luong">Số lượng</th>
                  <th class="so--luong">Trạng thái</th>
                  <th class="so--luong">Giá bán</th>
                  <th class="so--luong text-center">Chủng loại</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="products.length === 0">
                  <td colspan="7">Không tìm thấy sản phẩm nào.</td>
                </tr>
                <tr v-for="product in products" :key="product.id" @click="addToCart(product)">
                  <td>{{ product.sku }}</td>
                  <td>{{ product.productID.name }}</td>
                  <td>
                    <img :src="getDefaultImageUrl(product.productID.imagesDTOS)" alt="" width="70px"/>
                  </td>
                  <td>{{ product.quantity }}</td>
                  <td>
                    <span :class="{'badge bg-success': product.status, 'badge bg-danger': !product.status}">
                      {{ product.status ? "Còn hàng" : "Hết hàng" }}
                    </span>
                  </td>
                  <td>{{ product.price }}</td>
                  <td>{{ product.productID.categoryID.name }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="alert">
              <div class="pagination">
                <!-- Nút Trang đầu -->
                <button
                    class="page-button"
                    :disabled="currentPage === 0"
                    @click="changePage(0)"
                >
                  First
                </button>

                <!-- Nút Previous -->
                <button
                    class="page-button"
                    :disabled="currentPage === 0"
                    @click="changePage(currentPage - 1)"
                >
                  Previous
                </button>

                <!-- Trang hiện tại và tổng số trang -->
                <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>

                <!-- Nút Next -->
                <button
                    class="page-button"
                    :disabled="currentPage >= totalPages - 1"
                    @click="changePage(currentPage + 1)"
                >
                  Next
                </button>
                <!-- Nút Trang cuối -->
                <button
                    class="page-button"
                    :disabled="currentPage >= totalPages - 1"
                    @click="changePage(totalPages - 1)"
                >
                  Last
                </button>
              </div>

            </div>
            <div class="tile mt-3">
              <h3 class="tile-title">Giỏ hàng</h3>
              <table class="table table-hover table-bordered">
                <thead>
                <tr>
                  <th>Mã hàng</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Giá bán</th>
                  <th>Tổng</th>
                  <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in cart" :key="item.id">
                  <td>{{ item.sku }}</td>
                  <td>{{ item.productID.name }}</td>
                  <td>
                    <div class="quantity-control">
                      <button @click="decreaseQuantity(item)">-</button>
                      <input class="" type="number" v-model="item.quantity" min="1"/>
                      <button @click="increaseQuantity(item)">+</button>
                    </div>
                  </td>
                  <td>{{ item.price }}</td>
                  <td>{{ formatPrice(item.quantity * parsePrice(item.price)) }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="removeFromCart(item)">Xóa</button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="tile">
            <h3 class="tile-title">Thông tin thanh toán</h3>
            <div class="row">
              <div class="form-group col-md-10">
                <label class="control-label">Nhà cung cấp</label>
                <select class="form-control">
                  <option disabled value="">Chọn nhà cung cấp</option>
                  <option v-for="supplier in customers" :key="supplier.id" :value="supplier.id">
                    {{ supplier.name }}
                  </option>
                </select>
              </div>
              <div class="form-group col-md-12">
                <label class="control-label">Nhân viên</label>
                <textarea class="form-control" rows="4" placeholder="Ghi chú thêm đơn hàng"
                          disabled>{{ warehouse.employee ? warehouse.employee.name : 'Chưa có nhân viên' }}</textarea>

              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-12">
                <label class="control-label">Ghi chú đơn hàng</label>
                <textarea class="form-control" rows="4" placeholder="Ghi chú thêm đơn hàng"
                >{{warehouse.note}}</textarea>
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Tạm tính tiền hàng: </label>
                <p class="control-all-money-tamtinh">= {{ formatPrice(totalAmount) }} VNĐ</p>
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Tổng cộng thanh toán: </label>
                <p class="control-all-money-total">= {{ formatPrice(finalAmount) }} VNĐ</p>
              </div>

              <div class="form-group col-md-6">
                <label class="control-label">Khách hàng còn nợ: </label>
                <p class="control-all-money"> {{ formatPrice(changeDue) }} VNĐ</p>
              </div>

              <div class="tile-footer col-md-12">
                <button class="btn btn-primary luu-san-pham" type="button" @click="saveWareHouseDetail">Lưu đơn hàng
                  (F9)
                </button>
                <button class="btn btn-primary luu-va-in" type="button" @click="saveAndPrint">Lưu và in hóa đơn (F10)
                </button>
                <a class="btn btn-secondary luu-va-in" href="/">Quay về</a>
              </div>
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
      customers: [],
      cart: [],
      warehouse: [],
      selectedEmployee: '',
      currentPage: 0, // Số trang hiện tại
      pageSize: 4, // Số sản phẩm mỗi trang
      orderNote: '',
      codevoucher: '',
      status: '',
      paymentMethod: '',
      discount: 0,
      amountReceived: 0,
      newCustomer: {
        name: '',
        address: '',
        email: '',
        birthDate: '',
        phone: ''
      }
    };
  },
  computed: {
    totalAmount() {
      return this.cart.reduce((total, item) => {
        const price = this.parsePrice(item.price); // Chuyển đổi giá thành số
        return total + (price * item.quantity); // Tính tổng giá
      }, 0);
    },
    finalAmount() {
      return this.totalAmount - this.discount;
    },
    changeDue() {
      return this.amountReceived - this.finalAmount;
    }
  },
  mounted() {
    this.fetechWarehouse();
    this.fetchProducts(this.currentPage, this.pageSize); // Gọi hàm để lấy tất cả sản phẩm khi component được mount
    this.getsuppiller(); // Gọi hàm để lấy tất cả khách hàng khi component được mount
  },
  methods: {
    async fetechWarehouse() {
      const id = this.$route.query.id;
      console.log(id);
      try {
        const resp = await axios.get(`http://localhost:8080/admin/warehouse/result/` + id);
        if (resp.data) {
          this.warehouse = resp.data;
          console.log("Dữ liệu kho:", this.warehouse);
        } else {
          console.error("Dữ liệu kho không có hoặc trống");
        }
      } catch (error) {
        console.error("Lỗi khi fetch warehouse:", error);
      }
    },

    selectid(id) {
      console.log("Biến thể: " + id);
    },
    async myFunction() {
      const searchKeyword = this.$refs.myInput.value; // Lấy giá trị từ ô tìm kiếm
      console.log(searchKeyword);
      try {
        const response = await axios.get(`http://localhost:8080/MiniatureCrafts/result/${searchKeyword}`);
        this.products = [...response.data.content];
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    },
    async fetchProducts(page, size) {
      try {
        const supplierId = this.$route.query.supplierId;
        const response = await axios.get(`http://localhost:8080/admin/variation/warehouse/supiller/${supplierId}?page=${page}&size=${size}`);
        this.products = response.data.content; // Lấy danh sách sản phẩm
        this.totalPages = response.data.page.totalPages; // Tổng số trang
        console.log("Dữ liệu sản phẩm:", this.products);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm:", error);
      }
    },
    async getsuppiller() {
      try {
        const response = await axios.get(`http://localhost:8080/admin/warehouse/suppiller/get`);
        console.log(response.data);
        this.customers = response.data;
      } catch (error) {
        // Xử lý lỗi chi tiết
        if (error.response) {
          // Nếu lỗi từ server
          console.error("Lỗi từ server:", error.response.status, error.response.data);
        } else if (error.request) {
          // Nếu không nhận được phản hồi từ server
          console.error("Không nhận được phản hồi từ server:", error.request);
        } else {
          // Lỗi khác
          console.error("Có lỗi xảy ra:", error.message);
        }
      }
    },
    async getVoucher() {
      const voucherCode = this.$refs.voucher.value; // Lấy mã voucher từ input
      if (!voucherCode) {
        this.discount = 0; // Nếu không có mã voucher, đặt discount về 0
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/admin/orders/resultvoucher/${voucherCode}`);
        if (response.data && response.data.discountValue) {
          this.discount = response.data.discountValue; // Cập nhật giá trị giảm giá
          // alert(`Giảm giá thành công: ${this.discount} VNĐ`);
        } else {
          this.discount = 0; // Nếu không có discountValue, đặt discount về 0
          alert("Mã voucher không hợp lệ.");
        }
        this.calculateTotal(); // Gọi hàm tính toán tổng sau khi cập nhật discount
      } catch (error) {
        console.error("Lỗi khi kiểm tra voucher:", error);
        alert("Có lỗi xảy ra khi kiểm tra mã voucher.");
      }
    },
    increaseQuantity(item) {
      item.quantity += 1;
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeFromCart(item) {
      this.cart = this.cart.filter(product => product.id !== item.id);
    },
    addToCart(product) {
      const existingProduct = this.cart.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;  // Tăng số lượng nếu sản phẩm đã có
      } else {
        this.cart.push({...product, quantity: 1});  // Thêm mới nếu chưa có
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
    changePage(page) {
      if (page < 0 || page >= this.totalPages) return; // Kiểm tra giới hạn trang
      this.currentPage = page;
      this.fetchProducts(this.currentPage, this.pageSize); // Tải dữ liệu trang mới
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
    async saveWareHouseDetail() {
      const idWarehouse = this.$route.query.id; // Lấy ID kho từ query params
      if (this.cart.length === 0) {
        alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi lưu.");
        return;
      }

      // Tạo danh sách sản phẩm từ giỏ hàng
      const orderData = this.cart.map(item => ({
        status: true,
        note: "abc", // Có thể thay đổi theo logic của bạn
        variation: {
          id: item.id // ID của biến thể sản phẩm
        },
        quantity: item.quantity, // Lấy số lượng của từng sản phẩm thay vì tổng số lượng
        total_Amount: (this.parsePrice(item.price) * item.quantity).toFixed(2), // Tổng tiền của từng sản phẩm
        price: this.parsePrice(item.price).toFixed(2), // Giá của sản phẩm
        import: idWarehouse // ID nhập kho
      }));

      console.log(orderData);

      // Lấy token từ cookies
      try {
        const token = Cookies.get("token");
        const response = await axios.post(`http://localhost:8080/admin/warehouse/${idWarehouse}/add/whdt`, orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.status === 200) {
          // Reset giỏ hàng hoặc thực hiện các hành động khác nếu cần
          this.fetchProducts(this.currentPage, this.pageSize);
          this.cart = [];
          this.orderNote = '';
          this.codevoucher = '';
          alert("Chi tiết kho đã được lưu thành công!");
        } else {
          alert("Không thể lưu chi tiết kho. Vui lòng thử lại!");
        }
      } catch (error) {
        console.error("Lỗi khi lưu chi tiết kho:", error);
        alert("Đã xảy ra lỗi khi lưu chi tiết kho!");
      }
    },

    saveAndPrint() {
      // Implement save and print functionality
    },
    saveCustomer() {
      // Implement save customer functionality
    },
    calculateChange() {
      // Implement change calculation
    },
    calculateTotal() {
      // Implement discount calculation if needed
    }
  }
};
</script>

<style>/* Styling for quantity input and buttons */
input[type="number"] {
  width: 60px;
  padding: 5px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  margin: 0 5px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="number"]:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #004085;
  transform: scale(0.95);
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:focus {
  outline: none;
}

.quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-control button {
  width: 30px;
  height: 30px;
}

.quantity-control input {
  margin: 0 5px;
}
</style>