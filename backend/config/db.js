const moogose = require('mongoose');

// Connect to MongoDB
const dbUser = process.env.DB_USER;
const dbPassword =  process.env.DB_PASSWORD;

const conn = async () => {
    try{
        const dbConn = await moogose.connect(`mongodb+srv://${dbUser}:${dbPassword}@clusterreactgram.1bgtsfi.mongodb.net/?retryWrites=true&w=majority&appName=ClusterReactGram`);
        console.log("MongoDB conectado");
        return dbConn;
    } catch (error) {
        console.error("Conexão com MongoDB falhou:", error);
        throw error;
    }
}
conn();
module.exports = conn;
