import Swal from "sweetalert2";


export function loaderWithTime(time) {
    Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Espere por favor...',
        heightAuto: false,
        timer: time
    });
    Swal.showLoading();
}

export function loader() {
    Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Espere por favor...',
        heightAuto: false
    });
    Swal.showLoading();
}