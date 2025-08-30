import Swal from 'sweetalert2';

export function showJsonLoadErrorAlert() {
  Swal.fire({
    icon: 'error',
    title: 'Error de datos',
    html: '<strong>No se pudo cargar el archivo o los datos guardados.</strong><br><br>💡 Verifica que el archivo JSON esté bien formado y tenga el formato correcto.',
    confirmButtonColor: '#7c3aed'
  });
}
