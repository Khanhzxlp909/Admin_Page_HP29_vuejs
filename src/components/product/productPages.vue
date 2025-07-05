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
                  <input id="productName" v-model="product.name" class="form-control"/>
                </div>

                <div class="form-group">
                  <label>Danh mục</label>
                  <select v-model="product.categoryID.id" class="form-control">
                    <option v-for="item in categories" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Thương hiệu</label>
                  <select v-model="product.brandID.id" class="form-control">
                    <option v-for="item in brands" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </option>
                  </select>
                </div>

                <h3>Upload 3 ảnh</h3>
                <div v-for="(image, index) in images" :key="index" class="image-preview-wrapper">
                  <input type="file" @change="handleFileUpload($event, index)" />
                  <img v-if="image.preview" :src="image.preview" alt="Preview" />
                  <label class="radio-label">
                    <input type="radio" v-model="defaultImageIndex" :value="index" /> Ảnh mặc định
                  </label>
                </div>

                <br/>
                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm' }}
                </button>
              </form>

              <table class="table table-hover table-bordered mt-3">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Thương hiệu</th>
                  <th>Chức năng</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in products" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.categoryID.name }}</td>
                  <td>{{ item.brandID.name }}</td>
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
        categoryID: { id: "" },
        brandID: { id: "" }
      },
      brands: [],
      products: [],
      categories: [],
      id_images: [],
      images: [
        { id: "", file: null, preview: "" },
        { id: "", file: null, preview: "" },
        { id: "", file: null, preview: "" }
      ],
      defaultImageIndex: 0,
      imageUrls: [],
      isEditing: false
    };
  },
  created() {
    this.fetchCategories();
    this.fetchProducts();
    this.fetchBrands();
  },
  methods: {
    editProduct(product) {
      this.product = {
        id: product.id,
        name: product.name,
        categoryID: { id: product.categoryID?.id || "" },
        brandID: { id: product.brandID?.id || "" }
      };

      this.isEditing = true;
      this.imageUrls = [];
      this.id_images = [];

      if (product.imagesDTOS && product.imagesDTOS.length > 0) {
        this.images = product.imagesDTOS.map((img) => {
          const imgUrl = img.cd_Images.includes("http")
              ? img.cd_Images
              : `http://localhost:8080/upload/images/${img.cd_Images}`;

          this.id_images.push(img.id);
          this.imageUrls.push(img.cd_Images);

          return {
            id: img.id,
            file: null,
            preview: imgUrl
          };
        });

        while (this.images.length < 3) {
          this.images.push({ id: "", file: null, preview: "" });
        }

        const defaultIdx = product.imagesDTOS.findIndex(img => img.set_Default);
        this.defaultImageIndex = defaultIdx !== -1 ? defaultIdx : 0;
      } else {
        this.images = [
          { id: "", file: null, preview: "" },
          { id: "", file: null, preview: "" },
          { id: "", file: null, preview: "" }
        ];
      }
    },

    async fetchProducts() {
      const token = Cookies.get("authToken");
      if (!token) return this.$router.push("/login");

      try {
        const response = await axios.get(`http://localhost:8080/admin/product/findAll`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.products = response.data;
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    },

    async fetchBrands() {
      const token = Cookies.get("token");
      if (!token) return this.$router.push("/login");

      try {
        const response = await axios.get("http://localhost:8080/admin/brands/getbrands", {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.brands = response.data.content;
      } catch (error) {
        console.error("Lỗi khi fetch brands:", error);
      }
    },

    async fetchCategories() {
      const token = Cookies.get("token");
      if (!token) return this.$router.push("/login");

      try {
        const response = await axios.get("http://localhost:8080/admin/category/getcategory", {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.categories = response.data.content;
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
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
      if (!this.product.name.trim() || this.product.name.length > 25) return false;

      const uploadedFiles = this.images.filter(image => image.file !== null);
      if (uploadedFiles.length < 3) return false;

      return true;
    },

    async updateProduct() {
      const token = Cookies.get("authToken");
      if (!token) return this.$router.push("/login");
      if (!this.validateForm()) return;

      try {
        if (this.imageUrls.length > 0) {
          await axios.post(
              "http://localhost:8080/admin/variation/images/delete",
              this.imageUrls,
              { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
          );
        }

        await axios.post(
            `http://localhost:8080/admin/product/update`,
            this.product,
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        const uploadedImages = [];
        for (const image of this.images) {
          if (image.file) {
            const formData = new FormData();
            formData.append("file", image.file);

            const uploadResponse = await axios.post(
                "http://localhost:8080/admin/variation/images/upload",
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );

            uploadedImages.push(uploadResponse.data.urls[0]);
          }
        }

        const imageRequests = uploadedImages.map((imageUrl, index) => ({
          productID: this.product.id,
          model: "Product",
          cd_Images: imageUrl,
          set_Default: index === this.defaultImageIndex
        }));

        await axios.post(
            "http://localhost:8080/admin/variation/images/setproduct",
            imageRequests,
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        this.$router.push("/product");
      } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
      }
    },

    async addProduct() {
      const token = Cookies.get("token");
      if (!token) return this.$router.push("/login");
      if (!this.validateForm()) return;

      try {
        const productResponse = await axios.post(
            "http://localhost:8080/admin/product/saved",
            this.product,
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        const productId = productResponse.data.id;

        const uploadedImages = [];

        for (const image of this.images) {
          if (image.file) {
            const formData = new FormData();
            formData.append("file", image.file);

            const uploadResponse = await axios.post(
                "http://localhost:8080/admin/variation/images/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            uploadedImages.push(...uploadResponse.data.urls);
          }
        }

        const imageRequests = uploadedImages.map((imageUrl, index) => ({
          productID: productId,
          model: "Product",
          cd_Images: imageUrl,
          set_Default: index === this.defaultImageIndex
        }));

        await axios.post(
            "http://localhost:8080/admin/variation/images/setproduct",
            imageRequests,
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        this.$router.push("/product");
      } catch (error) {
        console.error("Lỗi:", error);
      }
    }
  }
};
</script>

<style>

input[type="file"] {
  appearance: none;
  background-color: #f0f0f0;
  color: #333;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

input[type="file"]:hover {
  background-color: #e4e4e4;
}

input[type="file"]::file-selector-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-right: 10px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

input[type="file"]::file-selector-button:hover {
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
  font-size: 14px;
}

.image-preview-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.image-preview-wrapper img {
  max-width: 80px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.radio-label {
  font-size: 14px;
  margin-left: 10px;
  color: #555;
}

.product-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
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
