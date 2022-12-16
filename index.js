const fetch = require('node-fetch');
const express = require('express');
const app = express(); 
const { Client, Intents } = require('discord.js');
require('dotenv').config();

const {Configuration, OpenAIApi} = require('openai')

// setting react client

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


//configur Open Ai

const configuration = new Configuration({apiKey:process.env.OPENAI_API_KEY})

//init openai

const openai = new OpenAIApi(configuration)

// Get Quote

async function getCompletion(prompt){


    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.61,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1,
      })

        const answer = completion.data.choices[0].text

      return answer;

}







client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
      
  });





  client.on('message', async (msg) => {

try{
    let prefix = '/';
    let message = msg.content.trim()
    if(message.startsWith(prefix)) {
        let command = message.slice(prefix.length).split(' ')[0];
        let question = message.slice(5,message.length+1);
        let errorMsg = ' 🤦  something went wrong recheck  the prompt before you send again'
        if(command == 'askMe'){
            if(question.length > 1){
                let data = await getCompletion(question);
                if(question){
                    try{
                        msg.reply(data)
    
                    }catch(err){
                        msg.reply(errorMsg)
                    }
                } 
            }else{
                msg.reply( '🙅 prompt length must grater than 1')
            }
 
        }
        
    }



}catch(error){
    console.log(error)
}
});
    
app.listen(process.env.PORT, () => {
    console.log(`Now listening on port ${process.env.PORT}`);
});


client.login(process.env.TOKEN); 
