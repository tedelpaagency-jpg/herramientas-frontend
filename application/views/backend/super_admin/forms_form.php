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
<form method="post"
      action="<?= base_url('portal/campaign/saveForm'); ?>"
      enctype="multipart/form-data">

<div class="modal-header">
    <h5 class="modal-title">
        <?= isset($user) ? 'Actualizar campaña' : 'Agregar campaña'; ?>
    </h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
</div>

<input type="hidden" name="id" value="<?= $param2; ?>">
<input type="hidden" name="user_id"
       value="<?= isset($user) ? $user->user_id : $this->session->userdata('login_user_id'); ?>">

<div class="modal-body">
    <div class="row">

        <div class="col-md-12 mb-3">
            <label>Tipo de video</label>
            <select class="form-control" id="video_type" name="video_type">
                <option value="">Seleccionar</option>
                <option value="tiktok" <?= isset($user) && $user->video_type == 'tiktok' ? 'selected' : ''; ?>>
                    TikTok
                </option>
                <option value="local" <?= isset($user) && $user->video_type == 'local' ? 'selected' : ''; ?>>
                    Video local
                </option>
            </select>
        </div>

        <!-- TIKTOK -->
        <div class="col-md-12 mb-3" id="tiktok_box" style="display:none;">
            <label for="ticktock_video">URL TikTok</label>
            <input type="text"
                   class="form-control"
                   name="ticktock_video"
                   value="<?= isset($user) ? $user->ticktock_video : ''; ?>">
        </div>

        <!-- VIDEO LOCAL -->
        <div class="col-md-12 mb-3" id="local_box" style="display:none;">
            <label>Subir video</label>
            <input type="file"
                   class="form-control"
                   name="local_video"
                   accept="video/*"
                   id="local_video">

           <video id="video_preview"
       controls
       playsinline
       preload="auto"
       style="width:100%; height:240px; object-fit:cover; display:none; border-radius:10px;">
</video>

        </div>

        <div class="col-md-12">
            <label for="name">Nombre</label>
            <input type="text"
                   class="form-control"
                   name="name"
                   value="<?= isset($user) ? $user->name : ''; ?>">
        </div>

    </div>
</div>

<div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
        Cerrar
    </button>
    <button type="submit" class="btn btn-primary">
        <?= isset($user) ? 'Actualizar' : 'Agregar'; ?>
    </button>
</div>
</form>

<script>
$(document).on('change', '#video_type', function(){
    const type = $('#video_type').val();
    console.log(type);
    $('#tiktok_box').hide();
    $('#local_box').hide();

    if (type === 'tiktok') {
        $('#tiktok_box').show();
    }

    if (type === 'local') {
        $('#local_box').show();
    }
});

$(document).on('change', '#local_video', function () {
    const file = this.files[0];
    if (!file) return;

    const video = document.getElementById('video_preview');
    video.src = URL.createObjectURL(file);
    video.load();
    video.style.display = 'block';
});
// si es edición
$(document).ready(function () {
    $('#video_type').change();
});

</script>
