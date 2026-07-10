<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<?php 
    if(isset($param2))
    $user = $this->db->get_where('forms',array('forms_id'=>$param2))->row();
?>
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
  right: 88px;
  z-index: 1;
  top: 30px;
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
  width: 120px;
  height: 120px;
  position: relative;
  border-radius: 100%;
  border: 5px solid #e2e1e1;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
}
.avatar-upload .avatar-preview > div {
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

</style>

<div class="modal-header">
    <h5 class="modal-title" id="exampleModalLabel"><?php echo isset($user) ? 'Actualizar campaña' : 'Agregar campaña'; ?></h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
 <form method="post" action="<?php echo base_url('portal/campaign/saveForm/'); ?>" enctype="multipart/form-data">
    <input type="hidden"  name="id" value="<?= $param2; ?>">
    <input type="hidden" name="user_id" value="<?= isset($user) ? $user->user_id:$this->session->userdata('login_user_id'); ?>">
    <div class="modal-body ">
        <div class="row">
            <div class="col-sm-12 ">
                <div class="avatar-upload">
                    <div class="avatar-edit">
                        <input type="file" name="photo" id="imageUpload" accept=".png, .jpg, .jpeg">
                        <label for="imageUpload"></label>
                    </div>
                    <div class="avatar-preview" style="border: 2px solid #198cff8f;">
                        <div id="imagePreview" style="background-image: url(<?php echo $this->crud_model->getPhoto('forms',$user->forms_id); ?>);">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <div class="form-group">
                    <label for="name">Nombres</label>
                    <input type="text" class="form-control" id="name" name="name" value="<?php echo isset($user) ? $user->name : ''; ?>">
                </div>
            </div>
            <div class="col-md-12">
                <div class="form-group">
                    <label for="ticktock_video">Ticktock Video</label>
                    <input type="text" class="form-control" id="ticktock_video" name="ticktock_video" value="<?php echo isset($user) ? $user->ticktock_video : ''; ?>">
                </div>
            </div>
            <div class="col-md-12">
                <div class="form-group">
                    <label for="ticktock_video">Tipo de campaña</label>
                    <select class="form-control" name="type">
                        <option value="">Seleccionar</option>
                        <option value="1" <?php echo (isset($user) && $user->type == 1) ? 'selected' : ''; ?>>Curso</option>
                        <option value="2" <?php echo (isset($user) && $user->type == 2) ? 'selected' : ''; ?>>campaña</option>
                        <option value="3" <?php echo (isset($user) && $user->type == 3) ? 'selected' : ''; ?>>Webminar</option>
                    </select>
                </div>
            </div>
        </div>
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    <button type="submit" class="btn btn-primary"><?php echo isset($user) ? 'Actualizar ' : 'Agregar '; ?></button>
</div>
</form>
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
