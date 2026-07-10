<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<?php 
    if(isset($param2))
    $user = $this->db->get_where('user',array('user_id'=>$param2))->row();
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
<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" aria-label="Close" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel"><?php echo isset($user) ? 'Actualizar usuario' : 'Agregar usuario'; ?></h4>    
    </div>
    
</div>
 <form id="userForm" method="post" action="<?php echo base_url('portal/users/save/'); ?>" enctype="multipart/form-data">
     <input type="hidden" name="rol_id" value="<?= $param3; ?>" />
     <input type="hidden" name="agency_id" value="<?= $param4; ?>" />
<div class="modal-body row">
        <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Información</h4>
        <div class="col-sm-6 ">
            <div class="avatar-upload">
                <div class="avatar-edit">
                    <input type="file" name="photo" id="imageUpload" accept=".png, .jpg, .jpeg">
                    <label for="imageUpload"></label>
                </div>
                <div class="avatar-preview" style="border: 2px solid #198cff8f;">
                    <div id="imagePreview" style="background-image: url(<?php echo $this->crud_model->getPhoto('user',$user->user_id); ?>);">
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="col-md-12">
                <div class="form-group">
                    <label for="name" class="mont-font fw-600 font-xsss">Nombres</label>
                    <input type="text" class="form-control" id="name" name="name" value="<?php echo isset($user) ? $user->name : ''; ?>">
                </div>
            </div>
            <div class="col-md-12">
                <div class="form-group">
                    <label for="last_name" class="mont-font fw-600 font-xsss">Apellidos</label>
                    <input type="text" class="form-control" id="last_name" name="last_name" value="<?php echo isset($user) ? $user->last_name : ''; ?>">
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <div class="form-group">
                <label for="ruc" class="mont-font fw-600 font-xsss">RUC</label>
                <input type="text" class="form-control" id="ruc" name="ruc" value="<?php echo isset($user) ? $user->ruc : ''; ?>">
            </div>
        </div>
        <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Credenciales</h4>
        <div class="col-md-6">
            <div class="form-group">
                <label for="username" class="mont-font fw-600 font-xsss">Nombre de Usuario</label>
                <input type="text" class="form-control" id="username" name="username" value="<?php echo isset($user) ? $user->username : ''; ?>" autocomplete="off">
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group position-relative">
                <label class="mont-font fw-600 font-xsss">Contraseña</label>
                <input type="password" class="form-control toggle-password" name="password" autocomplete="off">
                <span class="password-toggle">
                    <i class="fa fa-eye"></i>
                </span>
            </div>
        </div>
        <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Contáctos</h4>
        <div class="col-md-6">
            <div class="form-group">
                <label for="phone" class="mont-font fw-600 font-xsss">Numero de telefono</label>
                <input type="number" class="form-control" id="phone" name="phone" value="<?php echo isset($user) ? $user->phone : ''; ?>">
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <label for="email" class="mont-font fw-600 font-xsss">Correo Electronico</label>
                <input type="email" class="form-control" id="email" name="email" value="<?php echo isset($user) ? $user->email : ''; ?>">
            </div>
        </div>
        <div class="col-md-12">
            <div class="form-group mb-3">
                <label for="email" class="mont-font fw-600 font-xsss">Dirección</label>
                <select id="pais" class="form-control mb-3" name="pais" required="">
                    <option value="">Selecciona un país</option>
                </select>
                <br>
                <textarea class="form-control" id="email" name="address" rows="3" required=""></textarea>
            </div>
        </div>
        <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Equipo</h4>
        <div class="col-md-12">
            <div class="form-group mb-3">
                <label for="phone" class="mont-font fw-600 font-xsss">Equipo</label>
                <select class="form-control" data-choices name="company_id" id="choices-single-default">
                    <option value="">Seleccionar</option>
                    <?php
                        $com = $this->db->get_where('company',array('status'=>1))->result_array();
                        foreach($com as $c):
                    ?>
                            <option value="<?= $c['company_id']; ?>" <?php if(isset($user)) { echo $user->company_id == $c['company_id'] ? 'selected':''; } ?>><?= $c['name']; ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
       </div>
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
    <button type="submit" class="btn btn-primary text-center  text-white" id="btnsubmit"><?php echo isset($user) ? 'Actualizar usuario' : 'Agregar usuario'; ?></button>
</div>
</form>
<script>
    
    
     $.getJSON("<?= base_url('portal/obtener_paises'); ?>", function (data) {
        console.log(data);
        $.each(data, function (index, pais) {
            
            $("#pais").append($("<option>", { value: pais.id, text: pais.nombre }));
        });
    });

   
   
    
    
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