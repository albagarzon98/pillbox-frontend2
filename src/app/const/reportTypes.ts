import { PharmacyRequest } from "../models/pharmacy-request";
import { chartTypes } from "./chartTypes";

export const reportTypes = {
    pharmacyRequestReport: {
        serviceFunction: "getPharmacyRequests",
        title: "Reporte de solicitudes de farmacia",
        hasPeriodfilter: true,
        model: PharmacyRequest,
        filters: [
            {
                label: "Estado: ",
                formGroupName: "status",
                type: "select",
                values: [
                    { value: "aprobado", viewValue: "Aprobadas" },
                    { value: "rechazado", viewValue: "Rechazadas" },
                    { value: "pendiente", viewValue: "Pendientes" },
                ]
            }
        ],
        tableTitles: {
            creationDate: "Fecha",
            pharmacyName: "Nombre",
            address: "Dirección",
            phoneNumber: "Teléfono",
            contactEmail: "Email",
            branchesNumber: "Número de sucursales",
            status: "Estado",
        },
        chartType: chartTypes.pieChart
    }
}