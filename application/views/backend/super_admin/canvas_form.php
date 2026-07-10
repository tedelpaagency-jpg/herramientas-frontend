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
                                        Formulario de Canvas
                                    </h2>
                                </div>
                            </div>
                           
                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Formulario</h4>
                                </div>
                                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                    <form method="post" action="<?php echo base_url('portal/canvas_form/saveCanvas/'); ?>" enctype="multipart/form-data">
                                        <input type="hidden" name="id" value="<?= $canva['id']; ?>" />
                                        <input type="hidden" name="user_id" value="<?= isset($canva) ? $canva['id']:$this->session->userdata('login_user_id'); ?>">
                                        <div class="col-sm-12 ">
                                            <div class="avatar-upload">
                                                <div class="avatar-edit">
                                                    <input type="file" name="photo" id="imageUpload" accept=".png">
                                                    <label for="imageUpload"></label>
                                                </div>
                                                <div class="avatar-preview" style="border: 2px solid #198cff8f;">
                                                    <div id="imagePreview" style="background-image: url(<?php echo $this->crud_model->getPhotoCanvas('canvas', $canva['id']); ?>);">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="name">Nombres</label>
                                                <input type="text" class="form-control" id="name" name="name" value="<?php echo isset($canva) ? $canva['name']: ''; ?>">
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="name">Mensaje</label>
                                                <input type="text" class="form-control" id="message" name="message" value="<?php echo isset($canva) ? $canva['message']  : ''; ?>">
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="name">Link</label>
                                                <input type="text" class="form-control" id="link" name="link" value="<?php echo isset($canva) ? $canva['link']: ''; ?>">
                                            </div>
                                        </div>
                                         <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="name">Fecha de publicación</label>
                                                <input type="datetime-local" class="form-control" id="date" name="date" value="<?php echo isset($canva) ? $canva['datetime']  : date('Y-m-d H:i'); ?>">
                                            </div>
                                        </div>
                                        <div class="card-body d-flex align-items-center  p-4">
                                            <h4 class="fw-700 mb-0 font-xssss text-grey-900">Paises</h4>
                                        </div>
                                         <div class="col-md-12 mb-2 border-top pb-2 row">
                                        <?php foreach($paises as $r): ?>
                                           
                                                <div class="col-md-6 mb-2 border-bottom pb-2 row">
                                                    <div class="form-check">
                                                        <input class="form-check-input"
                                                               type="checkbox"
                                                               name="paises[<?php echo $r->id; ?>][enabled]"
                                                               value="1"
                                                               <?= isset($assigned[$r->id]) ? 'checked' : '' ?>>
                                    
                                                        <label class="form-check-label fw-600">
                                                            <?php echo $r->nombre; ?>
                                                        </label>
                                                    </div>
                                                </div>
                                            
                                        <?php endforeach; ?>
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