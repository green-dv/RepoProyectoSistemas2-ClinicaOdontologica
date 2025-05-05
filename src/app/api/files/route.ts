import { NextRequest, NextResponse } from 'next/server';
import { pinata } from "@/lib/config";
import { Readable } from "stream";

export async function GET() {
    try{
        const url = await pinata.upload.public.createSignedURL({
             expires: 3600,   
        })
        return NextResponse.json(
            { url: url},
            { status: 200},
        );
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            { message: "Error creating API key"},
            { status: 500},
        );
    }
}
