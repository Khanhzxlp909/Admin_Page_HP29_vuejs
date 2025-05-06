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
              <form @submit.prevent="isEditing ? updateProduct() : addProduct()" class="product-form">
                <div class="form-group">
                  <label for="productName">Tên sản phẩm:</label>
                  <input id="productName" v-model="product.name" class="form-control" />
                </div>

                <div class="form-group">
                  <label>Danh mục</label>
                  <select v-model="product.categoryID.id" class="form-control" >
                    <option v-for="item in categories" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </option>
                  </select>
                </div>

                <h3>Upload 3 ảnh</h3>
                <div v-for="(image, index) in images" :key="index">
                  <input type="file" @change="handleFileUpload($event, index)" class="btn btn-info"/>
                  <input type="radio" v-model="defaultImageIndex" :value="index"/> Ảnh mặc định
                  <br/>
                  <img v-if="image.preview" :src="image.preview" alt="Preview" style="max-width: 100px; margin-top: 5px;" />
                </div>

                <br/>
                <button type="submit" class="btn btn-primary">{{ isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm' }}</button>
              </form>
              <table class="table table-hover table-bordered mt-3">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên danh mục</th>
                  <th>Tình trạng</th>
                  <th>Chức năng</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in products" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.categoryID.name}}</td>
                  <td>
                    <button @click="editProduct(item)" class="btn btn-warning">Edit</button>
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
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      product: {
        id: "",
        name: "",
        categoryID: {id: ""}
      },
      products: [],
      categories: [],
      id_images : [],
      images: [
        {id:"",file: null, preview: ""},
        {id:"",file: null, preview: ""},
        {id:"",file: null, preview: ""}
      ],
      defaultImageIndex: 0,
      imageUrls: [],
      isEditing: false
    };
  },
  created() {
    this.fetchCategories();
    this.fetchProducts();
  },
  methods: {
    editProduct(product) {
      this.product = {
        id: product.id,
        name: product.name,
        categoryID: { id: product.categoryID.id }
      };

      console.log("Dữ liệu sản phẩm:", product);
      this.isEditing = true; // Bật chế độ chỉnh sửa
      // Xóa danh sách cũ trước khi gán mới
      this.imageUrls = []; // Mảng chứa tất cả đường dẫn cd_Images từ API

      if (product.imagesDTOS && product.imagesDTOS.length > 0) {
        this.id_images = []; // Xóa danh sách ID ảnh cũ

        this.images = product.imagesDTOS.map(img => {
          this.id_images.push(img.id); // Lưu ID ảnh cần xóa
          this.imageUrls.push(img.cd_Images); // Lưu cd_Images vào mảng

          return {
            id: img.id,
            file: null,
            preview: img.cd_Images.includes("http")
                ? img.cd_Images
                : `http://localhost:8080/upload/images/${img.cd_Images}`
          };
        });

        console.log("Danh sách URL ảnh:", this.imageUrls); // Kiểm tra dữ liệu

        // Lấy vị trí ảnh mặc định
        const defaultImageIndex = product.imagesDTOS.findIndex(img => img.set_Default);
        this.defaultImageIndex = defaultImageIndex !== -1 ? defaultImageIndex : 0;
      } else {
        this.images = [
          { file: null, preview: "" },
          { file: null, preview: "" },
          { file: null, preview: "" }
        ];
        this.id_images = []; // Không có ảnh để xóa
        this.imageUrls = []; // Không có ảnh để lưu
      }
    },


    async fetchProducts() {
      const token = Cookies.get("authToken");
      if (!token) {
        alert("Bạn cần đăng nhập.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/admin/product/findAll`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        this.products = response.data;
        console.log("products: ", this.products);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        alert("Không thể tải danh mục.");
      }
    },

    handleFileUpload(event, index) {
      const file = event.target.files[0];
      if (file) {
        this.images[index].file = file;
        this.images[index].preview = URL.createObjectURL(file);
      }
    },

    validateForm() {
      // Kiểm tra tên sản phẩm không chỉ có dấu cách và không quá 25 ký tự
      if (!this.product.name.trim() || this.product.name.length > 25) {
        alert("Tên sản phẩm không hợp lệ! Không được chỉ chứa dấu cách hoặc dài quá 25 ký tự.");
        return false;
      }

      // Kiểm tra có đủ 3 ảnh chưa
      const uploadedFiles = this.images.filter(image => image.file !== null);
      if (uploadedFiles.length < 3) {
        alert("Vui lòng tải lên đủ 3 ảnh trước khi lưu sản phẩm!");
        return false;
      }

      return true;
    },

    async updateProduct() {
      const token = Cookies.get("authToken");
      if (!token) {
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }

      if (!this.validateForm()) return;

      try {
        console.log("Cập nhật sản phẩm:", this.product.id);
        console.log("Danh sách URL ảnh trước khi cập nhật:", this.imageUrls);

        // 1️⃣ Xóa ảnh cũ trước khi upload ảnh mới
        if (this.imageUrls.length > 0) {
          await axios.post(
              "http://localhost:8080/admin/variation/images/delete",
              this.imageUrls, // Gửi danh sách ảnh trực tiếp
              {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
              }
          );
          console.log("Xóa ảnh cũ thành công:", this.imageUrls);
        }

        // 2️⃣ Cập nhật sản phẩm
        await axios.post(
            `http://localhost:8080/admin/product/update`,
            this.product,
            {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            }
        );

        // 3️⃣ Upload ảnh mới
        const uploadedImages = [];
        for (const image of this.images) {
          if (image.file) {
            const formData = new FormData();
            formData.append("file", image.file);

            const uploadResponse = await axios.post(
                "http://localhost:8080/admin/variation/images/upload",
                formData,
                {
                  headers: { Authorization: `Bearer ${token}`,"Content-Type": "multipart/form-data" }
                }
            );

            uploadedImages.push(uploadResponse.data.urls[0]);
          }
        }

        // 4️⃣ Gộp ảnh cũ & mới
        const finalImages = [
          ...uploadedImages  // Ảnh mới upload
        ];

        console.log("Danh sách ảnh cuối cùng để gửi lên API:", finalImages);

        // 5️⃣ Gửi danh sách ảnh lên backend
        const imageRequests = finalImages.map((imageUrl, index) => ({
          product: {
            id: this.product.id
          },
          cd_Images: imageUrl,
          set_Default: index === this.defaultImageIndex
        }));

        await axios.post(
            "http://localhost:8080/admin/variation/images/setproduct",
            imageRequests,
            {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            }
        );

        alert("Cập nhật sản phẩm thành công!");
        this.$router.push("/product");
      } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert("Đã xảy ra lỗi khi cập nhật sản phẩm!");
      }
    },


    async addProduct() {
      const token = Cookies.get("token");
      if (!token) {
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }

      // Gọi hàm validate trước khi gửi dữ liệu
      if (!this.validateForm()) {
        return;
      }
      console.log("product: ", this.product.id);
      try {
        // 1. Gửi thông tin sản phẩm lên API
        const productResponse = await axios.post(
            "http://localhost:8080/admin/product/saved",
            this.product,
            {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            }
        );
        const productId = productResponse.data.id;

        // 2. Upload ảnh lên API
        const uploadedImages = [];

        for (const image of this.images) {
          if (image.file) {
            const formData = new FormData();
            formData.append("file", image.file);

            const uploadResponse = await axios.post(
                "http://localhost:8080/admin/variation/images/upload",
                formData,
                {
                  headers: { "Content-Type": "multipart/form-data" }
                }
            );

            const urls = uploadResponse.data.urls; // Đây là một mảng URL
            uploadedImages.push(...urls);
          }
        }

        // 3. Gửi danh sách ảnh kèm ảnh mặc định
        const imageRequests = uploadedImages.map((imageUrl, index) => ({
          product: {
            id: productId
          },
          cd_Images: imageUrl,
          set_Default: index === this.defaultImageIndex // Ảnh mặc định
        }));

        console.log("imageRequests: ", imageRequests);

        // 4. Gửi danh sách ảnh lên backend
        await axios.post(
            "http://localhost:8080/admin/variation/images/setproduct",
            imageRequests,
            {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            }
        );

        alert("Thêm sản phẩm thành công!");
        this.$router.push("/product");
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi khi thêm sản phẩm!");
      }
    },


    async fetchCategories() {
      const token = Cookies.get("token");
      if (!token) {
        alert("Bạn cần đăng nhập để tiếp tục.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/admin/category/getcategory", {
          headers: {Authorization: `Bearer ${token}`}
        });
        this.categories = response.data.content;
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        alert("Không thể tải danh mục.");
      }
    }
  }
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

.form-group {
  margin-bottom: 20px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
}

h3 {
  margin-top: 20px;
  font-size: 20px;
  color: #333;
}

input[type="file"] {
  display: block;
  margin: 10px 0;
  font-size: 14px;
}

.image-upload-container {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.image-preview {
  border-radius: 8px;
  max-width: 100px;
  height: auto;
  border: 2px solid #ddd;
  padding: 5px;
}

.radio-label {
  font-size: 14px;
  margin-left: 5px;
}

.product-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  color: #444;
  text-align: center;
  margin-bottom: 20px;
}

select,
input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

select:focus,
input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

</style>
