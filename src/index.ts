import Server from './classes/server';
const server = Server.instance;
// Levantar Express
async function main() {
    /* const server = new Server(); */
    /* await server.start(); */
    await server.start( () => {
        console.log(`Servidor corriendo en el puerto ${ server.port }`);
    });
}

main();
