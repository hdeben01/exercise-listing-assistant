import { Router, type Request, type Response } from 'express';
import { type Provider } from '../providers/provider.ts';
import { GeminiProvider } from '../providers/geminiProvider.ts';
import { type ListingRequest, type ListingResponse, type Listing } from '../models.ts';
import { MockProvider } from '../providers/mockProvider.ts';
const router = Router();

router.post('/', (req: Request, res: Response) => {
    let provider: Provider;
    if(process.env.MODE == 'MOCK'){
        provider = new MockProvider;
    }else{
        provider = new GeminiProvider;
        
    }

    const parsedRequest = req.body as ListingRequest;
        let aiResponse: Listing;
        provider.processDescription(parsedRequest.description).then((listing) => {
            aiResponse = listing;
            return res.status(200).send(aiResponse as ListingResponse);
        }).catch((err) =>{
            console.log(err);
            return res.status(500).send("Something went wrong");
        });
});

export default router;