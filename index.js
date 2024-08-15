const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 8000
const corsOptions = {
    origin: [
      'http://localhost:5173', 
      'http://localhost:5174',
      

    ],
    credentials: true,
    optionSuccessStatus: 200,
  }
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };

  app.use(cors(corsOptions)) 
  app.use(express.json())
  app.use(cookieParser())

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token
  // console.log(token)
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access 39', })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access 44' })
    }
    req.user = decoded
    next()
  })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zumttn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    const db = client.db('Mughdo-Mart')
    const usersCollection = db.collection('users')
    const productsCollection = db.collection('products')
         
    
    // verify admin middleware
         const verifyAdmin = async (req, res, next) => {
          // console.log('hello')
          const user = req.user
          const query = { email: user?.email }
          const result = await usersCollection.findOne(query)
          // console.log(result?.role)
          if (!result || result?.role !== 'Admin')
            return res.status(401).send({ message: 'unauthorized access!!' })
    
          next()
        }

        // jwt generate
   app.post('/jwt', async (req, res) => {
    const email = req.body
    const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '365d',
    })
    res
      .cookie('token', token,  {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .send({ success: true })
  })

        // clere cookis
    app.post('/logout', async (req, res) => {
      const user = req.body;
      console.log('logging out', user);
      res.clearCookie('token', {...cookieOptions,  maxAge: 0 }).send({ success: true })
  })

    // save a user data in db
    app.put('/user',  async (req, res) => {
      const user = req.body

      const query = { email: user?.email }
      // check if user already exists in db
      const isExist = await usersCollection.findOne(query)
      if (isExist) {
        
          // if existing user login again
          return res.send(isExist)
        
      }
      // save user for the first time
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          ...user,
          timestamp: Date.now(),
        },
      }
      const result = await usersCollection.updateOne(query, updateDoc, options)
      
      res.send(result)
    })
    app.post('/add-product', verifyToken, async(req, res)=>{
      const productData = req.body;
      // console.log(productData)
      const result = await productsCollection.insertOne(productData)
      return res.send(result)
    })
    app.get('/get-all-product',async (req, res)=>{
      
      const productBrand = req.query.productBrand
      const categoryName = req.query.categoryName
      const priceRang = req.query.price
      const searchText = req.query.searchText
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const parts = priceRang.split("-");
      const startPrice = parseInt(parts[0]) || 1;
      const endPrice = parseInt(parts[1]) || 1000;
      const query = {
        currentPrice: {
          $gte: startPrice, // $gte: greater than or equal to startPrice
          $lte: endPrice    // $lte: less than or equal to endPrice
        }
      };

      const result = await productsCollection.find(query).skip(page * size).limit(size).toArray()
      console.log(result.length)
      res.send("data not found")
    })


    app.get('/productCount', async (req, res) => {
      const count = await productsCollection.countDocuments();
      // console.log(count, "this is count")
      res.send({ count });
    })
  } finally {
   
  }
}
run().catch(console.dir);
  app.get('/', (req, res) => {
    res.send('Hello from Mugdho mart Server..')
  })
  
app.listen(port, () => {
    console.log(`MughdoMart is running on port ${port}`)
  })