# ChatGDP-DiscordBot HAL9000
![alt text](https://hypebeast.com/wp-content/blogs.dir/6/files/2022/08/gucci-exquisite-campaign-stanley-kubrick-movies-1.jpg)
# Background 
ChatGPT is a cutting-edge AI language model that has been trained to generate human-like text. It's capable of answering questions, generating creative writing, and even coding!

In the fast-paced world we live in, time is of the essence. And that's where ChatGPT can be a game-changer. A ChatGPT discord bot can provide quick answers to your questions and assist you with code corrections, saving you valuable time.

Whether it's a simple query or a complex coding issue, a ChatGPT bot can provide accurate answers in a matter of seconds. With its advanced training, it has a wealth of knowledge at its disposal, and can easily assist with troubleshooting and debugging code.

Moreover, ChatGPT is not just limited to answering questions - it can also write coherent and creative content, making it a versatile tool for a variety of applications.

In conclusion, I believe that ChatGPT is the future of AI-powered language models and has the potential to revolutionize the way we work and communicate. If you haven't already, I highly recommend integrating a ChatGPT discord bot into your workflow to experience its benefits for yourself.

# What is the OpenAI API
The OpenAI API is a cloud-based platform that allows developers to access advanced artificial intelligence models in a simple and streamlined manner. With the API, developers can build applications and services that can perform a wide range of tasks, such as natural language processing, machine translation, and more. The API is designed to be highly scalable and flexible, enabling developers to build powerful and intelligent applications that can learn and evolve over time. Elon Musk is not involved in the day-to-day operations of OpenAI and may not have a deep understanding of the API's capabilities and functionality.

### [PRD] GPT -3 Discord Bot 'HAL'
Status: { Draft }
Author: F.Bueller
References { https://platform.openai.com/docs/introduction/overview }
Last Update: Feb 25 2023

----- 

### Glossary
- ChatGDP
- GPT -3 
- Fine-tuning
- Embedding
- Elastic Beanstalk
- S3
- max_tokens
- LLM

### Goals
- Integrating GPT -3 for use on discord as a personal assistant 
- Make upgrading and discord bot faster and more effiecent
- Allowing for use of learning models that is independent from ChatGDP site

### Concepts 

##### Fine-tuning 
- GPT-3 has been pre-trained on a vast amount of text from the open internet. When given a prompt with just a few examples, it can often intuit what task you are trying to perform and generate a plausible completion. This is often called "few-shot learning."

	Fine-tuning improves on few-shot learning by training on many more examples than can fit in the prompt, letting you achieve better results on a wide number of tasks. **Once a model has been fine-tuned, you won't need to provide examples in the prompt anymore.** This saves costs and enables lower-latency requests.

##### Embeddings 
- An embedding is a vector (list) of floating point numbers. The [distance](https://platform.openai.com/docs/guides/embeddings/which-distance-function-should-i-use) between two vectors measures their relatedness. Small distances suggest high relatedness and large distances suggest low relatedness.

##### Tokens 
- Our models understand and process text by breaking it down into tokens. Tokens can be words or just chunks of characters. For example, the word “hamburger” gets broken up into the tokens “ham”, “bur” and “ger”, while a short and common word like “pear” is a single token. Many tokens start with a whitespace, for example “ hello” and “ bye”.

	The number of tokens processed in a given API request depends on the length of both your inputs and outputs. As a rough rule of thumb, 1 token is approximately 4 characters or 0.75 words for English text. One limitation to keep in mind is that your text prompt and generated completion combined must be no more than the model's maximum context length (for most models this is 2048 tokens, or about 1500 words). Check out our [tokenizer tool](https://platform.openai.com/tokenizer) to learn more about how text translates to tokens.

### Timeline
| Status | Action                                        | Reason                                                     |     
| ------ | --------------------------------------------- | ---------------------------------------------------------- | 
| Done   | Create local running discord bot using GDP -3 | Prove GDP -3 can be used for a discord bot                 |     
| Done    | Design AWS architecture                       | Allow for bot to be online                                 |     
| TBD    | Fine tuning                                   | Create a more  capable daily assistant for a specific user |                                                     |                                                            |     |

### Architecture 
---- 
##### Goals
| Status | Action                                  | Reason                                                                                              |
| ------ | --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Done  | Create multiple enviorments on AWS      | This is so we there can be a testing enviorment so that harmful chnages can be observed             |
| Done  | Create Deployment script GitHub Actions | Use github actions dpeloy script to deploy to the needed aws enviorment before being pushed to main |
|   NA     |        Link application to database                                 |      This will allow for fine-tuning                                                                                               |
|        |                                         |                                                                                                     |


![alt text](https://github.com/teelrabbit/ChatGDP-DiscordBot/blob/main/diagram.png?raw=true)





