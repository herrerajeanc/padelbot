const express = require('express');
const app = express();

app.use(express.json());

const games = {}; // Almacena los juegos activos

app.post('/start_game', (req, res) => {
    const { game_id, group_id } = req.body;
    games[game_id] = {
        group_id: group_id,
        players: []
    };
    res.json({ message: "Juego iniciado y mensaje fijado en el grupo", game_id });
});

app.post('/join_game', (req, res) => {
    const { game_id, player } = req.body;

    if (games[game_id]) {
        games[game_id].players.push(player);
        res.json({ message: `${player} se unió al juego`, players: games[game_id].players });
    } else {
        res.status(404).json({ error: "Juego no encontrado" });
    }
});

app.get('/get_players', (req, res) => {
    const game_id = req.query.game_id;

    if (games[game_id]) {
        res.json({ players: games[game_id].players });
    } else {
        res.status(404).json({ error: "Juego no encontrado" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
