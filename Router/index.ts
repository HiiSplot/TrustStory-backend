import { type Express } from 'express'
import { UserController } from '../Controller/UserController';
import { ProfilController } from '../Controller/ProfilController';
import { StoryController } from '../Controller/StoryController';
import { FavoriteController } from '../Controller/FavoriteController';

const setupRoutes = (app: Express): void => {

  app.get('/', (req, res) => {
    res.send('Hello from the backend!');
    console.log('Hello from the backend!');
  });
  
  app.use(UserController)
  app.use(ProfilController)
  app.use(StoryController)
  app.use(FavoriteController)
}

export default setupRoutes
