export const reportTypes = {
    pharmacyRequestReport: {
        serviceFunction: "getPharmacyRequests",
        title: "Reporte de solicitudes de farmacia",
        hasPeriodfilter: true,
        filters: [
            {
                label: "Estado: ",
                formGroupName: "status",
                type: "select",
                values: [
                    { value: "todas", viewValue: "Todas" },
                    { value: "aprobado", viewValue: "Aprobadas" },
                    { value: "rechazado", viewValue: "Rechazadas" },
                    { value: "pendiente", viewValue: "Pendientes" },
                ]
            }
        ]
    }
}