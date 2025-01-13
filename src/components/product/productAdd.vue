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
            <a href="#"><b>Thêm mới sản phẩm</b></a>
          </li>
        </ul>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-body">
              <form @submit.prevent="addProduct">
                <div class="form-group">
                  <label for="productName">Tên sản phẩm:</label>
                  <select
                      id="productName"
                      v-model="product.id"
                      class="form-control"
                      @change="setCategory"
                      required
                  >
                    <option
                        v-for="item in products"
                        :key="item.id"
                        :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Thương hiệu</label>
                  <select v-model="product.brand" class="form-control" required>
                    <option
                        v-for="item in brands"
                        :key="item.id"
                        :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="productPrice">Giá:</label>
                  <input
                      type="number"
                      id="productPrice"
                      v-model="product.price"
                      class="form-control"
                      required
                  />
                </div>
                <div class="form-group">
                  <label for="productQuantity">Số lượng:</label>
                  <input
                      type="number"
                      id="productQuantity"
                      v-model="product.quantity"
                      class="form-control"
                      required
                  />
                </div>
                <div class="form-group">
                  <label for="productQuantity">Trọng lượng:</label>
                  <input
                      type="text"
                      id="productQuantity"
                      v-model="product.weight"
                      class="form-control"
                      required
                  />
                </div>
                <div class="form-group">
                  <label for="productQuantity">Chất liệu:</label>
                  <input
                      type="text"
                      id="productQuantity"
                      v-model="product.material"
                      class="form-control"
                      required
                  />
                </div>
                <div class="form-group">
                  <label for="productStatus">Tình trạng:</label>
                  <select
                      id="productStatus"
                      v-model="product.status"
                      class="form-control"
                  >
                    <option value="true">Còn hàng</option>
                  </select>
                </div>
                <div class="form-group">
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
      file: null,
      imageUrl: "",
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
      products: [],
      brands: [],
    };
  },
  created() {
    this.fetchProducts();
    this.fetchBrands();
  },
  methods: {
    // Lấy danh sách sản phẩm
    async fetchProducts() {
      const token = Cookies.get("authToken");

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
    }
    ,
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
        console.log("Fetching products với token:", token);

        const response = await axios.get(
            "http://localhost:8080/admin/category/get",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        this.brands = response.data;

        console.log("Danh sách sản phẩm:", this.brands);
      } catch (error) {
        console.error("Lỗi khi fetch products:", error);
        if (error.response?.status === 401) {
          alert("Không có quyền truy cập. Vui lòng đăng nhập lại.");
          this.$router.push("/login");
        } else {
          alert("Không thể tải danh sách sản phẩm.");
        }
      }
    }
    ,

    // Cập nhật danh mục sản phẩm dựa trên ID
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
        this.$router.push("/product/list");
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);

        if (error.response?.status === 401) {
          alert("Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.");
          this.$router.push("/login");
        } else {
          alert("Đã xảy ra lỗi khi thêm sản phẩm!");
        }
      }
    }
    ,
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
</style>
