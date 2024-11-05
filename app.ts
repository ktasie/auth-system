import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
//import util from 'util';
import { RequestHandlerParams } from 'express-serve-static-core';

const app = express();

//middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.set('views', './views');
app.set('view engine', 'pug');

type Person = {
  id: number;
  name: string;
  username: string;
  password: string;
}[];

// Data structure to hold user credentials.
const credentials: Person = [];
// e297Vovy1_>a
credentials.push({
  id: 1,
  name: 'Kelechukwu',
  username: 'ktasie',
  password: '5277ac38915c2828541c426ecd328d6f',
});

//j'RCK8l265=!
credentials.push({
  id: 2,
  name: 'Taylor',
  username: 'taylor',
  password: 'f1249612d5c280ad3d4f893d514d500b',
});

//console.log(process.env.JWT_SECRET);
const generateToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30m',
  });
};

const protect = async (req: Request, res: Response, next: NextFunction) => {
  let id;
  const token = req.cookies['jwt'];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  //const promiseVerify = util.promisify(jwt.verify):Promise<>;
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, id: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    (req as any).id = id;
    next();
  });

  //await promiseVerify(token, 'hi');
};
//Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).sendFile(`${__dirname}/index.html`);
});

app.get(
  '/dashboard',
  protect as RequestHandlerParams,
  (req: Request, res: Response) => {
    res.status(200).sendFile(`${__dirname}/dashboard.html`);
  }
);

//app.get('/dashboard', protect, )
app.post('/api/v1/submit', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // hash received password.
    const passwordHash: string = crypto
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

    //Generate token
    const token = generateToken(result.id);

    //Send token as cookie.
    res.cookie('jwt', token, {
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Output json if everything is fine.
    res.status(200).json({
      status: 'success',
      name: `${result.name}`,
      token,
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      status: 'fail',
      message: `${err.message}`,
    });
  }
});

//
app.listen(3000, () => {
  console.log('App running on ports 3000');
});
