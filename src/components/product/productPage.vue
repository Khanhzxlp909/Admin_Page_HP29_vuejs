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
            <a href="#"><b>Thêm mới sản phẩm</b></a>
          </li>
        </ul>
        <div id="clock">{{ currentTime }}</div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-body">
              <form @submit.prevent="isEditing ? updateProduct() : addProduct()" class="row">
                <div class="form-group col-md-3">
                  <label for="productName">Tên sản phẩm:</label>
                  <select id="productName" v-model="product.id" class="form-control" @change="setCategory"  >
                    <option v-for="item in products" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group col-md-3">
                  <label for="productName">Nhà phân phối:</label>
                  <select id="productName" v-model="product.suppliers" class="form-control"  >
                    <option v-for="item in suppliers" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group col-md-3">
                  <label>Thương hiệu</label>
                  <select v-model="product.brand" class="form-control"  >
                    <option v-for="item in brands" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group col-md-3">
                  <label for="productPrice">Giá:</label>
                  <input type="number" id="productPrice" v-model="product.price" class="form-control"   style="width: max-content"/>
                </div>
                <div class="form-group col-md-3">
                  <label for="productQuantity">Số lượng:</label>
                  <input type="number" id="productQuantity" v-model="product.quantity" class="form-control" readonly   style="width: max-content"/>
                </div>
                <div class="form-group col-md-3">
                  <label for="productWeight">Trọng lượng:</label>
                  <input type="text" id="productWeight" v-model="product.weight" class="form-control"   />
                </div>
                <div class="form-group col-md-3">
                  <label for="productMaterial">Chất liệu:</label>
                  <input type="text" id="productMaterial" v-model="product.material" class="form-control"   />
                </div>
                <div class="form-group col-md-3">
                  <label for="productCategory">Danh mục:</label>
                  <input type="text" id="productCategory" v-model="product.categoryName" class="form-control"   readonly />
                </div>
                <br>
                <button type="submit" class="btn btn-primary">{{ isEditing ? 'Cập nhật biến thể' : 'Thêm biến thể' }}</button>
              </form>
              <div class="row element-button">
                <div class="col-sm-2">
                  <button class="btn btn-add btn-sm" @click="navigateToAddCategory" title="Thêm">
                    <i class="fas fa-plus"></i> Tạo mới danh mục
                  </button>
                </div>
                <div class="col-sm-2">
                  <button class="btn btn-add btn-sm" @click="navigateToAddVariation" title="Thêm">
                    <i class="fas fa-plus"></i> Tạo mới biến thể
                  </button>
                </div>
                <div class="col-sm-2">
                  <button class="btn btn-add btn-sm" @click="navigateToAddBrands" title="Thêm">
                    <i class="fas fa-plus"></i> Tạo mới thương hiệu
                  </button>
                </div>
                <div class="col-sm-2">
                  <button class="btn btn-add btn-sm" @click="navigateToAddProduct" title="Thêm">
                    <i class="fas fa-plus"></i> Tạo mới sản phẩm
                  </button>
                </div>
              </div>
              <table class="table table-hover table-bordered" id="sampleTable">
                <thead>
                <tr>
                  <th width="10">
                    <input type="checkbox" id="all" @click="toggleAllCheckboxes" />
                  </th>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Ảnh</th>
                  <th>Số lượng</th>
                  <th>Đã bán</th>
                  <th>Nhà phân phối</th>
                  <th>Tình trạng</th>
                  <th>Giá tiền</th>
                  <th>Danh mục</th>
                  <th>Chức năng</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="variation in variations" :key="variation.id">
                  <td width="10">
                    <input type="checkbox" v-model="variation.selected" />
                  </td>
                  <td>{{ variation.id }}</td>
                  <td>{{ variation.productID.name }}</td>
                  <td>
                    <img :src="getDefaultImageUrl(variation.productID.imagesDTOS)" alt="" width="70px;" />
                  </td>
                  <td>{{ variation.quantity }}</td>
                  <td>{{ variation.sold }}</td>
                  <td>{{ variation.supplier.name }}</td>
                  <td>
                      <span :class="{'badge bg-success': variation.status, 'badge bg-danger': !variation.status}">
                        {{ variation.status ? "Còn hàng" : "Hết hàng" }}
                      </span>
                  </td>
                  <td>{{ variation.price }}</td>
                  <td>{{ variation.productID.categoryID.name }}</td>
                  <td>
                    <button class="btn btn-edit" @click="editVariation(variation,variation.id)">Sửa</button>
                    <button class="btn btn-delete" @click="confirmDelete(variation)">Xóa</button>
                  </td>
                </tr>
                </tbody>
              </table>
              <div class="pagination">
                <button class="page-button" :disabled="currentPage === 0" @click="changePage(currentPage - 1)">
                  Previous
                </button>
                <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
                <button class="page-button" :disabled="currentPage >= totalPages - 1" @click="changePage(currentPage + 1)">
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
      pageSize: 10,
      totalPages: 0,
      variations: [],
      products: [],
      brands: [],
      suppliers: [],
      variationID: "",
      product: {
        id: "",
        price: 0,
        quantity: 0,
        status: true,
        category: "",
        categoryName: "",
        brand: "",
        suppliers: "",
        material: "",
        weight: "",
      },
      isEditing: false, // New property to track if we are editing
    };
  },
  created() {
    this.updateTime();
    this.fetchVariations(this.currentPage, this.pageSize);
    this.fetchProducts();
    this.fetchBrands();
    this.fetchSuppliers();
  },
  methods: {
    isEmpty(value) {
      return value == null || value.toString().trim() === "";
    },

    validateForm() {
      // Kiểm tra trường 'Tên sản phẩm'
      if (this.isEmpty(this.product.id)) {
        alert("Tên sản phẩm không được để trống!");
        return false;
      }
      if (this.product.id.length > 25) {
        alert("Tên sản phẩm không được quá 25 ký tự!");
        return false;
      }

      // Kiểm tra thương hiệu
      if (this.isEmpty(this.product.brand)) {
        alert("Thương hiệu sản phẩm không được để trống!");
        return false;
      }
      if (this.product.brand.length > 50) {
        alert("Thương hiệu sản phẩm không được quá 50 ký tự!");
        return false;
      }

      // Kiểm tra danh mục sản phẩm
      if (this.isEmpty(this.product.category)) {
        alert("Danh mục sản phẩm không được để trống!");
        return false;
      }

      // Kiểm tra nhà phân phối
      if (this.isEmpty(this.product.suppliers)) {
        alert("Nhà phân phối sản phẩm không được để trống!");
        return false;
      }

      // Kiểm tra giá sản phẩm
      if (this.isEmpty(this.product.price)) {
        alert("Giá sản phẩm không được để trống!");
        return false;
      }
      if (isNaN(this.product.price) || this.product.price <= 0) {
        alert("Giá sản phẩm phải là số lớn hơn 0!");
        return false;
      }

      // Kiểm tra trọng lượng
      if (this.isEmpty(this.product.weight)) {
        alert("Trọng lượng không được để trống!");
        return false;
      }
      if (this.product.weight.length > 25) {
        alert("Trọng lượng không được quá 25 ký tự!");
        return false;
      }

      // Kiểm tra chất liệu
      if (this.isEmpty(this.product.material)) {
        alert("Chất liệu không được để trống!");
        return false;
      }
      if (this.product.material.length > 25) {
        alert("Chất liệu không được quá 25 ký tự!");
        return false;
      }

      return true; // Nếu tất cả điều kiện đều hợp lệ
    },

    navigateToAddCategory() {
      this.$router.push("/category");
    },
    navigateToAddVariation() {
      this.$router.push("/product/add");
    },
    navigateToAddBrands() {
      this.$router.push("/brands");
    },
    navigateToAddProduct() {
      this.$router.push("/addproduct");
    },

    editVariation(variation, variationID) {
      this.variationID = variationID;
      this.product.id = variation.productID.id;          // Set cho Selectbox Tên sản phẩm
      this.product.brand = variation.brandID.id;         // Set cho Selectbox Thương hiệu
      this.product.suppliers = variation.supplier.id;         // Set cho Selectbox Thương hiệu
      this.product.price = this.parsePrice(variation.price);  // Set giá
      this.product.quantity = variation.quantity;        // Set số lượng
      this.product.weight = variation.weight;            // Set trọng lượng
      this.product.material = variation.material;        // Set chất liệu
      this.product.status = variation.status;            // Set tình trạng
      this.product.category = variation.productID.categoryID.id; // Set danh mục
      this.product.categoryName = variation.productID.categoryID.name; // Set danh mục

      this.isEditing = true; // Bật chế độ chỉnh sửa
    },
    parsePrice(priceString) {
      // Chuyển đổi giá từ chuỗi sang số
      return parseFloat(priceString.replace(/\./g, '').replace(' ₫', ''));
    },
    async updateProduct() {
      if (!this.validateForm()) {
        return; // Nếu validate không thành công, dừng xử lý
      }
      const token = Cookies.get("authToken");
      const data = {
        id: this.variationID,
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
        supplier: {
          id: this.product.suppliers,
        },
        price: this.product.price + " ₫",
        weight: this.product.weight,
      };
      console.log(data);
      if (!token) {
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }
      try {
        const response = await axios.post(`http://localhost:8080/admin/variation/update`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("Cập nhật sản phẩm thành công!");
        this.product.id = "";
        this.product.price = 0;
        this.product.quantity = 0;
        this.product.status = true;
        this.product.category = "";
        this.product.brand = "";
        this.product.material = "";
        this.product.weight = "";

        this.isEditing = false; // Reset editing mode
        this.fetchVariations(this.currentPage, this.pageSize); // Refresh the variations list
      } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert("Đã xảy ra lỗi khi cập nhật sản phẩm!");
      }
    },
    fetchVariations(page = 0, size = 10) {
      axios
          .get(`http://localhost:8080/admin/variation/result/all?page=${page}&size=${size}`)
          .then((response) => {
            this.variations = response.data.content;
            this.totalPages = response.data.page.totalPages;
            console.log(this.variations)
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm:", error);
          });
    },
    getDefaultImageUrl(imagesDTOS) {
      if (imagesDTOS && imagesDTOS.length > 0) {
        const defaultImage = imagesDTOS.find((image) => image.set_Default);
        return defaultImage ? `http://localhost:8080/images/${defaultImage.cd_Images}` : "/img/default.jpg";
      }
      return "/img/default.jpg";
    },
    deleteProduct(productId) {
      const token = Cookies.get("token");

      if (!token) {
        alert("Token không hợp lệ hoặc không tồn tại.");
        return;
      }
      const apiurl = "http://localhost:8080/admin/variation/delete/" + productId;
      axios
          .get(apiurl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            this.fetchVariations(this.currentPage, this.pageSize);
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi xóa sản phẩm:", error);
          });
    },
    confirmDelete(variation) {
      if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${variation.productID.name}"?`)) {
        this.deleteProduct(variation.id);
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
    changePage(page) {
      this.currentPage = page;
      this.fetchVariations(page, this.pageSize);
    },
    toggleAllCheckboxes() {
      const allChecked = this.variations.every((variation) => variation.selected);
      this.variations.forEach((variation) => (variation.selected = !allChecked));
    },
    async fetchProducts() {
      const token = Cookies.get("token");

      if (!token) {
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/admin/variation/getproduct");
        this.products = response.data;
      } catch (error) {
        console.error("Lỗi khi fetch products:", error);
        alert("Không thể tải danh sách sản phẩm.");
      }
    },
    async fetchBrands() {
      const token = Cookies.get("token");

      if (!token) {
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/admin/brands/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.brands = response.data.content;
      } catch (error) {
        console.error("Lỗi khi fetch brands:", error);
        alert("Không thể tải danh sách thương hiệu.");
      }
    },
    async fetchSuppliers() {
      const token = Cookies.get("token");

      if (!token) {
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/admin/warehouse/suppiller/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.suppliers = response.data;
      } catch (error) {
        console.error("Lỗi khi fetch suppliers:", error);
        alert("Không thể tải danh sách nhà phân phối.");
      }
    },
    setCategory() {
      const selectedProduct = this.products.find((product) => product.id === this.product.id);
      if (selectedProduct) {
        this.product.category = selectedProduct.categoryID.id;
        this.product.categoryName = selectedProduct.categoryID.name;
      } else {
        this.product.category = "";
      }
    },
    async addProduct() {
      if (!this.validateForm()) {
        return; // Nếu validate không thành công, dừng xử lý
      }
      const token = Cookies.get("token");
      const data = {
        status: false,
        productID: {
          id: this.product.id,
          categoryID: {
            id: this.product.category,
          },
        },
        quantity: this.product.quantity,
        material: this.product.material,
        supplier: {
          id: this.product.suppliers,
        },
        brandID: {
          id: this.product.brand,
        },
        price: this.product.price + " ₫",
        weight: this.product.weight,
      };
      if (!token) {
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await axios.post("http://localhost:8080/admin/variation/add", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("Thêm sản phẩm thành công!");
        this.fetchVariations(this.currentPage, this.pageSize);
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        alert("Đã xảy ra lỗi khi thêm sản phẩm!");
      }
    },
  },
};
</script>

<style>
.form-group {
  margin-bottom: 20px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

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