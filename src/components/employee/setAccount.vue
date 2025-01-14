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
          <a class="app-nav__item" href="/">
            <i class="bx bx-log-out bx-rotate-180"></i>
          </a>
        </li>
      </ul>
    </header>

    <main class="app-content">
      <div class="app-title">
        <ul class="app-breadcrumb breadcrumb side">
          <li class="breadcrumb-item active">
            <a href="#"><b>Tạo mới khách hàng</b></a>
          </li>
        </ul>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Thông tin khách hàng</h3>
            <div class="tile-body">
              <form @submit.prevent="submitForm">
                <div class="row">
                  <div class="form-group col-md-4">
                    <label for="customerAddress">Tài khoản:</label>
                    <input
                        v-model="account.username"
                        class="form-control"
                        type="text"
                        id="customerAddress"
                        required
                    />
                  </div>

                  <div class="form-group col-md-4">
                    <label for="customerAddress">Email:</label>
                    <input
                        v-model="account.email"
                        class="form-control"
                        type="text"
                        id="customerAddress"
                        required
                    />
                  </div>
                  <div class="form-group col-md-4">
                    <label for="customerPassword">Mật khẩu:</label>
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="account.password"
                        class="form-control"
                        id="customerPassword"
                        required
                    />

                  </div>
                  <div class="form-group col-md-4">
                    <label for="customerConfirmPassword">Nhập lại mật khẩu:</label>
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="confirmPassword"
                        class="form-control"
                        id="customerConfirmPassword"
                        required
                    />
                    <input
                        type="checkbox"
                        v-model="showPassword"
                    /> Hiển thị mật khẩu
                  </div>
                </div>
                <div class="form-group">
                  <button class="btn btn-primary" type="submit">Lưu lại</button>
                  <router-link to="/" class="btn btn-secondary">Quay lại</router-link>
                </div>
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
import {useRoute} from "vue-router";

export default {
  data() {
    return {
      account: {
        id: null,
        username: "",
        email: "",
        password: "",
      },
      confirmPassword: "",
      showPassword: false,
    };
  },
  mounted() {
    // Gán accountId khi component được mount
    this.account.id = this.$route.params.id;
    console.log("Account ID:", this.account.id);
  },
  methods: {
    async submitForm() {
      if (this.account.password !== this.confirmPassword) {
        alert("Mật khẩu và nhập lại mật khẩu không khớp!");
        return;
      }
      const data = {
        usersid: this.account.id,
        username: this.account.username,
        email: this.account.email,
        password: this.account.password,
        role: [2],
      };
      console.log(data)
      const token = Cookies.get("token");
      try {
        const url = `http://localhost:8080/admin/signup`;
        await axios.post(url, data, {
          headers: {Authorization: `Bearer ${token}`},
        });
        alert("Cập nhật thông tin tài khoản thành công!");
        this.$router.push("/customer");
      } catch (error) {
        console.error("Có lỗi xảy ra khi cập nhật:", error.response?.data || error);
        alert("Cập nhật thất bại!");
      }
    }

  },
};
</script>


<style scoped>
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

.btn-secondary {
  background-color: #6c757d;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>