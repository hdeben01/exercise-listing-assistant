### AI Assistants used in this project:
- Gemini Flash 3.8: General assistance for code
- Claude Sonnet 5: Some specific UI prompts that Gemini couldn't solve.

### Prompts that unlocked something:
- The model suddenly started answering in Spanish and I didn't know why, I copy pasted the system prompt and asked the AI why it could be happening, the AI pointed out that I was mentioning Wallapop in the system prompt and that is why it was inferring the Spanish language.

- Candidate: I was doubting on how to handle the mock mode, at first I was planning on having premade example inputs on the front and the user would just have to select one of those inputs and send it to the backend in mock mode, then the mockProvider would search for the response in a map and just return it. That would make the input impossible to test from the reviewer perspective (because it would involve changing the input for a select). I asked the AI and it suggested keeping the input and then adding some recommended prompts in the mock mode so the reviewer could test for specific situations (wrong model output, etc). So I chose that solution and if any of the inputs doesnt match what the mockProvider has in a map It would just return a random model Output (including mistakes). 

### A time the AI got it wrong, and how you spotted it:
- Candidate: When scaffolding the UI, the AI overdid the frontend adding unnecessary complexity and bad structure, I had to cycle and
loop through the design with the AI to have a somewhat functional design.
- Candidate: It is not exactly wrong but the AI suggested tracking the currency of the price which I think it is overkill for a demo like this


### Anything in your codebase you do not fully undestand:
- Candidate: All CSS rules in the assistant page

### What you would fix with another four hours