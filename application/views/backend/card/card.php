<?php $user = $this->db->get_where('user',['user_id'=>$user_id])->row_array(); ?>
<?php $user_profile = $this->db->get_where('user_profile',['user_id'=>$user_id])->row_array(); ?>
<!DOCTYPE html>
<html lang="es" class="scroll-smooth dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil de <?= $user_profile['full_name']; ?></title>
    <link rel="shortcut icon" href="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('favicon',$user['agency_id']);?>" type="image/x-icon">
    <link rel="icon" href="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('favicon',$user['agency_id']);?>" type="image/x-icon">
    <!-- Google Fonts: Plus Jakarta Sans (Tipografía Moderna) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Configuración de Tailwind para Colores, Fuentes y Efectos Personalizados -->
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'], // Fuente principal moderna
                    },
                    colors: {
                        // Paleta de azules más rica y profesional
                        primary: {
                            50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
                            400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
                            800: '#1e40af', 900: '#1e3a8a', 950: '#172554',
                        },
                        // Paleta oscura refinada (Slate)
                        dark: {
                            bg: '#0f172a', card: '#1e293b', cardHover: '#334155',
                            text: '#f1f5f9', muted: '#94a3b8'
                        }
                    },
                    boxShadow: {
                        // Sombras personalizadas para un efecto de "brillo" y profundidad premium
                        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.6)',
                        'glow-green': '0 0 20px -5px rgba(34, 197, 94, 0.5)',
                        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.04)',
                        'premium-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                    },
                    animation: {
                        // Animaciones personalizadas
                        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'shine': 'shine 2s ease-in-out infinite',
                        'float': 'float 6s ease-in-out infinite',
                    },
                    keyframes: {
                        fadeInUp: {
                            '0%': { opacity: '0', transform: 'translateY(30px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        shine: {
                            '0%': { left: '-100%' },
                            '100%': { left: '100%' },
                        },
                        float: {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-10px)' },
                        }
                    }
                }
            }
        }
    </script>

    <!-- Iconos (FontAwesome 6) -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    
    <style>
        /* Estilos base y optimizaciones */
        body {
            transition: background-color 0.4s ease, color 0.4s ease;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
        }
        
        /* Efecto Glassmorphism mejorado para el navbar */
        .glass-effect {
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            background-color: rgba(255, 255, 255, 0.7);
            border-bottom: 1px solid rgba(209, 213, 219, 0.3);
        }
        .dark .glass-effect {
            background-color: rgba(15, 23, 42, 0.7); /* Slate 900 con opacidad */
            border-bottom: 1px solid rgba(51, 65, 85, 0.3);
        }
        
        /* Scrollbar personalizado y moderno */
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1; border-radius: 10px;
            border: 3px solid transparent; background-clip: content-box;
        }
        .dark ::-webkit-scrollbar-thumb { background: #475569; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .dark ::-webkit-scrollbar-thumb:hover { background: #64748b; }

        /* Utilidades */
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* Truco para bordes con gradiente animado al hacer hover */
        .gradient-border {
            position: relative;
            border-radius: 1.5rem; /* rounded-3xl */
            background: #fff;
            z-index: 1;
        }
        .dark .gradient-border { background: #1e293b; }
        .gradient-border::before {
            content: ""; position: absolute; inset: -2px; z-index: -1;
            border-radius: inherit;
            background: linear-gradient(to right bottom, #3b82f6, #8b5cf6, #ec4899);
            opacity: 0; transition: opacity 0.4s ease-in-out;
            filter: blur(8px); /* Efecto de resplandor */
        }
        .gradient-border:hover::before { opacity: 0.7; }
        
        /* Efecto de brillo en botones al pasar el mouse */
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
            content: ''; position: absolute; top: 0; left: -150%;
            width: 100%; height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
            transform: skewX(-25deg);
        }
        .btn-shine:hover::after { animation: shine 1s cubic-bezier(0.4, 0, 0.2, 1); }

        /* Patrón de fondo sutil */
        .bg-pattern {
            background-image: radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: 24px 24px;
        }
        .dark .bg-pattern {
            background-image: radial-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px);
        }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-gray-100 font-sans antialiased selection:bg-blue-500/30 bg-pattern">

    <!-- Navbar Sticky con efecto Glassmorphism Premium -->
    <nav class="sticky top-0 z-50 w-full glass-effect transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-20 items-center">
                <!-- Logo con gradiente y animación -->
                <div class="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
                    <a href="<?= base_url(); ?>"  style="width: 280px;">
                        <img src='<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('logo',$user['agency_id']);?>' class="w-100" style="width: 100% !important;">
                    </a>
                </div>

                <!-- Botón Dark Mode con animación sofisticada -->
                <button id="theme-toggle" class="p-3 rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm hover:shadow-md active:scale-95 group relative overflow-hidden">
                    <span class="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <i class="fas fa-moon text-gray-600 dark:text-yellow-400 text-xl transition-transform duration-500 rotate-0 dark:-rotate-[360deg] relative z-10" id="theme-icon"></i>
                </button>
            </div>
        </div>
    </nav>

    <!-- Contenido Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        <!-- Breadcrumb estilizado -->
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-10 flex items-center gap-2 animate-fade-in-up" style="animation-delay: 0.1s;">
            <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Inicio</a> 
            <i class="fas fa-chevron-right text-[10px] text-gray-300 dark:text-gray-600"></i>
            <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><?= $user_profile['occupation']; ?></a> 
            <i class="fas fa-chevron-right text-[10px] text-gray-300 dark:text-gray-600"></i>
            <span class="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg"><?= $user_profile['full_name']; ?></span>
        </div>

        <!-- Grid Layout Principal -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 relative">

            <!-- COLUMNA IZQUIERDA (Contenido Principal) - 8 columnas -->
            <div class="lg:col-span-8 space-y-10 order-last lg:order-first">
                
                <!-- Tarjeta de Perfil Principal con Borde de Gradiente Animado -->
                <div class="gradient-border p-[3px] rounded-[2rem] shadow-premium dark:shadow-premium-dark hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up" style="animation-delay: 0.2s;">
                    <div class="bg-white dark:bg-dark-card p-8 sm:p-10 rounded-[1.8rem] flex flex-col md:flex-row gap-8 md:gap-12 h-full relative overflow-hidden">
                        <!-- Fondo decorativo sutil -->
                        <div class="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <!-- Columna Foto y Estatus -->
                        <div class="relative flex-shrink-0 mx-auto md:mx-0 text-center md:text-left">
                            <div class="relative inline-block">
                                <div class="w-40 h-40 rounded-full p-1.5 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 shadow-glow-blue animate-float">
                                    <img src="<?= $this->crud_model->getPhoto('user',$user_id); ?>" alt="Doctor" class="w-full h-full rounded-full object-cover border-[3px] border-white dark:border-dark-card shadow-sm">
                                </div>
                                <div class="absolute bottom-3 right-3 bg-green-500 w-6 h-6 rounded-full border-[3px] border-white dark:border-dark-card animate-pulse-slow shadow-sm" title="Disponible ahora"></div>
                            </div>
                        </div>

                        <!-- Columna Información -->
                        <div class="flex-1 flex flex-col justify-center relative z-10">
                            <div class="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-4">
                                <div class="text-center md:text-left">
                                    <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200"><?= $user_profile['full_name']; ?></h1>
                                    <p class="text-blue-600 dark:text-blue-400 font-bold text-lg sm:text-xl flex items-center justify-center md:justify-start gap-2">
                                        <?= $user_profile['title']; ?>
                                        <i class="fas fa-certificate text-blue-500/70"></i>
                                    </p>
                                </div>
                                <!-- Rating Badge Premium -->
                                <div class="flex flex-col items-center bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-2xl border border-yellow-100 dark:border-yellow-900/50 shadow-sm">
                                    <div class="flex text-yellow-400 text-base mb-1 filter drop-shadow-sm">
                                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                    </div>
                                    <div class="text-sm font-bold">
                                        <span class="text-gray-900 dark:text-white text-lg">5.0</span>
                                        <span class="text-gray-500 dark:text-gray-400">/5</span>
                                    </div>
                                    <span class="text-xs text-gray-400 dark:text-muted font-medium">(124 opiniones)</span>
                                </div>
                            </div>

                            <p class="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed text-center md:text-left">
                                <span class="font-semibold text-blue-700 dark:text-blue-300">Más de 15 años de trayectoria</span><?= $user_profile['bio']; ?>
                            </p>

                            <!-- Badges con estilo -->
                            <div class="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                                <span class="px-4 py-2 bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-dark-card transition-colors">
                                    <i class="fas fa-globe-americas text-blue-500"></i> Español / English
                                </span>
                              
                                <span class="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm border border-purple-200 dark:border-purple-900/30 hover:shadow-md transition-all">
                                    <i class="fas fa-medal text-purple-500"></i> Top Doctor 2023
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECCIÓN DE GALERÍA -->
                <div class="bg-white dark:bg-dark-card p-8 sm:p-10 rounded-[2rem] shadow-premium dark:shadow-premium-dark border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up relative overflow-hidden" style="animation-delay: 0.3s;">
                    <!-- Decoración de fondo -->
                    <div class="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10">
                        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-4 mb-4 sm:mb-0">
                            <div class="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/30 rounded-2xl text-blue-600 dark:text-blue-400 shadow-sm">
                                <i class="fas fa-images"></i>
                            </div>
                            Galería 
                        </h2>
                    </div>
                    
                    <!-- Grid de Fotos Premium -->
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 relative z-10">
                        <!-- Foto 1 -->
                        <?php $images = $this->db->get_where('user_profile_gallery',['user_profile_id' => $user_profile['id']])->result_array(); ?>
                        <?php foreach($images as $img): ?>
                        <div class="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                            <img src="<?= base_url(); ?>uploads/profile/<?= $img['image']; ?>" alt="Consultorio" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 group-hover:scale-100 scale-90">
                                <div class="bg-white/30 dark:bg-black/30 backdrop-blur-md p-4 rounded-full shadow-lg border border-white/20">
                                    <i class="fas fa-expand-alt text-white text-2xl drop-shadow-md"></i>
                                </div>
                            </div>
                            <div class="absolute bottom-4 left-4 text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                img 1
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <!-- COLUMNA DERECHA (Sticky Card Premium) - 4 columnas -->
            <div class="lg:col-span-4 lg:relative order-first lg:order-last">
                <div class="sticky top-24 space-y-6 animate-fade-in-up" style="animation-delay: 0.3s; z-index: 30;">
                    
                    <!-- Tarjeta de Agendamiento y Contacto "Ultra Premium" -->
                    <div class="bg-white dark:bg-dark-card rounded-[2rem] shadow-premium dark:shadow-premium-dark border-2 border-white dark:border-gray-700/50 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl ring-4 ring-gray-50 dark:ring-gray-800/50">
                        <!-- Header con Gradiente Animado y Patrón -->
                        <div class="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-t-[2rem] overflow-hidden">
                            <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat animate-pulse-slow"></div>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            <!-- Formas decorativas -->
                            <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                            <div class="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
                        </div>
                        
                        <!-- Contenido del Header -->
                        <div class="relative p-8 pb-0 text-center pt-12">
                            <div class="relative inline-block mb-5">
                                 <div class="w-32 h-32 rounded-full p-1.5 bg-white dark:bg-dark-card mx-auto shadow-2xl relative z-10 animate-float">
                                    <img src="<?= $this->crud_model->getPhoto('user',$user_id); ?>" alt="Doctor" class="w-full h-full rounded-full object-cover border-4 border-blue-50 dark:border-blue-900/50">
                                </div>
                                <div class="absolute bottom-2 right-2 bg-green-500 w-7 h-7 rounded-full border-4 border-white dark:border-dark-card z-20 animate-pulse-slow shadow-lg flex items-center justify-center" title="Online">
                                    <div class="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            </div>
                           
                            <h3 class="font-extrabold text-gray-900 dark:text-white text-2xl mb-2 tracking-tight"><?= $user_profile['full_name']; ?></h3>
                            <div class="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full mb-8 border border-blue-100 dark:border-blue-800/50 shadow-sm">
                                <i class="fas fa-heart-pulse text-blue-500"></i>
                                <p class="text-blue-700 dark:text-blue-300 text-sm font-bold uppercase tracking-wider"><?= $user_profile['occupation']; ?></p>
                            </div>
                            
                            <!-- Botones de Contacto Directo con Estilo -->
                            <div class="grid grid-cols-2 gap-4 mb-8">
                                <a href="mailto:<?= $user_profile['email']; ?>" class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all group/item text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md">
                                    <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform shadow-sm">
                                        <i class="fas fa-envelope"></i>
                                    </div>
                                    <span class="font-bold text-xs">Enviar Correo</span>
                                </a>
                                <a href="tel:+<?= $user_profile['phone']; ?>" class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all group/item text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md">
                                    <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform shadow-sm">
                                        <i class="fas fa-phone"></i>
                                    </div>
                                    <span class="font-bold text-xs">Llamar Ahora</span>
                                </a>
                            </div>
                            <?php if($user_profile['whatsapp_link'] != ''): ?>
                                <!-- Botón WhatsApp Premium con Efecto -->
                                <a href="<?= $user_profile['whatsapp_link']; ?>">
                                    <button class="w-full py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mb-8 btn-shine relative overflow-hidden group/btn border-2 border-white/20">
                                        <i class="fab fa-whatsapp text-3xl transition-transform group-hover/btn:rotate-[15deg]"></i>
                                        <span>Contactar por WhatsApp</span>
                                    </button>
                                </a>
                            <?php endif; ?>
                        </div>

                    </div>

                    <!-- Mini widget adicional Mejorado -->
                    <!-- Mini widget adicional Mejorado (Rojo) -->
                    <div class="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 
                                p-6 rounded-[2rem] border border-red-100 dark:border-red-800/50 
                                flex items-start gap-5 shadow-sm hover:shadow-md 
                                transition-all relative overflow-hidden group">
                    
                        <div class="absolute -right-10 -bottom-10 w-32 h-32 
                                    bg-red-200/30 dark:bg-red-800/30 
                                    rounded-full blur-2xl pointer-events-none 
                                    group-hover:scale-110 transition-transform"></div>
                    
                        <div class="p-4 bg-white dark:bg-red-800/50 
                                    rounded-2xl text-red-600 dark:text-red-300 
                                    flex-shrink-0 shadow-sm 
                                    border border-red-100 dark:border-red-700/50 
                                    group-hover:scale-110 transition-transform relative z-10">
                            <i class="fas fa-location-dot text-2xl"></i>
                        </div>
                    
                        <div class="relative z-10">
                            <h4 class="font-bold text-lg text-red-900 dark:text-red-100 mb-2">
                                Dirección
                            </h4>
                            <p class="text-sm text-red-800 dark:text-red-200 mb-3 leading-relaxed font-medium">
                                <?= nl2br($user_profile['location']); ?>
                            </p>
                        </div>
                    </div>


                
                </div>
            </div>

        </div>
    </main>
    
    <!-- Footer Moderno Premium -->
    <footer class="bg-white dark:bg-dark-card border-t border-gray-200/50 dark:border-gray-700/50 mt-20 pt-16 pb-8 relative overflow-hidden">
        <!-- Efectos de fondo del footer -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative z-10">
            <div class="col-span-1 md:col-span-2 pr-0 md:pr-12">
                 <div class="flex items-center gap-3 mb-6">
                    <span class="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200">
                        <a href="<?= base_url(); ?>"  style="width: 280px;">
                            <img src='<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('logo',$user['agency_id']);?>' class="w-100" style="width: 50% !important;">
                        </a>
                    </span>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8 font-medium">
                    <?= $this->crud_model->getInfoAgency('description',$user['agency_id']);?>
                </p>
                
            </div>
            <div>
                <h4 class="font-bold text-gray-900 dark:text-white mb-6 text-lg">Redes</h4>
                <div class="flex gap-4">
                    <?php if($user_profile['facebook'] != ''): ?>
                    <a href="<?= $user_profile['facebook']; ?>" class="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 group">
                        <i class="fab fa-facebook-f text-lg group-hover:scale-110 transition-transform"></i>
                    </a>
                    <?php endif; ?>
                    <?php if($user_profile['instagram'] != ''): ?>
                    <a href="<?= $user_profile['instagram']; ?>" class="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 group">
                        <i class="fab fa-instagram-f text-lg group-hover:scale-110 transition-transform"></i>
                    </a>
                    <?php endif; ?>
                    <?php if($user_profile['tiktok'] != ''): ?>
                    <a href="<?= $user_profile['tiktok']; ?>" class="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 group">
                        <i class="fab fa-tiktok-f text-lg group-hover:scale-110 transition-transform"></i>
                    </a>
                    <?php endif; ?>
                </div>
            </div>
            
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 border-t border-gray-100 dark:border-gray-800/50 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
                &copy; <?= date('Y'); ?> <?= $this->crud_model->getInfoAgency('name',$user['agency_id']);?>. Todos los derechos reservados.
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                Hecho con <i class="fas fa-heart text-red-500 animate-pulse"></i> por expertos en viajes y tecnología.
            </p>
        </div>
    </footer>

    <!-- Scripts -->
    <script>
        // Lógica para el modo oscuro
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const htmlElement = document.documentElement;

        function updateTheme(isDark) {
            if (isDark) {
                htmlElement.classList.add('dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                // Rotación para el icono de sol
                themeIcon.style.transform = 'rotate(180deg)';
            } else {
                htmlElement.classList.remove('dark');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                // Rotación para el icono de luna
                themeIcon.style.transform = 'rotate(0deg)';
            }
        }

        // Comprobar preferencia guardada
        const savedTheme = localStorage.theme;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        updateTheme(isDark);

        // Evento toggle con animación
        themeToggleBtn.addEventListener('click', () => {
            const isDark = htmlElement.classList.toggle('dark');
            localStorage.theme = isDark ? 'dark' : 'light';
            
            // Animación de rotación al cambiar
            themeIcon.style.transition = 'transform 0.5s ease-in-out, opacity 0.2s ease-in-out';
            themeIcon.style.opacity = '0';
            
            setTimeout(() => {
                updateTheme(isDark);
                themeIcon.style.opacity = '1';
            }, 250);
        });

        // Interacciones simples de la galería (solo consola para demostración)
        const galleryImages = document.querySelectorAll('.group img');
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                console.log('Abrir lightbox premium para imagen:', img.src);
                // Aquí se implementaría un Lightbox real
            });
        });

        // Animación de entrada al hacer scroll (Intersection Observer)
        const animatedElements = document.querySelectorAll('.animate-fade-in-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.visibility = 'visible';
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Activar un poco antes de que entre en pantalla
        });

        animatedElements.forEach(el => {
            el.style.visibility = 'hidden'; // Ocultar inicialmente
            observer.observe(el);
        });
    </script>
</body>
</html>