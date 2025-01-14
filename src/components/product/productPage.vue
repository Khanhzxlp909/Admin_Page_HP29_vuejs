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
              <form @submit.prevent="addProduct" class="row">
                <div class="form-group col-md-3">
                  <label for="productName">Tên sản phẩm:</label>
                  <select id="productName"
                          v-model="product.id"
                          class="form-control" @change="setCategory" required>
                    <option
                        v-for="item in products"
                        :key="item.id"
                        :value="product.id"
                    >
                      {{ item.name }} - {{item.categoryID.name}}
                    </option>
                  </select>
                </div>
                <div class="form-group col-md-3">
                  <label>Thương hiệu</label>
                  <select v-model="product.brand" class="form-control" required>
                    <option v-for="item in brands" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group col-md-3">
                  <label for="productPrice">Giá:</label>
                  <input
                      style="width: max-content"
                      type="number"
                      id="productPrice"
                      v-model="product.price"
                      class="form-control"
                      required
                  />
                </div>
                <div class="form-group col-md-3">
                  <label for="productQuantity">Số lượng:</label>
                  <input
                      style="width: max-content"
                      type="number"
                      id="productQuantity"
                      v-model="product.quantity"
                      class="form-control"
                      required
                  />
                </div>
                <div class="form-group col-md-3">
                  <label for="productWeight">Trọng lượng:</label>
                  <input
                      type="text"
                      id="productWeight"
                      v-model="product.weight"
                      class="form-control"
                      required
                  />
                </div>
                <div class="form-group col-md-3">
                  <label for="productMaterial">Chất liệu:</label>
                  <input
                      type="text"
                      id="productMaterial"
                  v-model="product.material"
                  class="form-control"
                  required
                  />
                </div>
                <div class="form-group col-md-3">
                  <label for="variationstatus">Tình trạng:</label>
                  <select
                      id="variationstatus"
                      v-model="product.status"
                      class="form-control"
                  >
                    <option value="true">Còn hàng</option>
                  </select>
                </div>
                <div class="form-group col-md-3">
                  <label for="productCategory">Danh mục:</label>
                  <input
                      type="text"
                      id="productCategory"
                      v-model="product.category"
                      class="form-control"
                      required
                      readonly
                  />
                </div>
                <button type="submit" class="btn btn-primary">
                  Thêm sản phẩm
                </button>
              </form>
              <div class="row element-button">
                <div class="col-sm-2">
                  <button
                      class="btn btn-add btn-sm"
                      @click="navigateToAddCategory"
                      title="Thêm"
                  >
                    <i class="fas fa-plus"></i> Tạo mới danh mục
                  </button>
                </div>

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
                      @click="navigateToAddBrands"
                      title="Thêm"
                  >
                    <i class="fas fa-plus"></i> Tạo mới thương hiệu
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
                  <th width="10">
                    <input
                        type="checkbox"
                        id="all"
                        @click="toggleAllCheckboxes"
                    />
                  </th>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Ảnh</th>
                  <th>Số lượng</th>
                  <th>Tình trạng</th>
                  <th>Giá tiền</th>
                  <th>Danh mục</th>
                  <th>Chức năng</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in variations" :key="product.id">
                  <td width="10">
                    <input type="checkbox" v-model="product.selected"/>
                  </td>
                  <td>{{ product.id }}</td>
                  <td>{{ product.productID.name }}</td>
                  <td>
                    <img
                        :src="getDefaultImageUrl(product.productID.imagesDTOS)"
                        alt=""
                        width="70px;"
                    />
                  </td>
                  <td>{{ product.quantity }}</td>
                  <td>
                      <span
                          :class="{
                          'badge bg-success': product.status,
                          'badge bg-danger': !product.status,
                        }"
                      >{{ product.status ? "Còn hàng" : "Hết hàng" }}</span
                      >
                  </td>
                  <td>{{ product.price }}</td>
                  <td>{{ product.productID.categoryID.name }}</td>
                  <td>
                    <button
                        class="btn btn-edit"
                        @click="editVariation(product)"
                    >
                      Sửa
                    </button>
                    <button
                        class="btn btn-delete"
                        @click="confirmDelete(product)"
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
      pageSize: 10, // Số sản phẩm mỗi trang
      totalPages: 0, // Tổng số trang
      variations: [], // Dữ liệu sản phẩm
      products: [],
      brands:[],
      product: {
        id: "",
        price: 0,
        quantity: 0,
        status: true,
        category: "",
        brand: "",
        material: "",
        weight: "",
      },
      selectedProduct: {
        code: "",
        name: "",
        quantity: "",
        status: "",
        price: "",
        category: "",
      },
    };
  },
  methods: {
    navigateToAddCategory() {
      this.$router.push("/category"); // Chuyển hướng đến `productAdd.vue`
    },
    navigateToAddVariation() {
      this.$router.push("/product/add"); // Chuyển hướng đến `productAdd.vue`
    },
    navigateToAddBrands() {
      this.$router.push("/brands"); // Chuyển hướng đến `productAdd.vue`
    },
    navigateToAddProduct() {
      this.$router.push("/addproduct"); // Chuyển hướng đến `productAdd.vue`
    },
    editVariation(variation) {
      this.product = { ...variation }; // Copy dữ liệu để chỉnh sửa
    },
    // Lấy danh sách sản phẩm
    fetchvariations(page = 0, size = 10) {
      axios
          .get(
              `http://localhost:8080/admin/variation/result/all?page=${page}&size=${size}`
          )
          .then((response) => {
            this.variations = response.data.content;
            this.totalPages = response.data.page.totalPages;
            console.log(response.data.content);
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm:", error);
          });
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
    // Xóa sản phẩm
    deleteProduct(productId) {
      const token = Cookies.get("token"); // Lấy token từ cookies

      if (!token) {
        alert("Token không hợp lệ hoặc không tồn tại.");
        return;
      }
      const apiurl =
          "http://localhost:8080/admin/variation/delete/" + productId;
      console.log(token);
      console.log(apiurl);
      axios
          .get(apiurl, {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
            },
          })
          .then((response) => {
            // Sau khi xóa thành công, tải lại danh sách sản phẩm
            this.fetchvariations(this.currentPage, this.pageSize);
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi xóa sản phẩm:", error);
          });
    },
    // Xử lý xóa sản phẩm
    confirmDelete(product) {
      if (
          confirm(
              `Bạn có chắc chắn muốn xóa sản phẩm "${product.productID.name}"?`
          )
      ) {
        this.deleteProduct(product.id);
      }
    },
    updateTime() {
      const today = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      this.currentTime = today.toLocaleDateString("vi-VN", options);
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
    async fetchProducts() {
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
            "http://localhost:8080/admin/variation/getproduct");
        this.products = response.data;

        console.log("Danh sách sản phẩm:", this.products);
      } catch (error) {
        console.error("Lỗi khi fetch products:", error);
        if (error.response?.status === 401) {
          console.log("Không có quyền truy cập. Vui lòng đăng nhập lại.");
          // this.$router.push("/login");
        } else {
          alert("Không thể tải danh sách sản phẩm.");
        }
      }
    },
    // Lấy danh sách sản phẩm
    async fetchBrands() {
      const token = Cookies.get("token");

      if (!token) {
        console.error("Token không tồn tại trong cookie. Vui lòng đăng nhập.");
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }

      try {
        console.log("Fetching brands với token:", token);

        const response = await axios.get(
            "http://localhost:8080/admin/brands/get",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        this.brands = response.data;

        console.log("Danh sách thương hiệu:", this.brands); // Kiểm tra dữ liệu
      } catch (error) {
        console.error("Lỗi khi fetch brands:", error);
        if (error.response?.status === 401) {
          alert("Không có quyền truy cập. Vui lòng đăng nhập lại.");
          this.$router.push("/login");
        } else {
          alert("Không thể tải danh sách thương hiệu.");
        }
      }
    },
    setCategory() {
      const selectedProduct = this.products.find(
          (product) => product.id === this.product.id
      );
      if (selectedProduct) {
        this.product.category = selectedProduct.categoryID.id;
        console.log("Danh mục đã được cập nhật:", this.product.category);
      } else {
        console.error("Không tìm thấy sản phẩm với ID:", this.product.id);
        this.product.category = "";
      }
    }
    ,

    // Gửi request thêm sản phẩm
    async addProduct() {
      const token = Cookies.get("token");
      console.log("id category: " + this.product.category);
      const data = {
        status: true,
        productID: {
          id: this.product.id,
          categoryID: {
            id: this.product.category,
          },
        },
        quantity: this.product.quantity,
        material: this.product.material,
        brandID: {
          id: this.product.brand,
        },
        price: this.product.price + " ₫",
        weight: this.product.weight,
      };
      if (!token) {
        console.error("Token không tồn tại hoặc đã hết hạn.");
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }

      try {
        console.log("Gửi dữ liệu sản phẩm:", data);

        const response = await axios.post(
            "http://localhost:8080/admin/variation/add",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
        );

        console.log("Kết quả từ server:", response.data);
        alert("Thêm sản phẩm thành công!");
        location.reload();
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);

        if (error.response?.status === 401) {
          alert("Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.");
          this.$router.push("/login");
        } else {
          alert("Đã xảy ra lỗi khi thêm sản phẩm!");
        }
      }
    },
  },
  mounted() {
    this.updateTime();
    this.fetchvariations(this.currentPage, this.pageSize);
    this.fetchProducts();
    this.fetchBrands();
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
