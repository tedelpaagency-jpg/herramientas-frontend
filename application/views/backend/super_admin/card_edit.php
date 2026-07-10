<div class="middle-sidebar-bottom">
  <div class="middle-sidebar-left">
    <div class="card shadow-xss rounded-xxl border-0 mb-3 mt-3">

      <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
        <h4 class="font-xs text-white fw-600 mb-0">Perfil Público <?= $user_id; ?></h4>
      </div>

      <div class="card-body pt-0 ps-4 pe-4 pb-3">
        <form class="app-form row g-3 needs-validation"
              method="post"
              action="<?= base_url('portal/card_edit/save'); ?>"
              enctype="multipart/form-data"
              novalidate>
        <?php $profile = $this->db->get_where('user_profile',['id'=>$user_id])->row_array(); ?>
        <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Usuario</label>
              <select class="form-select select2" name="user_id"  style="width:100%">
                <option value="">Seleccionar</option>
                <?php $users = $this->db->where('status',1)->get('user')->result(); ?>
                <?php foreach ($users as $user): ?>
                  <option value="<?= $user->user_id; ?>" <?= (isset($profile['user_id']) && $profile['user_id']==$user->user_id) ? 'selected':''; ?>>
                    <?= $user->name.' '.$user->last_name.'('.$user->phone.')'; ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>
          
          <!-- Botón -->
          <div class="col-md-12 text-end">
            <button type="submit" class="btn btn-primary text-white">
              Guardar perfil
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</div>
