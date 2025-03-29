import { Pool } from 'pg';

let conn: Pool | undefined;
//============================================================================
// Conexion a la base de datos
//============================================================================
/* 
  se debe crear un archivo .env en la raiz del proyecto esta se debe llamar
  .env.local en donde se debe poner las credenciales de la base de datos
  solo por temas de seguridad. 
  el gitnore ya tiene ignorado este archivo .env.local para que no se suba al
  repositorio  
*/
const getConnection = (): Pool => {
  if (!conn) {
    conn = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_DATABASE,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
  }
  return conn;
};

export { getConnection };