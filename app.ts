import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const app = express();

type Person = {
  name: string;
  username: string;
  password: string;
}[];

// Data structure to hold user credentials.
const credentials: Person = [];
// e297Vovy1_>a
credentials.push({
  name: 'Kelechukwu',
  username: 'ktasie',
  password: '5277ac38915c2828541c426ecd328d6f',
});

//j'RCK8l265=!
credentials.push({
  name: 'Taylor',
  username: 'taylor',
  password: 'f1249612d5c280ad3d4f893d514d500b',
});

//middlewares
app.use(express.json());
//console.log(credentials);
//Routes
app.post('/api/v1/submit', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // hash received password.
    const passwordHash:string = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');
    const result = credentials.find((person) => {
      return username === person.username && person.password === passwordHash;
    });

    // throw error if the user is not found.
    if (result === undefined) {
      throw new Error('Incorrect username and or password combination');
    }
    
    // Output json if everything is fine.
    res.json({
      status: 'success',
      name: `${result.name}`,
      token: 'token',
    });
  } catch (error ) {
    const err = error as Error;
    res.json({
      status: 'fail',
      message: `${err.message}`,
    });
  }
});

//
app.listen(3000, () => {
  console.log('App running on ports 3000');
});
