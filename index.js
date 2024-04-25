const express = require('express');
const cors = require('cors');
app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use (express.json());




app.get('/',(req,res)=>{
    res.send('Painting and Drawing')
})
app.listen(port,()=>{
    console.log(`Painting and drawing server is running on port : ${port}`);
})