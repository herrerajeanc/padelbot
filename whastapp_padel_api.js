// Importar dependencias
const express = require("express");
const axios = require("axios");
require("dotenv").config();

// Inicializar la app
const app = express();
app.use(express.json());

// Configuración de WhatsApp Cloud API
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Ruta de verificación de Webhook (para WhatsApp Cloud API)
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verificado correctamente");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Ruta para recibir mensajes de WhatsApp
app.post("/webhook", async (req, res) => {
    const body = req.body;

    if (body.object) {
        const entry = body.entry[0];
        const changes = entry.changes[0];
        const value = changes.value;
        const messages = value.messages;

        if (messages) {
            const message = messages[0];
            const from = message.from;
            const text = message.text.body;
            console.log(`Mensaje recibido de ${from}: ${text}`);

            // Responder mensaje de prueba
            await sendMessage(from, "¡Hola! Recibimos tu mensaje y pronto te responderemos.");
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Función para enviar mensajes a WhatsApp
async function sendMessage(to, message) {
    try {
        await axios.post(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
            messaging_product: "whatsapp",
            to,
            text: { body: message },
        }, {
            headers: {
                "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error enviando mensaje:", error.response ? error.response.data : error.message);
    }
}

// Puerto de la API
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});
