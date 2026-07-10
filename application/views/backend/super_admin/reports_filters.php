
            <form method="get" action="<?= site_url('report_travel') ?>">
                <div class="modal-header">
                    <h5 class="modal-title">Filtros</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label>Desde</label>
                            <input type="date" name="date_from" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label>Hasta</label>
                            <input type="date" name="date_to" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label>Estado</label>
                            <select name="status" class="form-select">
                                <option value="">Todos</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label>País</label>
                            <input type="text" name="pais_id" class="form-control">
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <a href="<?= site_url('report_travel') ?>" class="btn btn-light">Limpiar</a>
                    <button type="submit" class="btn btn-primary">Aplicar</button>
                </div>
            </form>
       