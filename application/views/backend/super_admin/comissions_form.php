<style>
    .avatar-upload {
  position: relative;
  max-width: 205px;
  margin: 0px;
  padding-top:20px;
  padding-bottom:20px;
  left: 35%;
}
.avatar-upload .avatar-edit {
    position: absolute;
    right: 76px;
    z-index: 1;
    top: 13px;
}
.avatar-upload .avatar-edit input {
  display: none;
}
.avatar-upload .avatar-edit input + label {
  display: inline-block;
  width: 25px;
  height: 25px;
  margin-bottom: 0;
  border-radius: 100%;
  background: #ff5656eb;
  border: 1px solid transparent;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  font-weight: normal;
  transition: all 0.2s ease-in-out;
}
.avatar-upload .avatar-edit input + label:hover {
  background: #ff5656eb;
  border-color: #d6d6d6;
}
.avatar-upload .avatar-edit input + label:after {
  content: "\f040";
  font-family: 'FontAwesome';
  color: #fff;
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  text-align: center;
  margin: auto;
}
.avatar-upload .avatar-preview {
  width: 220px;
  height: 240px;
  position: relative;
  border: 5px solid #e2e1e1;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
}
.avatar-upload .avatar-preview > div {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

</style>
<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <a href="javascript:history.back()" class="me-3 text-grey-900">
                                        <i class="fa-solid fa-arrow-left font-md"></i>
                                    </a>
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">
                                        Comisión
                                    </h2>
                                </div>
                            </div>
                           
                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Formulario</h4>
                                </div>
                                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                    <form method="post" action="<?php echo base_url('portal/comissions/saveComission/'); ?>" enctype="multipart/form-data">
                                        <input type="hidden" name="id" value="<?= $canva['id']; ?>" />
                                        <div class="col-12">
                                            <div class="mb-3">
                                              <label class="form-label">Usuario</label>
                                              <select class="form-select select2" name="user_id" style="width:100%">
                                                <option value="">Seleccionar</option>
                                                <?php $users = $this->db->where('status',1)->get('user')->result(); ?>
                                                <?php foreach ($users as $user): ?>
                                                  <option value="<?= $user->user_id; ?>" <?= (isset($task->user_id) && $task->user_id==$user->user_id) ? 'selected':''; ?>>
                                                    <?= $user->name.' '.$user->last_name.'('.$user->phone.')'; ?>
                                                  </option>
                                                <?php endforeach; ?>
                                              </select>
                                            </div>
                                          </div>
                                          <div class="col-12">
                                            <div class="mb-3">
                                              <label class="form-label">Tipo de Transacción</label>
                                              <select class="form-select select2" name="type" style="width:100%">
                                                <option value="">Seleccionar</option>
                                                  <option value="1" <?= (isset($canva) && $canva['type']==1) ? 'selected':''; ?>>
                                                   Ingreso
                                                  </option>
                                                  <option value="0" <?= (isset($canva) && $canva['type']==0) ? 'selected':''; ?>>
                                                   Egreso
                                                  </option>
                                               
                                              </select>
                                            </div>
                                          </div>
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="name">Monto</label>
                                                <input type="text" class="form-control" id="name" name="amount" value="<?php echo isset($canva) ? $canva['name']: ''; ?>">
                                            </div>
                                        </div>
                                        <div class="col-sm-12 ">
                                            <label class="form-label">Comprobante</label>
                                            <div class="avatar-upload">
                                                <div class="avatar-edit">
                                                    <input type="file" name="voucher" id="imageUpload" accept=".png, .jpg, .jpeg">
                                                    <label for="imageUpload"></label>
                                                </div>
                                                <div class="avatar-preview" style="border: 2px solid #198cff8f;">
                                                    <div id="imagePreview" style="background-image: url(<?php echo $this->crud_model->getPhotoCanvas('canvas', $canva['id']); ?>);">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary text-white">Guardar</button>
                                     </form>
                                </div>
                            </div>
                        </div>               
                    </div>
                </div>
                 
            </div>

<script>
    function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload").change(function() {
    readURL(this);
});
</script>