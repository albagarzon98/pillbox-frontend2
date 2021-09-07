export class Pharmacy {
    name: string;
    address: string;
    businessHours: string;
    imgName: string
}

export const Pharmacies: Pharmacy[] = [
    {
        name: "Farmacia Líder - Barrio Jardín",
        address: "Av. Pablo Richieri 3116",
        businessHours: "8:00–20:00",
        imgName: "lider"
    },{
        name: "Farmacity",
        address: "José Manuel Estrada 153",
        businessHours: "8:00–20:00",
        imgName: "farmacity"
    },{
        name: "Farmacia General Paz",
        address: "Blvd. Chacabuco 787",
        businessHours: "9:00–21:00",
        imgName: "generalPaz"
    },{
        name: "Farmacia Estrella",
        address: "Blvd. Chacabuco 200",
        businessHours: "Abierto las 24 horas",
        imgName: "estrella"
    }
];