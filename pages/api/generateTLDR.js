import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
const { Configuration, OpenAIApi } = require("openai");
import { encode, decode } from 'gpt-3-encoder';

const chunkIntoArrayOfN = (array, n) => {
  let chunks = [];
  for (let i = 0; i < array.length; i += n) {
    const chunk = array.slice(i, i + n);
    chunks.push(chunk);
  }
  return chunks;
}

export default withApiAuthRequired(async function shows(req, res) {
  let userPrompt = req.body.meetingText;
  if (!userPrompt) throw new Error('No user prompt provided');
  const encoded = encode(`Give me a TLDR; of the following chunk of the meeting: \n  ${userPrompt}`);

  let tokenSplitLength = 4000;

  const chunks = chunkIntoArrayOfN(encoded, tokenSplitLength);

  try {
    console.log('calling openai api');
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    let results = [];
    for (let index = 0; index < chunks.length; index++) {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a bot that gives TLDR; for meeting transcriptions" },
          { role: "user", content: `${decode(chunks[index])}` }
        ],
      });
      console.log(completion.data.choices[0].message);
      results.push(completion.data.choices[0].message.content);
    }

    console.log('Final prompt is');
    let finalPrompt = `\nCombine all the followin TLDR; to come up with a single TLDR; FIRST TLDR :\n ${results.join('\nAnother TLDR;\n')}`
    console.log(finalPrompt);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a bot that gives TLDR; for meeting transcriptions" },
        { role: "user", content: finalPrompt }
      ],
    });

    console.log('final completion');
    return res.status(200).json({
      message: completion.data.choices[0].message.content
    })

  } catch (error) {
    console.log(`Error happened ${error.messsage}, ${error.stack}`);
    res.status(error.status || 500).json({ error: error.message });
  }
});
