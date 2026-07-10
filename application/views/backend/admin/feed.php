<style>
    /* Definición de colores según el PDF */
    :root {
        --color-primary: #ff6000; /* Naranja ZIIGO - Energía */
        --color-dark: #303030;    /* Gris Oscuro - Elegancia/Contraste */
        --width: 690px;
        --height: 390px;
    }

    /* Estilos base para la sección con dimensiones exactas */
    .game-ad-section {
        width: 100%;
        height: var(--height);
        min-height: var(--height);
        color: white;
        font-family: 'Inter', sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
        position: relative;
        overflow: hidden;
        text-align: center;
        
        /* --- FONDO INSPIRADO EN CONFETI/CELEBRACIÓN --- */
        /* Usamos un degradado oscuro con patrón de "estrellas" para simular luces o ambiente de fiesta. */
        background-color: var(--color-dark);
        background-image: radial-gradient(circle at center, rgba(60, 60, 60, 1) 0%, rgba(10, 10, 10, 1) 100%);
    }
    
    /* Capa de superposición para añadir un efecto de destello de lotería (estrellas/brillo) */
    .game-ad-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /* Patrón de brillo/confeti sutil */
        background: 
            /* Estrellas/destellos pequeños */
            radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.2) 1px, transparent 0),
            radial-gradient(circle at 90% 80%, rgba(255, 96, 0, 0.2) 1px, transparent 0),
            /* Gradiente suave de luz naranja que entra por arriba */
            linear-gradient(to bottom, rgba(255, 96, 0, 0.1) 0%, transparent 50%);
        
        pointer-events: none;
    }

    /* Ruleta central - Usamos un SVG como imagen de fondo estilizada */
    .game-ad-section::after {
        content: '';
        position: absolute;
        width: 300px; /* Tamaño de la ruleta */
        height: 300px;
        bottom: -50px;
        right: -50px;
        opacity: 0.2; /* Sutil y de fondo */
        z-index: 5;
        /* Usamos una imagen que simula una ruleta (Placeholder de alta emoción) */
        background-image: url('data:image/jpeg;base64,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');
        background-size: cover;
        background-position: center;
        transform: rotate(15deg); /* Ligera inclinación dramática */
        border-radius: 50%; /* Asegura forma circular si el placeholder lo permite */
    }


    /* Contenedor del contenido para que esté por encima de la capa de fondo */
    .content-wrapper {
        position: relative;
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        width: 100%;
        height: 100%;
    }

    /* Animación para el botón palpitante (corazón del diseño) */
    @keyframes pulse-button {
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 96, 0, 0.7);
        }
        70% {
            transform: scale(1.08); /* Palpitación más notoria */
            box-shadow: 0 0 0 20px rgba(255, 96, 0, 0);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 96, 0, 0);
        }
    }

    .btn-pulsating {
        background-color: var(--color-primary);
        animation: pulse-button 1.5s infinite; /* Pulso más rápido e intenso */
        transition: background-color 0.3s ease;
    }

    .btn-pulsating:hover {
        background-color: #e65600; 
        animation-play-state: paused; 
    }
    
    /* Estilo para el texto de la agencia (la variable) */
    .agency-name {
        color: white; /* Cambiamos a blanco para que el foco naranja esté en el título principal */
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        font-weight: 800;
    }
    
    /* Estilo para el título principal, usando el naranja ZIIGO */
    .main-title {
        color: var(--color-primary);
        text-shadow: 0 0 15px rgba(255, 96, 0, 0.9); /* Efecto neón/brillo intenso */
    }
 
     .tracking-tighter {
        letter-spacing: -0.05em;
    }   
        .font-black {
        font-weight: 900;
    }
    .uppercase {
        text-transform: uppercase;
    }
</style>
<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left">
                    <!-- loader wrapper -->
                    <div class="preloader-wrap p-3">
                        <div class="box shimmer">
                            <div class="lines">
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                            </div>
                        </div>
                        <div class="box shimmer mb-3">
                            <div class="lines">
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                            </div>
                        </div>
                        <div class="box shimmer">
                            <div class="lines">
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                            </div>
                        </div>
                    </div>
                    <!-- loader wrapper -->
                    <div class="row feed-body">
                        <div class="col-xl-12 col-xxl-12 col-lg-12">
                            
                            <div class="card w-100 shadow-none bg-transparent bg-transparent-card border-0 p-0 mb-0">
                                <div class="owl-carousel category-card owl-theme overflow-hidden nav-none">
                                    <?php 
                                        $stories = $this->db
                                            ->order_by('id','DESC')
                                            ->get_where('notice',['status'=>1,'type'=>'story'])
                                            ->result_array(); 
                                        ?>
                                        
                                        <?php foreach($stories as $story): ?>
                                        
                                            <?php
                                                $story_images = $this->db
                                                    ->order_by('id','DESC')
                                                    ->get_where('notice_image',['notice_id'=>$story['id']])
                                                    ->row_array();
                                                    
                                                if(!isset($story_images))
                                                {
                                                    continue;
                                                }
                                        
                                                $is_video = ($story_images['file_type'] === 'video');
                                                $file_url = base_url('public/uploads/notices/' . $story_images['file_name']);
                                            ?>
                                        
                                            <div class="item" onclick="showAjaxModalStories('<?= base_url(); ?>modal/popup/modal_storie/<?= $story['id']; ?>')">
                                                <div class="card w125 h200 d-block border-0 shadow-xss rounded-xxxl overflow-hidden mb-3 mt-3 position-relative">
                                        
                                                    <!-- Contenido imagen/video -->
                                                    <?php if ($is_video): ?>
                                                        <video class="w-100 h-100 position-absolute top-0 start-0 object-cover"
                                                               autoplay
                                                               muted
                                                               loop
                                                               playsinline style="border-radius: 20px;">
                                                            <source src="<?= $file_url ?>" type="video/mp4">
                                                        </video>
                                                    <?php else: ?>
                                                        <img src="<?= $file_url ?>" 
                                                             class="w-100 h-100 position-absolute top-0 start-0 object-cover">
                                                    <?php endif; ?>
                                        
                                                    <!-- Capa inferior con datos del usuario -->
                                                    <div class="card-body d-block p-3 w-100 position-absolute bottom-0 text-center bg-transparent ">
                                                        <a href="javascript:void(0)" onclick="showAjaxModalStories('<?= base_url(); ?>modal/popup/modal_storie/<?= $story['id']; ?>')" >
                                                            <figure class="avatar ms-auto me-auto mb-0 position-relative w50 z-index-1"><img src="<?php echo $this->crud_model->getPhoto('user',$story['user_id']); ?>" alt="image" class="float-right p-0 bg-white rounded-circle w-100 shadow-xss"></figure>
                                                            <div class="clearfix"></div>
                                                            <h4 class="fw-600 position-relative z-index-1 ls-1 font-xssss text-white mt-2 mb-1"><?php echo $this->crud_model->getName('user',$story['user_id']); ?></h4>
                                                        </a>
                                                    </div>
                                        
                                                </div>
                                            </div>
                                        
                                        <?php endforeach; ?>

                                </div>
                            </div>
                            
                            <div id="postContainer">
                                
                                <?php 
                                $ruleta = $this->db
                                    ->where('agency_id', $this->session->userdata('current_agency'))
                                    ->where('status', 1)
                                    ->get('agency_roulette')
                                    ->num_rows();
                                if($ruleta > 0): 
                                ?>
                                <!-- aquí se van a cargar los posts por AJAX -->
                                <div class=" w-100 shadow-xss rounded-xxl border-0  mb-3">
                                   
                                        <!-- SECCIÓN DE RULETA DE LA SUERTE CON DIMENSIONES ESPECIFICADAS -->
                                        <div class="game-ad-section">
                                            
                                            <!-- CONTENIDO PRINCIPAL ENCAPSULADO -->
                                            <div class="content-wrapper">
                                                
                                                <!-- TÍTULO DE ALTO IMPACTO (Inspirado en "GANA CON ZIIGO") -->
                                                <h1 class="main-title font-xxl font-black tracking-tighter mb-4 uppercase">
                                                    GANA CON ZIIGO
                                                </h1>
                                    
                                                <!-- TEXTO PRINCIPAL DINÁMICO (LA VARIABLE DE LA AGENCIA) -->
                                                <p class="text-2xl sm:text-3xl font-light mb-10 text-gray-200" style="text-shadow: 0 2px 5px rgba(0, 0, 0, 0.8);">
                                                    ¡Participa <span class="agency-name"><?= $this->db->get_where('agency',['id'=>$this->session->userdata('current_agency')])->row()->name; ?></span>!
                                                </p>
                                    
                                                <!-- BOTÓN PALPITANTE PARA JUGAR -->
                                                <a  href="<?= base_url(); ?>portal/getGifts"
                                                    class=" p-2 lh-20  btn-pulsating text-white font-bold text-xl  rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-opacity-50 uppercase rounded-xl " style="padding:0.5rem "
                                                >
                                                    <b>¡GIRAR y GANAR!</b>
                                                </a>
                                            </div>
                                            
                                        
                                    </div>
                                </div>
                                <?php endif; ?>
                            </div>
 

                            <div  id="loader" class="card w-100 text-center shadow-xss rounded-xxl border-0 p-4 mb-3 mt-3 ">
                                <div class="snippet mt-2 ms-auto me-auto" data-title=".dot-typing">
                                    <div class="stage">
                                        <div class="dot-typing"></div>
                                    </div>
                                </div>
                            </div>


                        </div>               
                       

                    </div>
                </div>
                
            </div>  
            