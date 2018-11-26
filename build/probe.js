const net = require('net')

const probePromise = (pPort) => {
    return new Promise(resolve => {
        (function probe(inPort) {
            const server = net.createServer().listen(inPort)
            server.on('listening', () => {
                server.close()
                resolve(inPort)
            })
            server.on('error', () => {
                probe(inPort + 1)
            })
        })(pPort)
    })
}
module.exports = async (port) => {
    const rp = await probePromise(port)
    return rp;
}
