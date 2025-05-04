export interface Payment {
    idpago?: number;
    montoesperado: number;
    montopagado: number;
    fechapago: Date | null;
    estado: string;
    enlacecomprobante: string | null;
    idplanpago: number;
}
