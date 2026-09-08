import { Router, type NextFunction, type Request, type Response } from 'express';
import { type Provider } from '../providers/provider.ts';
import { GeminiProvider } from '../providers/geminiProvider.ts';
import { type ListingRequest, type ListingResponse, type Listing } from '../models.ts';
import { MockProvider } from '../providers/mockProvider.ts';
import { ModelResponseError, validateModelResponse } from '../modelResponseValidator.ts';
const router = Router();


function listingRequestValidator(req: Request, res: Response, next: NextFunction){

    if(!req.headers['content-type']?.includes('application/json')){
        return res.status(415).send("Content-Type must be application/json");
    }
    
    if(!req.body || typeof req.body !== 'object' || 
        typeof req.body.description !== 'string' || req.body.description.trim().length === 0){
        return res.status(400).send("The request body must be an object containing a non-empty 'description' string.");
    }
    next();
    
}

router.post('/', listingRequestValidator, async (req: Request, res: Response, next: NextFunction) => {
    let provider: Provider;
    // By default uses MOCK
    // This should be done with dependency injection
    if(process.env.MODE == 'API'){
        provider = GeminiProvider.getInstance();
    }else{
        provider = MockProvider.getInstance();
        
    }

    const parsedRequest = req.body as ListingRequest;
    try{
        const aiResponse: string | undefined = await provider.processDescription(parsedRequest.description);
        const parsedResponse: ListingResponse = validateModelResponse(aiResponse);
        res.status(200).send(parsedResponse);
    }catch(err){
        if(err instanceof ModelResponseError){
            console.log(err);
            return res.status(502).send("There was an error generating suggestions. Please try again.");
        }
        next(err);
    }
});



export default router;