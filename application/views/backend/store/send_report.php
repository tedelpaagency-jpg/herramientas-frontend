<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Venta - Paso 4: Reporte Enviado con Éxito</title>

    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Tipografía Inter -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

        html, body { height: 100%; }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f7f9fc;
            overflow-x: hidden;
        }

        /* Stepper */
        .step-complete {
            background-color: #d1fae5;
            border-color: #10b981;
        }
        .step-icon-complete {
            background-color: #10b981;
        }

        /* ------------------------------------ */
        /* CONFETI PROFESIONAL                 */
        /* ------------------------------------ */

        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 5;
        }

        .confetti {
            position: absolute;
            width: 8px;
            height: 14px;
            opacity: 0;
            border-radius: 2px;
            will-change: transform, opacity;
            animation: confetti-fall var(--duration) ease-out forwards;
        }

        @keyframes confetti-fall {
            0% {
                opacity: 1;
                transform: translate(0, 0) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: translate(var(--final-x), var(--final-y)) rotate(var(--rotation));
            }
        }

        /* Colores modernos del confeti */
        .color-1 { background: #4ade80; }
        .color-2 { background: #60a5fa; }
        .color-3 { background: #facc15; }
        .color-4 { background: #f87171; }
        .color-5 { background: #a78bfa; }

        /* Icono éxito encima del confeti */
        #success-card { position: relative; z-index: 20; }
        #confetti-origin { position: relative; z-index: 30; }

        /* Animaciones extra */
        @keyframes pop-in {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .pop-in-effect {
            animation: pop-in 0.5s ease-out forwards;
        }

        .check-svg {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw-check 3.5s ease-in-out forwards;
        }

        @keyframes draw-check {
            to { stroke-dashoffset: 0; }
        }
        
        
    /    * -------------------------- */
/* CONFETI PROFESIONAL        */
/* -------------------------- */
.confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 5;
}

.confetti {
    position: absolute;
    width: 8px;
    height: 14px;
    opacity: 0;
    border-radius: 2px;
    will-change: transform, opacity;
    animation: confetti-fall var(--duration) ease-out forwards;
}

/* Animación con rotación + caída */
@keyframes confetti-fall {
    0% {
        opacity: 1;
        transform: translate(0, 0) rotate(0deg);
    }
    100% {
        opacity: 0;
        transform: translate(var(--final-x), var(--final-y)) rotate(var(--rotation));
    }
}

/* Colores modernos */
.color-1 { background: #4ade80; }
.color-2 { background: #60a5fa; }
.color-3 { background: #facc15; }
.color-4 { background: #f87171; }
.color-5 { background: #a78bfa; }
        
        
    </style>
</head>

<body class="min-h-screen">

    <!-- ZONA DE CONFETI -->
    <div id="confetti-zone" class="confetti-container"></div>

    <!-- Contenedor principal -->
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <!-- Breadcrumb -->
        <nav class="text-sm font-medium text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol class="list-none p-0 inline-flex">
                <li class="flex items-center">
                    <a class="text-gray-600 hover:text-blue-600 cursor-pointer">Ventas</a>
                    <svg class="mx-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"/>
                    </svg>
                </li>
                <li class="flex items-center">
                    <span class="text-green-600 font-semibold">Nueva venta</span>
                </li>
            </ol>
        </nav>

        <!-- Stepper -->
        <div class="mb-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">

                <div class="p-4 rounded-xl border-2 step-complete">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full step-icon-complete flex items-center justify-center text-white mr-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-600">Paso 1</p>
                            <p class="text-sm font-semibold text-green-700">Datos principales</p>
                        </div>
                    </div>
                </div>

                <div class="p-4 rounded-xl border-2 step-complete">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full step-icon-complete flex items-center justify-center text-white mr-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-600">Paso 2</p>
                            <p class="text-sm font-semibold text-green-700">Información</p>
                        </div>
                    </div>
                </div>

                <div class="p-4 rounded-xl border-2 step-complete">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full step-icon-complete flex items-center justify-center text-white mr-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Paso 3</p>
                            <p class="text-sm font-semibold text-green-700">Detalles</p>
                        </div>
                    </div>
                </div>

                <div class="p-4 rounded-xl border-2 step-complete">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full step-icon-complete flex items-center justify-center text-white mr-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Paso 4</p>
                            <p class="text-sm font-semibold text-green-700">Completado</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Tarjeta de Éxito -->
        <div id="success-card" class="bg-white p-6 sm:p-12 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center min-h-[50vh] pop-in-effect">

            

            <!-- Ícono de celebración -->
            <div id="confetti-origin" class="mb-4">
                <span class="text-green-500 text-6xl">🎉</span>
            </div>
            
            
            
            
            <div class="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">¡FELICITACIONES!</h1>
               
            </div>
            <br>
            <p class="text-2xl font-semibold text-gray-800 mb-8">
                Tu reporte fue enviado con éxito.
            </p>

            <p class="text-gray-500 max-w-lg mb-10">
                La información de la venta ha sido registrada y los detalles financieros calculados.
                Puedes revisar el historial o comenzar una nueva venta.
            </p>

            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button class="flex items-center px-8 py-3 border border-gray-300 rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                    <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Ir al Dashboard
                </button>

                <button class="flex items-center px-8 py-3 rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 transform hover:scale-105">
                    <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Crear Nueva Venta
                </button>
            </div>

        </div>

    </div>

    <!-- Footer -->
    <footer class="mt-12 py-4 text-center text-xs text-gray-500">
        2025 © Todos los derechos reservados | Desarrollado por un experto en desarrollo web
    </footer>

    <!-- CONFETI SCRIPT -->
   <script>
    document.addEventListener("DOMContentLoaded", () => {

        const confettiContainer = document.getElementById("confetti-zone");
        const origin = document.getElementById("confetti-origin");

        const colors = ["color-1", "color-2", "color-3", "color-4", "color-5"];
        const COUNT = 170;

        function getCenterPoint(el) {
            const r = el.getBoundingClientRect();
            return {
                x: r.left + r.width / 2,
                y: r.top + r.height / 2
            };
        }

        function launchConfetti() {
            const center = getCenterPoint(origin);

            for (let i = 0; i < COUNT; i++) {
                const c = document.createElement("div");
                c.classList.add("confetti", colors[i % colors.length]);

                c.style.left = `${center.x}px`;
                c.style.top = `${center.y}px`;

                const angle = Math.random() * Math.PI * 2;
                const distance = 240 + Math.random() * 360;

                const finalX = Math.cos(angle) * distance;
                const finalY = Math.sin(angle) * distance + 400;

                c.style.setProperty("--final-x", `${finalX}px`);
                c.style.setProperty("--final-y", `${finalY}px`);

                /* DURACIÓN REAL ENTRE 3 Y 6 SEGUNDOS */
                c.style.setProperty("--duration", `${3 + Math.random() * 3}s`);

                c.style.setProperty("--rotation", `${600 + Math.random() * 1200}deg`);

                confettiContainer.appendChild(c);

                // Eliminar cada partícula después de 7 segundos
                setTimeout(() => c.remove(), 7000);
            }
        }

        launchConfetti();
    });
    
    
</script>

<script>
    document.addEventListener("DOMContentLoaded", () => {

    const confettiContainer = document.getElementById("confetti-zone");
    const origin = document.getElementById("confetti-origin");

    const colors = ["color-1", "color-2", "color-3", "color-4", "color-5"];
    const COUNT = 170;

    function getCenterPoint(el) {
        const r = el.getBoundingClientRect();
        return {
            x: r.left + r.width / 2,
            y: r.top + r.height / 2
        };
    }

    function launchConfetti() {
        const center = getCenterPoint(origin);

        for (let i = 0; i < COUNT; i++) {
            const c = document.createElement("div");
            c.classList.add("confetti", colors[i % colors.length]);

            c.style.left = `${center.x}px`;
            c.style.top = `${center.y}px`;

            const angle = Math.random() * Math.PI * 2;
            const distance = 240 + Math.random() * 360;

            const finalX = Math.cos(angle) * distance;
            const finalY = Math.sin(angle) * distance + 400;

            c.style.setProperty("--final-x", `${finalX}px`);
            c.style.setProperty("--final-y", `${finalY}px`);

            /* Duración REAL 3–6 segundos */
            c.style.setProperty("--duration", `${3 + Math.random() * 3}s`);

            c.style.setProperty("--rotation", `${600 + Math.random() * 1200}deg`);

            confettiContainer.appendChild(c);

            // Eliminar cada confeti después de 7 segundos
            setTimeout(() => c.remove(), 7000);
        }
    }

    launchConfetti();
});
</script>


</body>
</html>
