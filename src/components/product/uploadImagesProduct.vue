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
              <form @submit.prevent="addProduct" class="product-form">
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
                  <img v-if="image.preview" :src="image.preview" alt="Preview"
                       style="max-width: 100px; margin-top: 5px;"/>
                </div>

                <br/>
                <button type="submit" class="btn btn-primary">Thêm sản phẩm</button>
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
      product: {
        name: "",
        categoryID: {id: ""}
      },
      categories: [],
      images: [
        {file: null, preview: ""},
        {file: null, preview: ""},
        {file: null, preview: ""}
      ],
      defaultImageIndex: 0
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
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
        const response = await axios.get("http://localhost:8080/admin/category/get", {
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
