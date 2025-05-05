import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/application/usecases/payments/paymentUseCase';
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository';
import { PaymentPlanRepository } from '@/infrastructure/repositories/PaymentPlanRepository';

const paymentRepository = new PaymentRepository();
const paymentPlanRepository = new PaymentPlanRepository();
const paymentService = new PaymentService(paymentRepository, paymentPlanRepository);

interface UpdateComprobanteRequest {
  enlacecomprobante: string;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de pago inválido' },
        { status: 400 }
      );
    }

    const body: UpdateComprobanteRequest = await request.json();
    if (!body.enlacecomprobante) {
      return NextResponse.json(
        { success: false, error: 'El campo enlacecomprobante es requerido' },
        { status: 400 }
      );
    }

    if (!isValidIpfsUrl(body.enlacecomprobante)) {
      return NextResponse.json(
        { success: false, error: 'URL de comprobante no válida' },
        { status: 400 }
      );
    }

    const paymentExists = await paymentService.getPaymentById(id);
    if (!paymentExists) {
      return NextResponse.json(
        { success: false, error: 'Pago no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el pago
    const updatedPayment = await paymentService.updatePayment({
      idpago: id,
      enlacecomprobante: body.enlacecomprobante,
      estado: 'completado' 
    });

    return NextResponse.json(
      { 
        success: true,
        data: updatedPayment,
        message: 'Comprobante actualizado exitosamente' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al actualizar comprobante:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Error en el servidor' 
      },
      { status: 500 }
    );
  }
}

// validar URLs 
function isValidIpfsUrl(url: string): boolean {
  return url.startsWith('https://gateway.pinata.cloud/ipfs/') || 
         url.startsWith('ipfs://');
}