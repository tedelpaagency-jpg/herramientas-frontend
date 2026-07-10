<style>
.cursor-pointer {
    cursor: pointer;
}
.curso-item.active {
    background-color: #007bff;
    color: white;
}
</style>
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <!-- Start here.... -->
        <div class="row">
            <div class="col-lg-12">
                <div class="card card-height-100">
                    <div class="row">
                        <!-- Barra lateral izquierda -->
                        <div class="col-md-3 border-end " style="max-height: 600px; overflow-y: auto; padding-right: 0px;">
                            <ul class="list-group" id="lista-cursos" >
                                <?php
                                $user_id    = $this->session->userdata('login_user_id');
                                
                                $this->db->select('iframes.id, iframes.titulo, iframes.url');
                                $this->db->from('iframes');
                                $this->db->join('user_iframes', 'user_iframes.iframe_id = iframes.id');
                                $this->db->where('user_iframes.user_id', $user_id);
                                $this->db->order_by('iframes.titulo', 'ASC');
                                $query = $this->db->get();
                                $iframes = $query->result();
        
                                $primera_url = '';
                                foreach ($iframes as $index => $iframe) {
                                    if ($index === 0) {
                                        $primera_url = $iframe->url;
                                    }
                                    echo '<li class="list-group-item cursor-pointer enlace-curso" data-url="' . htmlspecialchars($iframe->url) . '">' . htmlspecialchars($iframe->titulo) . '</li>';
                                }
                                ?>
                            </ul>
                        </div>
    
                        <!-- Contenido derecho -->
                        <div class="col-md-9 p-3">
                            <div id="contenedor-iframe" class="w-100" style="min-height: 500px;">
                                 <iframe id="iframe-curso" src="<?= htmlspecialchars($primera_url) ?>" width="100%" height="600" frameborder="0" allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> <!-- end row-->
    </div>
</div>
<!-- End Container Fluid -->

<!-- Script para cambiar el iframe -->
<script>
    $(document).ready(function () {
        // Agrega la clase active al primer elemento al cargar
        $('#lista-cursos .list-group-item').first().addClass('active');

        $('.enlace-curso').on('click', function () {
            var url = $(this).data('url');
            $('#iframe-curso').attr('src', url);

            // Quita la clase active de todos y la agrega al seleccionado
            $('.enlace-curso').removeClass('active');
            $(this).addClass('active');
        });
    });
</script>


