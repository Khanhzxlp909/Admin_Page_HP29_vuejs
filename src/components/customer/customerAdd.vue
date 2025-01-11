<template>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Tạo mới khách hàng</h3>
            <div class="tile-body">
              <form @submit.prevent="submitForm">
                <div class="form-group col-md-4">
                  <label for="customerId" class="control-label">ID khách hàng</label>
                  <input v-model="customer.id" class="form-control" type="text" id="customerId" disabled />
                </div>
                <div class="form-group col-md-4">
                  <label for="customerName" class="control-label">Họ và tên</label>
                  <input v-model="customer.name" class="form-control" type="text" id="customerName" required />
                </div>
                <div class="form-group col-md-4">
                  <label for="customerAddress" class="control-label">Địa chỉ</label>
                  <input v-model="customer.address" class="form-control" type="text" id="customerAddress" required />
                </div>
                <div class="form-group col-md-4">
                  <label for="customerPhone" class="control-label">Số điện thoại</label>
                  <input v-model="customer.phone" class="form-control" type="number" id="customerPhone" required />
                </div>
                <div class="form-group col-md-4">
                  <label for="customerNote" class="control-label">Ghi chú</label>
                  <input v-model="customer.note" class="form-control" type="text" id="customerNote" required />
                </div>
                <div class="form-group col-md-4">
                  <label for="customerStatus" class="control-label">Trạng thái</label>
                  <select v-model="customer.status" class="form-control" id="customerStatus" required>
                    <option value="true">Hoạt động</option>
                    <option value="false">Không hoạt động</option>
                  </select>
                </div>
                <div class="form-group col-md-4">
                  <label for="creationDate" class="control-label">Ngày tạo</label>
                  <input v-model="customer.creation_date" class="form-control" type="date" id="creationDate" disabled />
                </div>
                <div class="form-group col-md-4">
                  <label for="editDate" class="control-label">Ngày chỉnh sửa</label>
                  <input v-model="customer.edit_date" class="form-control" type="date" id="editDate" disabled />
                </div>
  
                <div class="form-group col-md-12">
                  <label for="imageUpload" class="control-label">Ảnh khách hàng</label>
                  <div id="myfileupload">
                    <input type="file" id="uploadfile" name="ImageUpload" @change="handleFileUpload" />
                  </div>
                  <div v-if="imagePreview" id="thumbbox">
                    <img :src="imagePreview" height="300" width="300" alt="Thumb image" id="thumbimage" />
                    <a @click="removeImage" class="removeimg" href="javascript:void(0)"></a>
                  </div>
                  <div id="boxchoice">
                    <a href="javascript:void(0)" class="Choicefile"><i class="bx bx-upload"></i></a>
                  </div>
                </div>
  
                <button class="btn btn-save" type="submit">Lưu lại</button>
                <a class="btn btn-cancel" href="/doc/table-data-table.html">Hủy bỏ</a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        customer: {
          id: null,
          name: '',
          address: '',
          phone: '',
          note: '',
          status: true,
          creation_date: new Date().toISOString().split('T')[0], // Set default to current date
          edit_date: null,
        },
        imagePreview: null,
      };
    },
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      removeImage() {
        this.imagePreview = null;
        this.$refs.uploadfile.value = ''; // Reset file input
      },
      submitForm() {
        // Add your submit logic here (e.g., send the data to API)
        console.log('Customer Data:', this.customer);
        // Example: axios.post('/api/customers', this.customer)
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add custom styles if necessary */
  .container {
    padding: 20px;
  }
  </style>
  