<div class="middle-sidebar-bottom">
  <div class="middle-sidebar-left">
    <div class="card shadow-xss rounded-xxl border-0 mb-3 mt-3">

      <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
        <h4 class="font-xs text-white fw-600 mb-0">Perfil Público</h4>
      </div>

      <div class="card-body pt-0 ps-4 pe-4 pb-3">
        <form class="app-form row g-3 needs-validation"
              method="post"
              action="<?= base_url('portal/profile/save'); ?>"
              enctype="multipart/form-data"
              novalidate>

          <!-- Nombre -->
          <div class="col-md-6">
            <label class="form-label">Nombre completo</label>
            <input type="text" name="full_name" class="form-control" required
                   value="<?= @$profile['full_name']; ?>">
          </div>

          <!-- Email -->
          <div class="col-md-6">
            <label class="form-label">Correo</label>
            <input type="email" name="email" class="form-control" required
                   value="<?= @$profile['email']; ?>">
          </div>

          <!-- Teléfono -->
          <div class="col-md-6">
            <label class="form-label">Teléfono</label>
            <input type="text" name="phone" class="form-control"
                   value="<?= @$profile['phone']; ?>">
          </div>

          <!-- Ocupación -->
          <div class="col-md-6">
            <label class="form-label">Ocupación</label>
            <input type="text" name="occupation" class="form-control"
                   value="<?= @$profile['occupation']; ?>">
          </div>

          <!-- Ubicación -->
          <div class="col-md-6">
            <label class="form-label">Ubicación</label>
            <input type="text" name="location" class="form-control"
                   value="<?= @$profile['location']; ?>">
          </div>

          <!-- Sitio web -->
          <div class="col-md-6">
            <label class="form-label">Sitio web</label>
            <input type="url" name="website" class="form-control"
                   value="<?= @$profile['website']; ?>">
          </div>

          <!-- Bio -->
          <div class="col-md-12">
            <label class="form-label">Biografía</label>
            <textarea name="bio" class="form-control" rows="4"><?= @$profile['bio']; ?></textarea>
          </div>

          <!-- Estado -->
          <div class="col-md-4">
            <label class="form-label">Visibilidad</label>
            <select name="status" class="form-control">
              <option value="active" <?= @$profile['status']=='active'?'selected':''; ?>>Público</option>
              <option value="draft" <?= @$profile['status']=='draft'?'selected':''; ?>>Privado</option>
              <option value="inactive" <?= @$profile['status']=='inactive'?'selected':''; ?>>Desactivado</option>
            </select>
          </div>

          <!-- Galería -->
          <div class="col-md-12">
            <h5 class="mt-3">Galería (máx 6)</h5>
            <input type="file" name="gallery[]" multiple accept="image/*" class="form-control">
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
