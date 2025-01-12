<template>
  <div class="app sidebar-mini rtl">
    <!-- Navbar -->
    <header class="app-header">
      <ul class="app-nav">
        <li>
          <a class="app-nav__item" href="/index.html">
            <i class="bx bx-log-out bx-rotate-180"></i>
          </a>
        </li>
      </ul>
    </header>

    <main class="app app-ban-hang">
      <div class="row">
        <div class="col-md-12">
          <div class="app-title">
            <ul class="app-breadcrumb breadcrumb">
              <li class="breadcrumb-item">
                <a href="#"><b>POS bán hàng</b></a>
              </li>
            </ul>
            <div id="clock"></div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
          <div class="tile">
            <h3 class="tile-title">Phần mềm bán hàng</h3>
            <input
              type="text"
              id="myInput"
              ref="myInput"
              @input="myFunction"
              placeholder="Nhập mã sản phẩm hoặc tên sản phẩm để tìm kiếm..."
            />
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
                  <tr
                    v-for="product in products"
                    :key="product.id"
                    @click="addToCart(product)"
                  >
                    <td>{{ product.sku }}</td>
                    <td>{{ product.productID.name }}</td>
                    <td>
                      <img
                        :src="getDefaultImageUrl(product.productID.imagesDTOS)"
                        alt=""
                        width="70px"
                      />
                    </td>
                    <td>{{ product.quantity }}</td>
                    <td>
                      <span
                        :class="{
                          'badge bg-success': product.status,
                          'badge bg-danger': !product.status,
                        }"
                      >
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
                      <button @click="decreaseQuantity(item)">-</button>
                      {{ item.quantity }}
                      <button @click="increaseQuantity(item)">+</button>
                    </td>
                    <td>{{ item.price }}</td>
                    <td>
                      {{ formatPrice(item.quantity * parsePrice(item.price)) }}
                    </td>
                    <td>
                      <button
                        class="btn btn-danger btn-sm"
                        @click="removeFromCart(item)"
                      >
                        Xóa
                      </button>
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
                <label class="control-label">Họ tên khách hàng</label>
                <select class="form-control" v-model="selectedCustomer">
                  <option
                    v-for="customer in customers"
                    :key="customer.id"
                    :value="customer"
                  >
                    {{ customer.name }}
                  </option>
                </select>
              </div>
              <div class="form-group col-md-2">
                <label style="text-align: center" class="control-label"
                  >Tạo mới</label
                >
                <button
                  class="btn btn-primary btn-them"
                  data-toggle="modal"
                  data-target="#exampleModalCenter"
                >
                  <i class="fas fa-user-plus"></i>
                </button>
              </div>
              <div class="form-group col-md-12">
                <label class="control-label">Voucher</label>
                <input
                  class="form-control"
                  id="voucher"
                  ref="voucher"
                  @input="getVoucher()"
                  type="text"
                  placeholder="Nhập mã voucher"
                />
              </div>
              <div class="form-group col-md-12">
                <label class="control-label">Ghi chú đơn hàng</label>
                <textarea
                  class="form-control"
                  rows="4"
                  placeholder="Ghi chú thêm đơn hàng"
                  v-model="orderNote"
                ></textarea>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-12">
                <label class="control-label">Hình thức thanh toán</label>
                <select class="form-control" v-model="paymentMethod" required>
                  <option value="1">Quẹt thẻ</option>
                  <option value="2">Thanh toán trực tiếp</option>
                  <option value="3">Chuyển khoản</option>
                </select>
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Tạm tính tiền hàng: </label>
                <p class="control-all-money-tamtinh">
                  = {{ formatPrice(totalAmount) }} VNĐ
                </p>
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Giảm giá (F7): </label>
                <input
                  class="form-control"
                  type="text"
                  v-model="discount"
                  @input="calculateTotal"
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Tổng cộng thanh toán: </label>
                <p class="control-all-money-total">
                  = {{ formatPrice(finalAmount) }} VNĐ
                </p>
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Khách hàng đưa tiền (F8): </label>
                <input
                  class="form-control"
                  type="number"
                  v-model="amountReceived"
                  @input="calculateChange"
                />
              </div>
              <div class="form-group col-md-12">
                <label class="control-label">Khách hàng còn nợ: </label>
                <p class="control-all-money">
                  {{ formatPrice(changeDue) }} VNĐ
                </p>
              </div>
              <div class="tile-footer col-md-12">
                <button
                  class="btn btn-primary luu-san-pham"
                  type="button"
                  @click="saveOrder"
                >
                  Lưu đơn hàng (F9)
                </button>
                <button
                  class="btn btn-primary luu-va-in"
                  type="button"
                  @click="saveAndPrint"
                >
                  Lưu và in hóa đơn (F10)
                </button>
                <a class="btn btn-secondary luu-va-in" href="/">Quay về</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      data-backdrop="static"
      data-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div class="row">
              <div class="form-group col-md-12">
                <span class="thong-tin-thanh-toan">
                  <h5>Tạo mới khách hàng</h5>
                </span>
              </div>
              <div class="form-group col-md-12">
                <label class="control-label">Họ và tên</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="newCustomer.name"
                  required
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Địa chỉ</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="newCustomer.address"
                  required
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Email</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="newCustomer.email"
                  required
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Ngày sinh</label>
                <input
                  class="form-control"
                  type="date"
                  v-model="newCustomer.birthDate"
                  required
                />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Số điện thoại</label>
                <input
                  class="form-control"
                  type="number"
                  v-model="newCustomer.phone"
                  required
                />
              </div>
            </div>
            <br />
            <button class="btn btn-save" type="button" @click="saveCustomer">
              Lưu lại
            </button>
            <a class="btn btn-cancel" data-dismiss="modal" href="#">Hủy bỏ</a>
            <br />
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      products: [],
      customers: [],
      cart: [],
      selectedEmployee: "",
      currentPage: 0, // Số trang hiện tại
      pageSize: 4, // Số sản phẩm mỗi trang
      orderNote: "",
      paymentMethod: "",
      discount: 0,
      amountReceived: 0,
      newCustomer: {
        name: "",
        address: "",
        email: "",
        birthDate: "",
        phone: "",
      },
    };
  },
  computed: {
    totalAmount() {
      return this.cart.reduce((total, item) => {
        const price = this.parsePrice(item.price); // Chuyển đổi giá thành số
        return total + price * item.quantity; // Tính tổng giá
      }, 0);
    },
    finalAmount() {
      return this.totalAmount - this.discount;
    },
    changeDue() {
      return this.amountReceived - this.finalAmount;
    },
  },
  mounted() {
    this.fetchProducts(this.currentPage, this.pageSize); // Gọi hàm để lấy tất cả sản phẩm khi component được mount
    this.getCustomer(); // Gọi hàm để lấy tất cả khách hàng khi component được mount
  },
  methods: {
    selectid(id) {
      console.log("Biến thể: " + id);
    },
    async myFunction() {
      const searchKeyword = this.$refs.myInput.value; // Lấy giá trị từ ô tìm kiếm
      console.log(searchKeyword);
      try {
        const response = await axios.get(
          `http://localhost:8080/MiniatureCrafts/result/${searchKeyword}`
        );
        this.products = [...response.data.content];
        console.log("Dữ liệu sản phẩm:", this.products);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    },
    async fetchProducts(page, size) {
      try {
        const response = await axios.get(
          `http://localhost:8080/admin/variation/result/all?page=${page}&size=${size}`
        );
        this.products = response.data.content; // Lấy danh sách sản phẩm
        this.totalPages = response.data.page.totalPages; // Tổng số trang
        console.log("Dữ liệu sản phẩm:", this.products);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm:", error);
      }
    },
    async getCustomer() {
      try {
        const response = await axios.get(
          `http://localhost:8080/admin/customer/result/all`
        );
        console.log(response.data);
        this.customers = response.data;
      } catch (error) {
        // Xử lý lỗi chi tiết
        if (error.response) {
          // Nếu lỗi từ server
          console.error(
            "Lỗi từ server:",
            error.response.status,
            error.response.data
          );
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
        const response = await axios.get(
          `http://localhost:8080/admin/orders/resultvoucher/${voucherCode}`
        );
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
      this.cart = this.cart.filter((product) => product.id !== item.id);
    },
    addToCart(product) {
      const existingProduct = this.cart.find((item) => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1; // Tăng số lượng nếu sản phẩm đã có
      } else {
        this.cart.push({ ...product, quantity: 1 }); // Thêm mới nếu chưa có
      }
    },
    parsePrice(priceString) {
      // Chuyển đổi giá từ chuỗi sang số
      return parseFloat(priceString.replace(/\./g, "").replace(" ₫", ""));
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
    async saveOrder() {
      // Kiểm tra xem giỏ hàng có sản phẩm không
      if (this.cart.length === 0) {
        alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi lưu đơn hàng.");
        return;
      }

      // Tạo dữ liệu đơn hàng theo cấu trúc JSON mẫu
      const orderData = {
        customerID: {
          id: this.selectedCustomer.id, // ID khách hàng được chọn từ dropdown
        },
        code_Voucher: "f0aee30f-98e8-4794-ab7a-0a91f9e75ebd", // Mã voucher (có thể thay đổi theo logic của bạn)
        note: this.orderNote, // Ghi chú đơn hàng
        paymentMethod: {
          id: this.paymentMethod, // Phương thức thanh toán
        },
        status: 1, // Trạng thái đơn hàng (có thể thay đổi theo logic của bạn)
        type_Oder: "1", // Loại đơn hàng (có thể thay đổi theo logic của bạn)
        orderLine: this.cart.map((item) => ({
          variationID: {
            id: item.id,
          }, // ID sản phẩm
          quantity: item.quantity, // Số lượng
        })),
      };

      try {
        const token = Cookies.get("token"); // Lấy token từ cookies
        const response = await axios.post(
          "http://localhost:8080/admin/orders/newOrder",
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
            },
          }
        );

        if (response.status === 201) {
          alert("Đơn hàng đã được lưu thành công!");
          this.fetchProducts(this.currentPage, this.pageSize);
          // Reset các trường dữ liệu nếu cần
          this.cart = [];
          this.orderNote = "";
          this.paymentMethod = "";
          this.selectedCustomer = null; // Reset khách hàng đã chọn
          this.newCustomer = {
            // Reset thông tin khách hàng
            name: "",
            address: "",
            email: "",
            birthDate: "",
            phone: "",
          };
        } else {
          alert("Không thể lưu đơn hàng. Vui lòng thử lại!");
        }
      } catch (error) {
        console.error("Lỗi khi lưu đơn hàng:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại!");
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
    },
  },
};
</script>
