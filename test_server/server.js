const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:5500', 
    credentials: true 
}));

// app.use(cors({
//     origin: '*',  
//     credentials: false
// }));

app.use(express.json());

app.post('/beacon', (req, res) => {
    console.log('\n\n#####################################\n\n')
    console.log('Received data:', req.body.interactions);
    res.sendStatus(200);
});

app.listen(5001, () => console.log('Server running on port 5001'));
