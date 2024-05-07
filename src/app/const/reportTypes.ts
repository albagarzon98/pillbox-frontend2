export const reportTypes = {
    pharmacyRequestReport: {
        service: "pharmacyRequestService",
        title: "Reporte de solicitudes de farmacia",
        hasPeriodfilter: true,
        filters: [
            {
                label: "Estado: ",
                formGroupName: "requestStatus",
                type: "select",
                values: [
                    { value: "todas", viewValue: "Todas" },
                    { value: "aprobado", viewValue: "Pendientes" },
                    { value: "rechazado", viewValue: "Aprobadas" },
                    { value: "pendiente", viewValue: "Rechazadas" },
                ]
            }
        ]
    }
}