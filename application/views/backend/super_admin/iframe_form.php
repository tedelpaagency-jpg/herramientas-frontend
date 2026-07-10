<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<?php 
    if(isset($param2))
    $user = $this->db->get_where('iframes',array('id'=>$param2))->row();
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
<form method="post" action="<?php echo  base_url('portal/iframes/saveIframe')  ?>" enctype="multipart/form-data">
<div class="modal-header">
    <h5 class="modal-title" id="exampleModalLabel"><?php echo isset($user) ? 'Actualizar ' : 'Agregar '; ?></h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
 
     <input type="hidden" name="id" value="<?= $param2; ?>" >
    <div class="modal-body row" style="padding:20px;">
        <div class="col-md-12">
            <div class="form-group">
                <label for="name">Nombre</label>
                <input type="text" class="form-control" id="name" name="titulo" value="<?php echo isset($user) ? $user->titulo : ''; ?>">
            </div>
        </div>
         <div class="col-md-12">
            <div class="form-group">
                <label for="name">Nombre</label>
                <textarea type="text" class="form-control" id="name" name="descripcion" ><?php echo isset($user) ? $user->descripcion : ''; ?></textarea
            </div>
        </div>
         <div class="col-md-12">
            <div class="form-group">
                <label for="name">Url</label>
                <input type="text" class="form-control" id="url" name="url" value="<?php echo isset($user) ? $user->url : ''; ?>">
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