import { PharmacyRequest } from "../models/pharmacy-request";
import { Reminder } from "../models/reminder";
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
        chartType: {
            name: chartTypes.pieChart.name,
            propertyToCount: "status"
        }
    },
    reminderReport: {
        serviceFunction: "getReminderHistory",
        title: "Reporte de medicamentos tomados",
        hasPeriodfilter: true,
        model: Reminder,
        filters: [
            {
                label: "Finalizado: ",
                formGroupName: "finished",
                type: "select",
                values: [
                    { value: "true", viewValue: "Si" },
                    { value: "false", viewValue: "No" },
                ]
            }
        ],
        tableTitles: {
            startDate: "Fecha de inicio",
            endDate: "Fecha de fin",
            medicationName: "Nombre",
            grammage: "Gramaje",
            frequency: "Frecuencia de toma",
            dose: "Dosis",
            unit: "Unidad",
        },
        chartType: null
    }
}