import Swal from 'sweetalert2';

export interface ConfirmDialogOptions {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
  confirmButtonColor?: string;
}

export const confirmDialog = async (options: ConfirmDialogOptions | string): Promise<boolean> => {
  const title = typeof options === 'string' ? options : options.title || '¿Estás seguro?';
  const text = typeof options === 'string' ? 'Esta acción no se puede deshacer.' : options.text;
  const icon = typeof options === 'string' ? 'warning' : options.icon || 'warning';
  const confirmButtonText = typeof options === 'string' ? 'Sí, confirmar' : options.confirmButtonText || 'Sí, confirmar';
  const cancelButtonText = typeof options === 'string' ? 'Cancelar' : options.cancelButtonText || 'Cancelar';
  const confirmButtonColor = typeof options === 'string' ? '#ef4444' : options.confirmButtonColor || '#ef4444';

  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor: '#64748b',
    reverseButtons: true,
    buttonsStyling: true,
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-sans',
      title: 'text-lg font-black text-slate-900 dark:text-white',
      htmlContainer: 'text-xs text-slate-500 dark:text-slate-400 font-semibold',
      confirmButton: 'px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md',
      cancelButton: 'px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md',
    },
  });

  return result.isConfirmed;
};

export const showSuccessAlert = (title: string, text?: string) => {
  Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2500,
    showConfirmButton: false,
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-sans',
    },
  });
};

export const showErrorAlert = (title: string, text?: string) => {
  Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#ef4444',
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-sans',
    },
  });
};

export default confirmDialog;
