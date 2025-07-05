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
              <form @submit.prevent="isEditing ? updateVariation() : addVariation()" class="row">
                <div class="form-group col-md-3">
                  <label for="productName">Tên sản phẩm:</label>
                  <select id="productName" v-model="product.id" class="form-control" @change="setCategory">
                    <option v-for="item in products" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group col-md-3">
                  <label>Màu sắc</label>
                  <input type="color" id="productColor" v-model="product.color" class="form-control">
                </div>
                <div class="form-group col-md-3">
                  <label for="productWeight">Trọng lượng (KG):</label>
                  <input type="text" id="productWeight" v-model="product.weight" class="form-control"/>
                </div>
                <div class="form-group col-md-3">
                  <label for="productMaterial">Chất liệu:</label>
                  <input type="text" id="productMaterial" v-model="product.material" class="form-control"/>
                </div>
                <div class="form-group col-md-3">
                  <label for="productCategory">Danh mục:</label>
                  <input type="text" id="productCategory" v-model="product.categoryName" class="form-control" readonly/>
                </div>
                <div class="form-group col-md-3">
                  <label for="productBrand">Thương hiệu:</label>
                  <input type="text" id="productBrand" v-model="product.brandName" class="form-control" readonly/>
                </div>
                <div class="form-group col-md-3">
                  <label for="productPrice">Giá:</label>
                  <input type="number" id="productPrice" v-model="product.price" class="form-control"
                         style="width: max-content"/>
                </div>
                <div class="form-group col-md-3">
                  <label for="productQuantity">Số lượng:</label>
                  <input type="number" id="productQuantity" v-model="product.quantity" class="form-control"
                         style="width: max-content"/>
                </div>
                <div class="form-group col-md-3">
                  <button type="submit" class="btn btn-primary">{{
                      isEditing ? 'Cập nhật biến thể' : 'Thêm biến thể'
                    }}
                  </button>
                </div>
              </form>
              <div class="row element-button">
                <div class="col-sm-2">
                  <button class="btn btn-add btn-sm" @click="navigateToAddCategory" title="Thêm">
                    <i class="fas fa-plus"></i> Tạo mới danh mục
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
                    <input type="checkbox" id="all" @click="toggleAllCheckboxes"/>
                  </th>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Ảnh</th>
                  <th>Số lượng</th>
                  <th>Đã bán</th>
                  <th>Màu sắc</th>
                  <th>Kích thước</th>
                  <th>Tình trạng</th>
                  <th>Giá tiền</th>
                  <th>Danh mục</th>
                  <th>Chức năng</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="variation in variations" :key="variation.id">
                  <td width="10">
                    <input type="checkbox" v-model="variation.selected"/>
                  </td>
                  <td>{{ variation.id }}</td>
                  <td>{{ variation.productID.name }}</td>
                  <td>
                    <img :src="getDefaultImageUrl(variation.imagesDTO)" alt="" width="70px;"/>
                  </td>
                  <td>{{ variation.quantity }}</td>
                  <td>{{ variation.sold }}</td>
                  <td>
                    <div
                        :style="{ backgroundColor: variation.color, width: '30px', height: '30px', borderRadius: '4px' }"></div>
                  </td>
                  <td>{{ variation.size }}</td>
                  <td>
                    <span :class="{ 'badge bg-success': variation.status, 'badge bg-danger': !variation.status }">
                      {{ variation.status ? 'Còn hàng' : 'Hết hàng' }}
                    </span>
                  </td>
                  <td>{{ variation.price }}</td>
                  <td>{{ variation.productID.categoryID.name }}</td>
                  <td>
                    <button class="btn btn-edit" @click="editVariation(variation, variation.id)">Sửa</button>
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
                <button class="page-button" :disabled="currentPage >= totalPages - 1"
                        @click="changePage(currentPage + 1)">Next
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
      variationID: "",
      product: {
        id: "",
        name: "",
        sku: "",
        price: 0,
        quantity: 0,
        color: "",
        material: "",
        size: "",
        description: "",
        weight: "",
        status: true,
        category: "",
        brand: "",
        categoryName: "",
        brandName: ""
      },
      isEditing: false,

      id_images: [],
      images: [
        {id: "", file: null, preview: ""},
        {id: "", file: null, preview: ""},
        {id: "", file: null, preview: ""}
      ],
      defaultImageIndex: 0,
      imageUrls: [],
    };
  },
  created() {

    this.updateTime();
    this.fetchVariations(this.currentPage, this.pageSize);
    this.fetchProducts();
  },
  methods: {

    // ──────────────────────────
    // 🔁 NAVIGATION
    navigateToAddCategory() {
      this.$router.push("/category");
    },
    navigateToAddBrands() {
      this.$router.push("/brands");
    },
    navigateToAddProduct() {
      this.$router.push("/addproduct");
    },

    // ──────────────────────────
    // ✅ VALIDATION
    isEmpty(value) {
      return value == null || value.toString().trim() === "";
    },
    validateForm() {
      if (this.isEmpty(this.product.id)) return alert("Tên sản phẩm không được để trống!");
      if (this.product.id.length > 25) return alert("Tên sản phẩm không được quá 25 ký tự!");
      if (this.isEmpty(this.product.category)) return alert("Danh mục không được để trống!");
      if (this.isEmpty(this.product.price) || isNaN(this.product.price) || this.product.price <= 0)
        return alert("Giá sản phẩm phải là số lớn hơn 0!");
      if (this.isEmpty(this.product.weight) || this.product.weight.length > 25)
        return alert("Trọng lượng không hợp lệ!");
      if (this.isEmpty(this.product.material) || this.product.material.length > 25)
        return alert("Chất liệu không hợp lệ!");
      return true;
    },

    // ──────────────────────────
    // ✏️ FORM LOGIC

    async addVariation() {
      const token = Cookies.get("token");
      if (!token) return this.$router.push("/login");
      if (!this.validateForm()) return;

      const data = {
        name: this.product.name,
        sku: this.product.sku,
        price: this.product.price,
        quantity: this.product.quantity,
        color: this.product.color,
        material: this.product.material,
        size: this.product.size,
        description: this.product.description,
        weight: this.product.weight,
        status: false,
        productID: {
          id: this.product.id,
          categoryID: {
            id: this.product.category
          },
          brandID: {
            id: this.product.brand
          }
        }
      };

      try {
        // Step 1: Create variation
        const variationResponse = await axios.post("http://localhost:8080/admin/variation/add", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const variationId = variationResponse.data.id;
        const uploadedImages = [];

        // Step 2: Upload images
        for (const image of this.images) {
          if (image.file) {
            const formData = new FormData();
            formData.append("file", image.file);

            const uploadResponse = await axios.post(
                "http://localhost:8080/admin/variation/images/upload",
                formData,
                {headers: {"Content-Type": "multipart/form-data"}}
            );

            uploadedImages.push(...uploadResponse.data.urls);
          }
        }

        // Step 3: Set images to variation
        const imageRequests = uploadedImages.map((imageUrl, index) => ({
          productID: variationId,
          model: "Variation",
          cd_Images: imageUrl,
          set_Default: index === this.defaultImageIndex
        }));

        await axios.post(
            "http://localhost:8080/admin/variation/images/setproduct",
            imageRequests,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
        );

        alert("Thêm biến thể thành công!");
        this.fetchVariations(this.currentPage, this.pageSize);
      } catch (err) {
        console.error("Add variation error:", err);
        alert("Đã xảy ra lỗi khi thêm biến thể!");
      }
    },

    async updateVariation() {
      const token = Cookies.get("authToken");
      if (!token) return this.$router.push("/login");
      const data = {
        id: this.variationID,
        name: this.product.name,
        sku: this.product.sku,
        price: this.product.price,
        quantity: this.product.quantity,
        color: this.product.color,
        material: this.product.material,
        size: this.product.size,
        description: this.product.description,
        weight: this.product.weight,
        status: this.product.status,
        productID: {
          id: this.product.id,
          categoryID: {
            id: this.product.category
          },
          brandID: {
            id: this.product.brand
          }
        }
      };
      try {
        await axios.post("http://localhost:8080/admin/variation/update", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        alert("Cập nhật biến thể thành công!");
      } catch (err) {
        console.error("Update error:", err);
      }
    },

    editVariation(variation, variationID) {
      this.variationID = variationID;
      this.product.id = variation.productID.id;
      this.product.brand = variation.brandID.id;
      this.product.price = this.parsePrice(variation.price);
      this.product.quantity = variation.quantity;
      this.product.weight = variation.weight;
      this.product.material = variation.material;
      this.product.status = variation.status;
      this.product.category = variation.productID.categoryID.id;
      this.product.categoryName = variation.productID.categoryID.name;
      this.isEditing = true;
    },

    resetForm() {
      this.product = {
        id: "",
        price: 0,
        quantity: 0,
        status: true,
        category: "",
        categoryName: "",
        brand: "",
        material: "",
        weight: "",
      };
      this.isEditing = false;
    },

    // ──────────────────────────
    // 🔗 FETCHERS
    async fetchProducts() {
      const token = Cookies.get("token");
      if (!token) return this.$router.push("/login");

      try {
        const response = await axios.get("http://localhost:8080/admin/variation/getproduct");
        this.products = response.data;
      } catch (error) {
        console.error("Lỗi khi fetch products:", error);
        alert("Không thể tải danh sách sản phẩm.");
      }
    },

    fetchVariations(page = 0, size = 10) {
      axios
          .get(`http://localhost:8080/admin/variation/result/all?page=${page}&size=${size}`)
          .then((response) => {
            this.variations = response.data.content;
            this.totalPages = response.data.page.totalPages;
          })
          .catch((error) => {
            console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm:", error);
          });
    },

    // ──────────────────────────
    // 🛠 UTILITIES
    getDefaultImageUrl(imagesDTOS) {
      const defaultImage = imagesDTOS?.find(img => img.set_Default);
      return defaultImage
          ? `http://localhost:8080/upload/images/${defaultImage.cd_Images}`
          : "/img/default.jpg";
    },

    parsePrice(priceString) {
      return parseFloat(priceString.replace(/\./g, '').replace(' ₫', ''));
    },

    confirmDelete(variation) {
      if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${variation.productID.name}"?`)) {
        this.deleteProduct(variation.id);
      }
    },

    deleteProduct(productId) {
      const token = Cookies.get("token");
      if (!token) return alert("Token không hợp lệ hoặc không tồn tại.");

      axios
          .get(`http://localhost:8080/admin/variation/delete/${productId}`, {
            headers: {Authorization: `Bearer ${token}`},
          })
          .then(() => this.fetchVariations(this.currentPage, this.pageSize))
          .catch((error) => console.error("Có lỗi xảy ra khi xóa sản phẩm:", error));
    },

    changePage(page) {
      this.currentPage = page;
      this.fetchVariations(page, this.pageSize);
    },

    toggleAllCheckboxes() {
      const allChecked = this.variations.every((v) => v.selected);
      this.variations.forEach((v) => (v.selected = !allChecked));
    },

    setCategory() {
      const selectedProduct = this.products.find(p => p.id === this.product.id);
      this.product.category = selectedProduct?.categoryID.id || "";
      this.product.categoryName = selectedProduct?.categoryID.name || "";
    },

    updateTime() {
      const today = new Date();
      const options = {
        weekday: "long", year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      };
      this.currentTime = today.toLocaleDateString("vi-VN", options);
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