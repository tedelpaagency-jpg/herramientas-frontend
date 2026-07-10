<?php defined('BASEPATH') OR exit('No direct script access allowed');

if (!function_exists('ajax_pagination_controls')) {

    function ajax_pagination_links($total, $limit, $page)
    {
        $pages = (int) ceil($total / $limit);
        $page = (int) $page;

        if ($pages < 1) $pages = 1;

        $prevDisabled = ($page <= 1) ? 'disabled' : '';
        $nextDisabled = ($page >= $pages) ? 'disabled' : '';

        $html = '<div id="pagination" class="mt-4 text-center">';

        $html .= "<button class='btn btn-light me-2' {$prevDisabled} onclick='prevPage()'>Anterior</button>";

        $html .= " Página {$page} de {$pages} ";

        $html .= "<button class='btn btn-light ms-2' {$nextDisabled} onclick='nextPage({$pages})'>Siguiente</button>";

        $html .= '</div>';

        return $html;
    }
}