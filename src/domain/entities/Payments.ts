export interface Payment {
    idpago?: number;
    montoesperado: number;
    montopagado: number;
    fechapago: Date;
    estado: string;
    enlacecomprobante: string | null;
    idplanpago: number;
}
