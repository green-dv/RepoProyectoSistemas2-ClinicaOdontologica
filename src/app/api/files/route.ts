import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const uploadOptions = {
      pinataMetadata: {
        name: "comprobante-pago",
        keyvalues: {
          tipo: "comprobante"
        }
      },
      pinataOptions: {
        cidVersion: 0
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        uploadOptions,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al configurar subida'
    }, { status: 500 });
  }
}