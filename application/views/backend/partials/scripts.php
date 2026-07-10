<script>
    var base_url = '<?= base_url(); ?>';
        
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

 $('.select2').select2();
 
 let currentPage = 1;
let timer = null;

function initSearch(inputId = 'search', callback = null) {

    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('keyup', function () {

        clearTimeout(timer);

        timer = setTimeout(() => {

            if (typeof callback === 'function') {
                callback(this.value);
            }

        }, 400);

    });
}

function loadPage(page = 1, table = 'patients', container = '#list-container') {

    currentPage = page;

    let searchEl = document.getElementById('search');
    let search = searchEl ? searchEl.value : '';

    let url = "<?= base_url() ?>portal/" + table + "/ajax_list/" + page;

    $.ajax({
        url: url,
        type: "POST",
        data: {
            search: search,
        },
        success: function (response) {
            $(container).html(response);
            lucide.createIcons();
        }
    });
}

function prevPage() {
    if (currentPage > 1) {
        loadPage(currentPage - 1);
    }
}

function nextPage(totalPages) {
    if (currentPage < totalPages) {
        loadPage(currentPage + 1);
    }
}

</script>
<script src="<?= base_url(); ?>public/assets/js/lightbox.js"></script>
<script src="<?= base_url(); ?>public/assets/js/scripts.js?v=2.2"></script>
<script src="<?= base_url(); ?>public/assets/js/sweetalert.js"></script>
<script>
                                    
    $(document).on('submit', '#userForm', function(e) {
        e.preventDefault();
        
        $('#btnsubmit').attr('disabled','disabled');
        let form = $(this);
        let url = form.attr('action');
        let formData = new FormData(this);
    
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            processData: false,   // obligatorio para file
            contentType: false,   // obligatorio para file
            dataType: "json",
            beforeSend: function() {
                // opcional
            },
            success: function(resp) {
                if (resp.status === 'success') {
                    
                        Toast.fire({
                        icon: 'success',
                        title: resp.message
                    });
                    
                    location.reload();
                    
                } else {
                    // error
                    Toast.fire({
                        icon: 'error',
                        title: resp.message
                    });
                    
                    $('#btnsubmit').removeAttr('disabled');
                }
            },
            error: function(xhr) {
                    // error
                Toast.fire({
                    icon: 'error',
                    title: "Error al procesar la solicitud"
                });
                    
                $('#btnsubmit').removeAttr('disabled');
                    
                console.log(xhr.responseText);
            }
        });
    });
                                </script>
<script>
    
let table;

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

if ($('#dataTable').length > 0) {
    // normalización global para DataTables
    $.fn.dataTable.ext.type.search.string = function (data) {
        return normalizeText(data);
    };

    table = $('#dataTable').DataTable({
        ordering: false,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        searching: true,
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
        }
    });
}

// input externo
$('.search-form-2').find('input').on('keyup', function () {
    table.search(this.value).draw();
});


$(document).ready(function () {
    


    
    
    
    $('.link').click(function() {
      
        // Obtener el nombre del producto desde el atributo 'data-product-name' y la URL desde 'data-url'
        var productName = $(this).data('id');
        var productUrl = '<?= base_url(); ?>product/detailproduct/'+productName+'?sellertag=<?= base64_encode($this->session->userdata('login_type').'-'.$this->session->userdata('login_user_id')); ?>';
        
        // Construir el texto a copiar
        var textToCopy = productUrl; // Aquí puedes agregar más detalles si es necesario, como el nombre del producto

        // Crear un input temporal para copiar al portapapeles
        var $tempInput = $('<input>');
        $('body').append($tempInput);
        $tempInput.val(textToCopy).select();
        document.execCommand('copy');
        $tempInput.remove();

        // Opcional: muestra una alerta de confirmación
        alert('Link copiado al portapapeles');
    });
    
});


$(document).on('click', '.password-toggle', function () {
    const input = $(this).siblings('.toggle-password');
    const icon = $(this).find('i');

    if (input.attr('type') === 'password') {
        input.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        input.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
});

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
});


 
 function confirm_element(url)
{
    Swal.fire({
        title: '¿Estás seguro?',
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#9fd13b',
        cancelButtonColor: '#fd4f57',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) 
        {
            location.href = '<?= base_url(); ?>'+url;
        }
    })
}

function delete_element(url)
{
    Swal.fire({
        title: '¿Estás seguro?',
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#9fd13b',
        cancelButtonColor: '#fd4f57',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) 
        {
            location.href = '<?= base_url(); ?>'+url;
        }
    })
}

<?php if($this->session->flashdata('success') != ''): ?>
        
    // success
    Toast.fire({
        icon: 'success',
        title: '<?= $this->session->flashdata('success'); ?>'
    });
                    
<?php endif; ?>

<?php if($this->session->flashdata('error') != ''): ?>
    
    // error
    Toast.fire({
        icon: 'error',
        title: '<?= $this->session->flashdata('error'); ?>'
    });
                    
<?php endif; ?>


<?php if($page_name == 'feed' ): ?>

function toggleNotice(el){
    const text = el.parentElement.querySelector('.notice-text');

    if(text.classList.contains('expanded')){
        text.classList.remove('expanded');
        el.innerText = 'Ver más';
    }else{
        text.classList.add('expanded');
        el.innerText = 'Ver menos';
    }
}

let offset = 0;
let loading = false;

function loadMorePosts() {
    if (loading) return;
    loading = true;

    $("#loader").show();

    $.ajax({
        url: "<?= base_url('portal/feed/load_more_posts'); ?>",
        type: "POST",
        dataType: "json",
        data: { offset: offset },
        success: function(res) {

            $("#loader").hide();

            if (res.html.trim().length > 0) {
                $("#postContainer").append(res.html);
                offset += 3; // siguiente lote
            } else {
                // No hay más posts
                $("#loader").hide();
                $(window).off("scroll");
            }

            loading = false;
        }
    }).done(function() {
        
        GLightbox({ selector: '.glightbox' });
        
    });
}

// Cargar 1er lote
loadMorePosts();

// Cargar cuando haga scroll
$(window).on("scroll", function () {
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
        loadMorePosts();
    }
});

<?php endif; ?>
</script>
<?php if($page_name == 'agency_profile' || $page_name == 'user_profile'): ?>
<script src="<?= base_url(); ?>public/assets/js/apexcharts.min.js"></script> 
<script src="<?= base_url(); ?>public/assets/js/chart.js?v=1.4"></script> 
<script src="<?= base_url(); ?>public/assets/js/jquery.easypiechart.min.js"></script> 


<script>

$(document).ready(function () {
          $('#copyBtn').on('click', function () {
            
            var $input = $('#copyInput');
            $input.select();
            document.execCommand('copy');
            
            Toastify({
                      text: "Link copiado" ,
                      duration: 3000,
                      close: true,
                      gravity: "top", // `top` or `bottom`
                      position: "right", // `left`, `center` or `right`
                      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
                    }).showToast();
                    
      });
  
  


        $('.chart').easyPieChart({
            easing: 'easeOutElastic',
            delay: 3000,
            barColor: '#3498db',
            trackColor: '#aaa',
            scaleColor: false,
            lineWidth: 5,
            trackWidth: 5,
            size: 50,
            lineCap: 'round',
            onStep: function(from, to, percent) {
                this.el.children[0].innerHTML = Math.round(percent);
            }
        });
    
    
    // Evento para cargar provincias cuando cambia el país


</script>
<?php endif;?>
<!-- FilePond core -->
<link href="https://unpkg.com/filepond/dist/filepond.min.css" rel="stylesheet">
<script src="https://unpkg.com/filepond/dist/filepond.min.js"></script>

<!-- Image Preview (para imágenes) -->
<link href="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css" rel="stylesheet">
<script src="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js"></script>

<!-- Media Preview (para videos/audio) -->
<link href="https://unpkg.com/filepond-plugin-media-preview/dist/filepond-plugin-media-preview.css" rel="stylesheet">
<script src="https://unpkg.com/filepond-plugin-media-preview/dist/filepond-plugin-media-preview.js"></script>

<!-- Validación tipo -->
<script src="https://unpkg.com/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<script>
     function delete_item(url)
        {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "También se eliminará toda la información asociada..",
                type: 'info',
                showCancelButton: true,
                confirmButtonColor: '#9fd13b',
                cancelButtonColor: '#fd4f57',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) 
                {
                    location.href = '<?= base_url(); ?>'+url;
                }
            })
        }



FilePond.registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview,
    FilePondPluginMediaPreview
);

FilePond.create(document.querySelector('#filepond'), {
    allowMultiple: true,
    storeAsFile: true, // Permite que los archivos se envíen con el formulario normal
    acceptedFileTypes: [
        'image/*',
        'video/*'
    ],
    labelIdle: `<i class="fa-solid fa-cloud-upload fa-fw "></i><br>
                Arrastra o <span class="filepond--label-action">busca</span>`,
});

FilePond.create(document.querySelector('#filepond2'), {
    allowMultiple: true,
    storeAsFile: true, // Permite que los archivos se envíen con el formulario normal
    acceptedFileTypes: [
        'image/*',
        'video/*'
    ],
    labelIdle: `<i class="fa-solid fa-cloud-upload fa-fw "></i><br>
                Arrastra o <span class="filepond--label-action">busca</span>`,
});


    $(document).on('input', 'input[name="username"]', function() {
        this.value = this.value.toLowerCase();
    });
    
    $(document).on('click', '.toggle-password', function() {
        const input = $(this).siblings('input');
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
    
        // Cambia el ícono (opcional)
        $(this).html(type === 'password' ?  '<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#939393" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"/></svg>' :'<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#939393" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"/></svg>'  );
    });
    

</script>
<?php if($page_name == 'pos'):?>
<script>
document.getElementById('saveSale').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = this;
  const formData = new FormData(form);

  Swal.fire({
    title: "Procesando pedido...",
    html: "Por favor espera...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  fetch(form.action, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: '¡Venta agregada!',
          text: response.message
        }).then(() => {
          location.reload(); // o redireccionar si deseas
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.message
        });
      }
    })
    .catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo contactar con el servidor.'
      });
    });
});

</script>
<?php endif;?>