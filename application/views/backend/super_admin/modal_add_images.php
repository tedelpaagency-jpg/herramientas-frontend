<div class="modal-header">
    <h5 class="modal-title" id="exampleModalLabel">Seleccionar imagen</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
    <div class="modal-body row">
        <div class="mb-20">
          <ul class="nav nav-tabs" id="imageTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="library-tab" data-bs-toggle="tab" data-bs-target="#library" type="button" role="tab">Biblioteca</button>
              </li>
              <li class="nav-item" role="presentation"  >
                <button class="nav-link" id="upload-tab" data-bs-toggle="tab" data-bs-target="#upload" type="button" role="tab">Subir nuevas</button>
              </li>
            </ul>
            
            <div class="tab-content pt-3">
              <!-- TAB 1: Biblioteca -->
              <div class="tab-pane fade show active " id="library" role="tabpanel" style="overflow:scroll;height:400px">
                <div class="row" id="imageLibrary">
                  <?php 
                    $images = $this->crud_model->get_image_library_paginated();
                    foreach ($images as $image): ?>
                    <div class="col-6 col-sm-4 col-md-3 mb-3">
                      <div class="image-box position-relative p-1 border rounded" data-name="<?= $image ?>">
                        <input type="checkbox" class="form-check-input position-absolute top-0 start-0 m-2 image-checkbox" value="<?= $image ?>" style="z-index:99">
                        <img src="<?= base_url('public/uploads/gallery/' . $image); ?>" class="img-fluid rounded">
                      </div>
                    </div>

                  <?php endforeach; ?>
                </div>
              </div>
            
              <!-- TAB 2: Subir nuevas -->
              <div class="tab-pane fade" id="upload" role="tabpanel" >
                <div class="box-uploadfile text-center">
                      <div class="uploadfile">
                          <div class="btn-upload tf-btn primary">
                              <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                                  <path d="M13.625 14.375V17.1875C13.625 17.705 13.205 18.125 12.6875 18.125H4.5625C4.31386 18.125 4.0754 18.0262 3.89959 17.8504C3.72377 17.6746 3.625 17.4361 3.625 17.1875V6.5625C3.625 6.045 4.045 5.625 4.5625 5.625H6.125C6.54381 5.62472 6.96192 5.65928 7.375 5.72834M13.625 14.375H16.4375C16.955 14.375 17.375 13.955 17.375 13.4375V9.375C17.375 5.65834 14.6725 2.57417 11.125 1.97834C10.7119 1.90928 10.2938 1.87472 9.875 1.875H8.3125C7.795 1.875 7.375 2.295 7.375 2.8125V5.72834M13.625 14.375H8.3125C8.06386 14.375 7.8254 14.2762 7.64959 14.1004C7.47377 13.9246 7.375 13.6861 7.375 13.4375V5.72834M17.375 11.25V9.6875C17.375 8.94158 17.0787 8.22621 16.5512 7.69876C16.0238 7.17132 15.3084 6.875 14.5625 6.875H13.3125C13.0639 6.875 12.8254 6.77623 12.6496 6.60041C12.4738 6.4246 12.375 6.18614 12.375 5.9375V4.6875C12.375 4.31816 12.3023 3.95243 12.1609 3.6112C12.0196 3.26998 11.8124 2.95993 11.5512 2.69876C11.2901 2.4376 10.98 2.23043 10.6388 2.08909C10.2976 1.94775 9.93184 1.875 9.5625 1.875H8.625" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                              Seleccionar fotos
                              <input type="hidden" name="final_images" id="final_images">
                              <input type="file" class="ip-file" id="uploadInput" multiple accept="image/*">
                          </div>
                          <p class="file-name fw-5">o arrastra las fotos aquí </p>
                      </div>
                      <div class="box-img-upload" id="uploadPreview">
                        </div>
                  </div>
              </div>
            </div>

      </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="closeModalImages" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" id="saveImages" >Aceptar</button>
    </div>
<script>


$(document).ready(function() {
    
    let offset = 20; // Ya cargaste los primeros 20 en el HTML
let limit = 20;
let loading = false;

$('#library').on('scroll', function() {
    if (!loading && $(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight - 100) {
        loading = true;

        $.ajax({
            url: '<?= base_url('portal/get_more_images') ?>',
            data: { limit: limit, offset: offset },
            dataType: 'json',
            success: function(images) {
                if (images.length > 0) {
                    images.forEach(function(image) {
                        const html = `
                            <div class="col-6 col-sm-4 col-md-3 mb-3">
                                <div class="image-box position-relative p-1 border rounded" data-name="${image}">
                                    <input type="checkbox" class="form-check-input position-absolute top-0 start-0 m-2 image-checkbox" value="${image}" style="z-index:99">
                                    <img src="<?= base_url('public/uploads/gallery/') ?>${image}" class="img-fluid rounded">
                                </div>
                            </div>
                        `;
                        $('#imageLibrary').append(html);
                    });

                    offset += limit;
                    loading = false;
                }
            }
        });
    }
});


selectedImages = [];
    // Al hacer clic en la imagen, activamos manualmente su checkbox
$('#imageLibrary').on('click', '.image-box img', function () {
  const checkbox = $(this).siblings('.image-checkbox');
  checkbox.prop('checked', !checkbox.prop('checked')).trigger('change');
});

   
 // Solo cuando se marca o desmarca un checkbox
  $('#imageLibrary').on('change', '.image-checkbox', function () {
    const imageName = $(this).val();

    if ($(this).is(':checked')) {
      if (!selectedImages.includes(imageName)) {
        selectedImages.push(imageName);
      }
    } else {
      selectedImages = selectedImages.filter(name => name !== imageName);
    }

    console.log("Seleccionadas:", selectedImages);
  });

    $('#uploadInput').on('change', function () {
      const files = this.files;
      $('#uploadPreview').empty();
    
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        const file = files[i];
    
        reader.onload = function (e) {
          const uniqueId = `img-${i}-${Date.now()}`;
          $('#uploadPreview').append(`
            <div class="col-4">
              <div class="card">
                <img src="${e.target.result}" class="card-img-top" alt="Preview">
                <div class="progress" style="height: 20px;">
                  <div id="${uniqueId}" class="progress-bar" style="width: 0%">0%</div>
                </div>
              </div>
            </div>
          `);
          subirIndividual(file, uniqueId);
        };
    
        reader.readAsDataURL(file);
      }
    });
    
    function subirIndividual(file, progressId) {
      let formData = new FormData();
      formData.append('file', file);
    
      $.ajax({
        xhr: function () {
          let xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
              let percent = Math.round((evt.loaded / evt.total) * 100);
              $(`#${progressId}`).css('width', percent + '%').text(percent + '%');
            }
          }, false);
          return xhr;
        },
        url: '<?= base_url('portal/subir_imagen_individual'); ?>',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (resp) {
             let data = JSON.parse(resp);
            if (data.status === 'ok') {
                // Recargar galería o agregar la nueva imagen
                $('#galeria').append(`<img src="${data.url}" data-nombre="${data.filename}" class="selectable-image">`);
            } else {
                alert(data.mensaje);
            }
            
            console.log(data);
          let imgName = data.filename;
    
          $('#imageLibrary').prepend(`
            <div class="col-4 mb-3">
              <div class="image-box position-relative" data-name="${imgName}">
                <img src="<?= base_url('public/uploads/gallery/'); ?>${imgName}" class="img-fluid rounded">
                <input type="checkbox" class="form-check-input position-absolute top-0 start-0 m-2 image-checkbox" value="${imgName}" style="z-index:99">
              </div>
            </div>
          `);
          
           Toastify({
                      text: "Cargado correctamente" ,
                      duration: 3000,
                      close: true,
                      gravity: "top", // `top` or `bottom`
                      position: "right", // `left`, `center` or `right`
                      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
                    }).showToast();
                    
        }
      });
    }

    $('#saveImages').on('click', function() {

      if('<?= $param2 ?>' == 'single')
      {
        if (selectedImages.length > 0) 
        {
          console.log('Imagen seleccionada');
              // Tomamos solo la primera imagen seleccionada (puedes cambiar esto si quieres permitir varias)
              const selectedImage = selectedImages[0];

              // Actualizamos el input hidden
              $('input[name="<?= $param3 ?>"]').val(selectedImage);

              // Actualizamos la imagen mostrada (tú debes tener un <img id="selectedImageDisplay"> o similar)
              $('#<?= $param3 ?>').attr('src', '<?= base_url('public/uploads/gallery/'); ?>' + selectedImage);

              // Cerramos el modal (opcional)
              $('#mortalidad').modal('hide');
          } else {
              alert('Por favor selecciona una imagen primero.');
          }

      }

       if('<?= $param2 ?>' == 'multiple')
        {
          if (selectedImages.length > 0) 
          {
            console.log('Imagen seleccionada');
                // Tomamos solo la primera imagen seleccionada (puedes cambiar esto si quieres permitir varias)
               
                // Actualizamos el input hidden
                // Obtenemos el valor actual del input
                let currentImages = $('input[name="<?= $param3 ?>"]').val();

                // Convertimos el valor actual a array
                let currentImagesArray = [];
                if (currentImages) {
                    currentImagesArray = currentImages.split(',');
                }

                // Unimos las imágenes existentes con las nuevas seleccionadas
                let allImages = currentImagesArray.concat(selectedImages);


                // Actualizamos el input hidden
                $('input[name="<?= $param3 ?>"]').val(allImages.join(','));


                console.log( $('input[name="<?= $param3 ?>"]').val());
                selectedImages.forEach(function(image) {
                  const html = `
                  <div class="col-md-3">
                    <div class="item-upload file-delete" data-filename="${image}" data-container="<?= $param3 ?>" >
                        <img src="<?= base_url('public/uploads/gallery/'); ?>${image}" alt="img">
                        <span class="icon icon-trash remove-file remove-image"><i class="fas fa-trash"></i></span>
                    </div>
                  </div>`;
                  $('#<?= $param3 ?>').append(html);
                })
                
                // Cerramos el modal (opcional)
                $('#mortalidad').modal('hide');
            } else {
                alert('Por favor selecciona una imagen primero.');
            }

        }
     
  });



});
</script>
