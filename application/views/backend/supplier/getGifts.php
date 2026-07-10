    <style>
        /* Fuentes y Variables */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');

        :root {
            --ziigo-primary: #ff6000; /* Naranja ZIIGO */
            --ziigo-dark: #303030;    /* Gris Oscuro ZIIGO */
            --ziigo-blue: #1a1096;    /* Azul ZIIGO (del PDF) */
            --ziigo-light: #ffffff;
            --wheel-size: 450px;
            --rim-color: #e0e0e0;     /* Color base del borde 3D */
        }

       

        .container-ruleta {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            z-index: 10;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
            overflow: hidden; 
            min-height: 70vh;
        }

        /* --- Estilos de la Ruleta (Contenedor Externo / Borde 3D) --- */
        .ruleta-wrapper {
            position: relative;
            width: var(--wheel-size);
            height: var(--wheel-size);
            border-radius: 50%;
            /* Borde grueso estilo 3D (Biselado) similar a la imagen */
            background: linear-gradient(145deg, #ffffff, #b0b0b0);
            padding: 15px; /* Grosor del borde */
            box-shadow: 
                0 20px 50px rgba(0,0,0,0.5), /* Sombra larga externa */
                inset 0 5px 10px rgba(255,255,255,0.8), /* Brillo superior interno */
                inset 0 -5px 10px rgba(0,0,0,0.3); /* Sombra inferior interna */
        }

        /* Indicador estilo "Gota" o "Pin" (como en la imagen) */
        .indicador {
            position: absolute;
            top: -25px; /* Ajustado para que superponga el borde */
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 70px;
            z-index: 100;
            filter: drop-shadow(0 5px 5px rgba(0,0,0,0.5));
        }
        
        /* Dibujo del pin usando CSS puro */
        .indicador::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle at 30% 30%, #ff8a4d, var(--ziigo-primary)); /* Naranja 3D */
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid #fff;
        }

        /* La rueda giratoria interna */
        .ruleta-inner {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            position: relative;
            border: 5px solid #fff; /* Pequeño borde blanco interno */
            box-shadow: inset 0 0 20px rgba(0,0,0,0.4); /* Sombra interna para profundidad */
            transition: transform 6s cubic-bezier(0.1, 0.99, 0.2, 1.05); /* Efecto de rebote final suave */
        }

        /* Segmentos */
        .segmento {
            position: absolute;
            top: 0;
            right: 0;
            width: 50%;
            height: 50%;
            transform-origin: 0% 100%;
            overflow: hidden;
            /* Clip-path para 12 segmentos (30 grados cada uno) */
            clip-path: polygon(0% 0%, 100% 0%, 100% 58%, 0% 100%); 
            /* Ajuste fino para 30 grados: tan(30) ~ 0.577 */
        }

        /* Colores vibrantes con degradado para efecto "glossy" (estilo profesional) */
        .segmento-bg {
            width: 100%;
            height: 100%;
            /* Degradado radial para dar volumen a cada gajo */
            background-image: radial-gradient(circle at 50% 10%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.1) 100%);
        }

        /* Asignación de colores (Paleta arcoíris + Branding) */
        

        /* Texto dentro de los segmentos */
        .segmento-contenido {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            /* Ajuste para 12 segmentos (30 grados). Centro es 15 grados. */
            transform: translateY(-100%) rotate(15deg) translateX(45px) translateY(-5px) rotate(90deg);
            transform-origin: 0 0;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left: 10px;
            font-size: 0.65rem;
            font-weight: 900;
            color: #fff;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
            text-transform: uppercase;
        }
        
        .segmento-contenido i {
            margin-right: 5px;
            font-size: 0.8rem;
        }

        /* Centro de la ruleta (Botón) - Estilo Metálico/Botón 3D */
        .ruleta-centro {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 90px;
            height: 90px;
            transform: translate(-50%, -50%);
            z-index: 50;
            border-radius: 50%;
            /* Diseño de botón con borde metálico */
            background: radial-gradient(circle at 30% 30%, #ff8a4d, var(--ziigo-primary));
            border: 6px solid #fff;
            box-shadow: 
                0 5px 15px rgba(0,0,0,0.3),
                inset 0 0 10px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .ruleta-centro:active {
            transform: translate(-50%, -50%) scale(0.95);
        }

        .ruleta-centro span {
            font-weight: 900;
            color: #fff;
            font-size: 0.9rem;
            text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }

        /* Título Principal */
        h1 {
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 4px 10px rgba(255, 96, 0, 0.4);
            margin-bottom: 10px;
            font-size: 5rem;
        }
        
        .marca-ziigo {
            color: var(--ziigo-primary);
        }

       #confetti-layer {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 999999;
            overflow: hidden;
        }
        
        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            opacity: 0.95;
            border-radius: 2px;
        
            animation-name: confettiFall;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
        }
        
        @keyframes confettiFall {
            from {
                transform: translateY(-10px) rotate(0deg);
            }
            to {
                transform: translateY(110vh) rotate(720deg);
            }
        }
        
        
        
        
        /* Modal Personalizado */
        .modal-content {
            background: #fff;
            color: #333;
            border: none;
            border-top: 10px solid var(--ziigo-primary);
            border-radius: 20px;
            text-align: center;
        }
        .modal-title {
            color: var(--ziigo-primary);
            font-weight: 900;
        }
        .premio-grande {
            font-size: 2rem;
            font-weight: 800;
            color: var(--ziigo-dark);
            margin: 20px 0;
        }
        .btn-ziigo {
            background-color: var(--ziigo-primary);
            color: white;
            font-weight: bold;
            border-radius: 50px;
            padding: 10px 30px;
            border: none;
        }
        .btn-ziigo:hover {
            background-color: #e65600;
            color: white;
        }

        /* Responsivo */
        @media (max-width: 576px) {
            :root { --wheel-size: 320px; }
            .ruleta-centro { width: 70px; height: 70px; }
            .segmento-contenido { font-size: 0.55rem; padding-left: 5px; }
            h1 { font-size: 1.5rem; }
        }
    </style>
<div class="middle-sidebar-bottom" >
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
                             <div id="confetti-layer"></div>

                            <div class="container-ruleta">
                                <h1 >Gana con <span class="marca-ziigo">ZIIGO</span></h1>
                            
                                <div class="ruleta-wrapper">
                                    <div class="indicador"></div>
                            
                                    <!-- AQUÍ VA EL SVG -->
                                   <svg id="ruleta"
                                         viewBox="0 0 100 100"
                                         width="100%"
                                         height="100%"
                                         style="border-radius:50%; transition:transform 6s cubic-bezier(.1,.99,.2,1);">
                                    
                                    <defs>
                                    <?php
                                    $total = count($premios);
                                    $angulo = 360 / $total;
                                    $inicio = 0;
                                    
                                    foreach ($premios as $i => $p):
                                        $fin = $inicio + $angulo;
                                    
                                        // arco interno solo para texto
                                        $rTexto = 34;
                                    
                                        $x1 = 50 + $rTexto * cos(deg2rad($inicio));
                                        $y1 = 50 + $rTexto * sin(deg2rad($inicio));
                                        $x2 = 50 + $rTexto * cos(deg2rad($fin));
                                        $y2 = 50 + $rTexto * sin(deg2rad($fin));
                                    
                                        $largeArc = ($angulo > 180) ? 1 : 0;
                                    ?>
                                        <path
                                            id="textPath<?= $i ?>"
                                            d="M<?= $x1 ?> <?= $y1 ?> A<?= $rTexto ?> <?= $rTexto ?> 0 <?= $largeArc ?> 1 <?= $x2 ?> <?= $y2 ?>"
                                            fill="none"
                                        />
                                    <?php
                                        $inicio = $fin;
                                    endforeach;
                                    ?>
                                    </defs>
                                    
                                    <?php
                                    $inicio = 0;
                                    $colores = ['#ffc107','#fd7e14','#ff6000','#dc3545','#6f42c1','#0d6efd'];
                                    
                                    foreach ($premios as $i => $p):
                                    
                                        $fin = $inicio + $angulo;
                                    
                                        $x1 = 50 + 50 * cos(deg2rad($inicio));
                                        $y1 = 50 + 50 * sin(deg2rad($inicio));
                                        $x2 = 50 + 50 * cos(deg2rad($fin));
                                        $y2 = 50 + 50 * sin(deg2rad($fin));
                                    
                                        $largeArc = ($angulo > 180) ? 1 : 0;
                                    ?>
                                    
                                        <!-- SEGMENTO -->
                                        <path
                                            d="
                                                M50,50
                                                L<?= $x1 ?>,<?= $y1 ?>
                                                A50,50 0 <?= $largeArc ?>,1 <?= $x2 ?>,<?= $y2 ?>
                                                Z
                                            "
                                            fill="<?= $colores[$i % count($colores)] ?>"
                                            stroke="#fff"
                                            stroke-width="0.4"
                                        />
                                    
                                        <!-- TEXTO SOBRE ARCO -->
                                        <text fill="#fff" font-size="3" font-weight="800">
                                            <textPath
                                                href="#textPath<?= $i ?>"
                                                startOffset="50%"
                                                text-anchor="middle"
                                            >
                                                <?= strtoupper($this->db->get_where('rewards',['id'=>$p->reward_id])->row()->name) ?>
                                            </textPath>
                                        </text>
                                    
                                    <?php
                                        $inicio = $fin;
                                    endforeach;
                                    ?>
                                    
                                    </svg>



                            
                                    <button id="btn-girar" class="ruleta-centro">
                                        <span>GIRAR</span>
                                    </button>
                                </div>
                            
                                <p class="text-grey-500 mt-2 small">Prueba tu suerte hoy</p>
                            </div>                                                                                  
                            <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js"></script>
                            <script>
                                
                                const totalSegmentos = <?= count($premios) ?>;
                                const anguloPorSegmento = 360 / totalSegmentos;
                                
                                
                                let rotacionActual = 0;
                                let girando = false;
                                let ultimoSegmento = null;
                                let ultimoTickTime = 0;
                                const MIN_TICK_INTERVAL = 0.03; // 30ms
                                
                                const tickSynth = new Tone.MembraneSynth({
                                    pitchDecay: 0.008,
                                    octaves: 2,
                                    envelope: {
                                        attack: 0.001,
                                        decay: 0.1,
                                        sustain: 0.01,
                                        release: 0.01
                                    }
                                }).toDestination();
                                
                                // Sintetizador metálico para el sonido de "premio"
                                const chime = new Tone.MetalSynth({
                                    frequency: 600,
                                    envelope: { attack: 0.001, decay: 0.3, sustain: 0.1, release: 0.1 },
                                    harmonicity: 3.1, modulationIndex: 10, resonance: 4000, octaves: 1.5
                                }).toDestination();

                                function detectarTick(rotacion) {

                                    const rot = ((rotacion % 360) + 360) % 360;
                                    const segmentoActual = Math.floor(rot / anguloPorSegmento);
                                    const ahora = Tone.now();
                                
                                    if (
                                        segmentoActual !== ultimoSegmento &&
                                        ahora - ultimoTickTime > MIN_TICK_INTERVAL
                                    ) {
                                        tickSynth.triggerAttackRelease("C2", "16n", ahora);
                                        ultimoSegmento = segmentoActual;
                                        ultimoTickTime = ahora;
                                    }
                                }
                                
                                const confettiContainer = document.getElementById('confetti-layer');

                                function lanzarConfeti({
                                        cantidad = 150,
                                        duracion = 5000,
                                        colores = ['#ff6000', '#1a1096', '#ffffff', '#ffd700']
                                    } = {}) {
                                    
                                        let layer = document.getElementById('confetti-layer');
                                    
                                        // Seguridad total
                                        if (!layer) {
                                            layer = document.createElement('div');
                                            layer.id = 'confetti-layer';
                                            document.body.appendChild(layer);
                                        }
                                    
                                        for (let i = 0; i < cantidad; i++) {
                                            const confetti = document.createElement('div');
                                            confetti.className = 'confetti';
                                    
                                            confetti.style.left = Math.random() * 100 + 'vw';
                                            confetti.style.top = '-10px';
                                            confetti.style.backgroundColor =
                                                colores[Math.floor(Math.random() * colores.length)];
                                    
                                            const tiempo = Math.random() * 3000 + 2000;
                                            confetti.style.animationDuration = tiempo + 'ms';
                                            confetti.style.animationDelay = (Math.random() * 500) + 'ms';
                                    
                                            layer.appendChild(confetti);
                                    
                                            setTimeout(() => confetti.remove(), duracion);
                                        }
                                    }


                                
                                // Función para el sonido de PREMIO
                                function sonarPremio() {
                                    // Tono brillante para el resultado
                                    chime.triggerAttackRelease("G4", "2n");
                                }
                                
                                function mostrarPremio(premio) {
                                     $('#premio-ganado').html(premio);
                                     $('#resultadoModal').modal('show', {
                                            backdrop: 'true'
                                        });
                                }
    
                                async function girarRuleta() {

                                    if (girando) return;
                                    girando = true;
                                
                                    if (Tone.context.state !== 'running') {
                                        await Tone.start();
                                    }
                                
                                    // 1️⃣ Pedir premio al backend
                                    const res = await fetch('<?php echo base_url(); ?>portal/girar_ruleta');
                                    const data = await res.json();
                                    
                                    console.log(data);
                                    
                                    if (data.status !== 'success') {
                                        girando = false;
                                        return;
                                    }
                                
                                    const indexGanador = data.index;
                                    const total = data.total;
                                
                                    const anguloPorSegmento = 360 / total;
                                
                                    // 2️⃣ ÁNGULO CORRECTO PARA INDICADOR ARRIBA
                                    const anguloObjetivo =
                                        270 - (indexGanador * anguloPorSegmento + anguloPorSegmento / 2);
                                
                                    // 3️⃣ DESTINO FINAL (vueltas + ajuste exacto)
                                    const vueltas = 6;
                                
                                    const destino =
                                        Math.ceil(rotacionActual / 360) * 360 +
                                        vueltas * 360 +
                                        anguloObjetivo;
                                
                                    const duracion = 6000;
                                    const inicio = performance.now();
                                
                                    ultimoSegmento = null;
                                    ultimoTickTime = 0;
                                
                                    function animar(now) {
                                        const progreso = Math.min((now - inicio) / duracion, 1);
                                        const ease = 1 - Math.pow(1 - progreso, 3);
                                
                                        const rotacion =
                                            rotacionActual + (destino - rotacionActual) * ease;
                                
                                        document.getElementById('ruleta').style.transform =
                                            `rotate(${rotacion}deg)`;
                                
                                        detectarTick(rotacion);
                                
                                        if (progreso < 1) {
                                            requestAnimationFrame(animar);
                                        } else {
                                            rotacionActual = destino;
                                            girando = false;
                                
                                            // EFECTOS FINALES
                                            sonarPremio();
                                            lanzarConfeti();
                                            mostrarPremio( data.nombre);
                                
                                            console.log('Premio:', data.nombre);
                                        }
                                    }
                                
                                    requestAnimationFrame(animar);
                                }

                                        

                                
                                document.getElementById('btn-girar').addEventListener('click', girarRuleta);
                                
                            </script>

                        </div>               
                    </div>
                </div>
                
            </div>  
            <div id="confetti-layer"></div>
