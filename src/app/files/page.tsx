"use client";
import { useState } from "react";
import { pinata } from "@/lib/config";
import {
    Box,
    Button,
    Container,
  } from '@mui/material';
export default function FilePinataPage() 
{
    const [file, setFile] = useState<File>();
    const [uploading, setUploading] = useState(false);
    const uploadFile = async() => {
        if(!file){
            console.log("Imagen no seleccionada");
            return;
        }
        try{
            setUploading(true);
            const urlRequest = await fetch("api/files");
            const urlResponse = await urlRequest.json();
            const upload = await pinata.upload.public
                .file(file)
                .url(urlResponse.url);
            console.log(upload);
            setUploading(false);
        }catch(error){
            console.log(error);
            setUploading(false);
            console.log("error al cargar archivos")
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target?.files?.[0]);
    };

    return (
        <Container maxWidth="sm">
        <Box sx={{ 
            mt: 8, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
        }}>
            <Box>   
                <Box>
                <input type="file" onChange={handleChange}/>
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={uploading}
                    onClick={uploadFile}
                >
                    {uploading? "uploading......" : "Upload"}
                </Button>
                </Box>
            </Box>
        </Box>
        </Container>
    );
}