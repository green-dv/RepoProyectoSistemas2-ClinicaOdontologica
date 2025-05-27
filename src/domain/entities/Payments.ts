export interface Payment {
    idpago?: number;
    montoesperado: number;
    montopagado: number | null;
    fechapago: Date | null;
    estado: string;
    enlacecomprobante: string | null;
    idplanpago: number;
}
