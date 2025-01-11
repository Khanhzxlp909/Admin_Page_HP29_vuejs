<template>
  <div class="product-edit">
    <h1>Chỉnh sửa sản phẩm</h1>
    <form @submit.prevent="submitEditProduct">
      <div>
        <label for="name">Tên sản phẩm</label>
        <input type="text" v-model="product.name" id="name" required />
      </div>
      <div>
        <label for="quantity">Số lượng</label>
        <input
          type="number"
          v-model="product.quantity"
          id="quantity"
          required
        />
      </div>
      <div>
        <label for="price">Giá tiền</label>
        <input type="number" v-model="product.price" id="price" required />
      </div>
      <div>
        <label for="status">Tình trạng</label>
        <input type="checkbox" v-model="product.status" id="status" />
      </div>
      <div>
        <label for="category">Danh mục</label>
        <input type="text" v-model="product.category" id="category" required />
      </div>
      <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  props: ["id"], // Nhận id từ route params
  data() {
    return {
      product: {
        id: "",
        name: "",
        quantity: "",
        price: "",
        status: true,
        category: "",
      },
    };
  },
  methods: {
    fetchProductDetails() {
      const productId = this.id;
      axios
        .get(`http://localhost:8080/admin/variation/detail/${productId}`)
        .then((response) => {
          this.product = response.data;
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi lấy chi tiết sản phẩm:", error);
        });
    },
    submitEditProduct() {
      const token = Cookies.get("token");
      if (!token) {
        alert("Token không hợp lệ hoặc không tồn tại.");
        return;
      }

      axios
        .put(
          `http://localhost:8080/admin/variation/update/${this.product.id}`,
          this.product,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          this.$router.push({ name: "ProductList" });
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi sửa sản phẩm:", error);
        });
    },
  },
  created() {
    this.fetchProductDetails();
  },
};
</script>
