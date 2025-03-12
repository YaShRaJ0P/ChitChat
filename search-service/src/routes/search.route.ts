import { Router } from 'express';
import { SearchController } from '../controllers';

const SearchRouter = Router();

SearchRouter.get('/', SearchController.getSearchResult);

export default SearchRouter;