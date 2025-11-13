import express from 'express'
import bootstrap from './src/app.controller.js'
const app = express()
const port = 3000
await bootstrap(app,express)
app.listen(port,(error)=>{
    if(error){
        console.log("error connect server");
    }else{
        console.log("app is listen at port",port);
    }
})