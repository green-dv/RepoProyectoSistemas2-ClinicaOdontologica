import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Archivo no enviado' }, { status: 400 });
    }

    const pinataMetadata = formData.get('pinataMetadata') as string;
    const pinataOptions = formData.get('pinataOptions') as string;

    const pinataFormData = new FormData();
    pinataFormData.append('file', file);
    if (pinataMetadata) pinataFormData.append('pinataMetadata', pinataMetadata);
    if (pinataOptions) pinataFormData.append('pinataOptions', pinataOptions);

    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT!}`,
      },
      body: pinataFormData,
    });

    if (!pinataResponse.ok) {
      const text = await pinataResponse.text(); 
      return NextResponse.json(
        { success: false, error: `Pinata error: ${text}` },
        { status: pinataResponse.status }
      );
    }

    const result = await pinataResponse.json();
    return NextResponse.json({ success: true, IpfsHash: result.IpfsHash });
  } catch (error) {
    console.error('Error al subir a Pinata:', error);
    return NextResponse.json(
      { success: false, error: 'Error inesperado en servidor' },
      { status: 500 }
    );
  }
}
