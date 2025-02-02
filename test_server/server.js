const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:5500', // Set to your frontend's origin
    credentials: true // Allow cookies and authorization headers
}));

// app.use(cors({
//     origin: '*',  // ⚠️ This will not work with credentials: true
//     credentials: false
// }));

app.use(express.json());

app.post('/beacon', (req, res) => {
    console.log('\n\n#####################################\n\n')
    console.log('Received data:', req.body.interactions);
    res.sendStatus(200);
});

app.listen(5001, () => console.log('Server running on port 5001'));
