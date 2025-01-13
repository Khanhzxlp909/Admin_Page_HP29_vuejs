<template>
  <div id="app" class="app sidebar-mini rtl">
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
                  <input
                      id="productName"
                      v-model="product.name"
                      class="form-control"

                  />
                </div>
                <div class="form-group">
                  <label>Danh mục</label>
                  <select v-model="product.categoryID.id" class="form-control" required>
                    <option v-for="item in brands"
                            :key="item.id"
                            :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <h1>Upload Image</h1>
                <input
                    class="btn btn-info"
                    type="file"
                    @change="handleFileUpload"
                />
                <button class="btn btn-info" @click="uploadImage">
                  Upload
                </button>
                <div v-if="imageUrl">
                  <h2>Uploaded Image:</h2>
                  <img
                      :src="imageUrl"
                      alt="Uploaded Image"
                      style="max-width: 300px"
                  />
                </div>
                <br/>
                <button type="submit" @click="uploadImage" class="btn btn-primary">
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
        name: "",
        categoryID: {
          id: "",
        }
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
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async uploadImage() {
      if (!this.file) {
        alert("Please select a file to upload");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", this.file);

        const response = await axios.post(
            "http://localhost:8080/admin/variation/images/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
        );

        this.imageUrl = response.data.url; // Đường dẫn ảnh trả về từ backend
        console.log(response.data.url);
        localStorage.setItem("urlImages", response.data.url);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file");
      }
    },
    // Lấy danh sách sản phẩm
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
            "http://localhost:8080/admin/variation/getproduct",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        this.products = response.data;

        console.log("Danh sách sản phẩm:", this.products);
      } catch (error) {
        console.error("Lỗi khi fetch products:", error);
        if (error.response?.status === 401) {
          alert("Không có quyền truy cập. Vui lòng đăng nhập lại.");
          this.$router.push("/login");
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
    },

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
    },

    // Gửi request thêm sản phẩm
    async addProduct() {
      const token = Cookies.get("token");
      console.log("id category: " + this.product.category);
      const data = {
        name: this.product.name,
        categoryID: {
          id: this.product.categoryID.id,
        }
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
            "http://localhost:8080/admin/product/saved",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
        );

        console.log("Kết quả từ server:", response.data.id);
        const imagesUrl = localStorage.getItem("urlImages");
        const dataImages = {
          product: {
            id: response.data.id,
            categoryID: {
              id: 1,
            }
          },
          cd_Images: imagesUrl,
          set_Default: true
        };

        const responses = await axios.post(
            "http://localhost:8080/admin/variation/images/setproduct",
            dataImages,
            {
              headers: {
                Authorization: `Bearer ${token}`,  // Thêm token vào header
              },
            }
        );

        localStorage.removeItem("urlImages")
        console.log(responses.data)
        alert("Thêm sản phẩm thành công!");
        // this.$router.push("/product/list");
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);

        if (error.response?.status === 401) {
          alert("Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.");
          // this.$router.push("/login");/
        } else {
          alert("Đã xảy ra lỗi khi thêm sản phẩm!");
        }
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
</style>
