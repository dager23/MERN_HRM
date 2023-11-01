import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import mongoose from 'mongoose';
import { exec } from 'child_process';


mongoose.connect('mongodb://0.0.0.0:27017/empmern', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    salary: Number,
    image: String
  });

  
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
  });

const Employee = mongoose.model('employee', employeeSchema);
const User = mongoose.model('user', userSchema);

const app = express();
app.use(cors(
    {
        origin: ["http://localhost:5173"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('E:/employeesys/frontend/public'));


exec('python generate_graph.py', (error, stdout, stderr) => {
  console.log("Script executed")
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

app.get('/get_image', (req, res) => {
  // Replace 'path_to_your_image_folder' with the actual path to the folder where the image file is saved
  path = 'E:/employeesys/server/image/graph.png'
  return send_file(path)
}); 

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "signup"
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'E:/employeesys/frontend/public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})

con.connect(function(err) {
    if(err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
})

/*
app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})
*/

app.get('/getEmployee', async (req, res) => {
    const collection = db.collection('employee');
    try {
      const results = await collection.find().toArray();
      res.json({ Status: 'Success', Result: results });
    } catch (err) {
      res.json({ Error: 'Get employee error in MongoDB' });
    }
  });


/*
app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})
*/

app.get('/employeedetail/:id', async (req, res) => {
    const collection = db.collection('employee');
    try {
        const identity = parseInt(req.params.id, 10); // Assuming base 10
      const employee1 = await collection.find({id: identity}).toArray(); // Assuming 'id' is a field in your database
      if (!employee1) {
        res.status(404).json({ Error: 'Employee not found' });
        return;
      }
      console.log(employee1)
      res.json({ Status: 'Success', Result: employee1 });
    } catch (err) {
      res.json({ Error: 'Get employee error in MongoDB' });
    }
  });
  
  

// app.put('/update/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = "UPDATE employee set salary = ? WHERE id = ?";
//     con.query(sql, [req.body.salary, id], (err, result) => {
//         if(err) return res.json({Error: "update employee error in sql"});
//         return res.json({Status: "Success"})
//     })
// })

app.put('/update/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updateQuery = {
      $set: {
        salary: req.body.salary,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        image: req.body.filename

      },
    };
    //console.log(id)
    console.log(req.body.image)
    db.collection('employee').updateOne({ id: id }, updateQuery, (err, result) => {
      if (err) return res.json({ Error: 'update employee error in mongodb' });
      return res.json({ Status: 'Success' });
    });
  });

// app.delete('/delete/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = "Delete FROM employee WHERE id = ?";
//     con.query(sql, [id], (err, result) => {
//         if(err) return res.json({Error: "delete employee error in sql"});
//         return res.json({Status: "Success"})
//     })
// })

app.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const deleteQuery = { id: id };
    db.collection('employee').deleteOne(deleteQuery, (err, result) => {
      if (err) return res.json({ Error: 'delete employee error in mongodb' });
      return res.json({ Status: 'Success' });
    });
  });

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Error: "You are no Authenticated"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) return res.json({Error: "Token wrong"});
            req.role = decoded.role;
            req.id = decoded.id;
            next();
        } )
    }
}

app.get('/dashboard',verifyUser, (req, res) => {
    return res.json({Status: "Success", role: req.role, id: req.id})
})

// app.get('/adminCount', (req, res) => {
//     const sql = "Select count(id) as admin from user";
//     con.query(sql, (err, result) => {
//         if(err) return res.json({Error: "Error in runnig query"});
//         return res.json(result);
//     })
// })

app.get('/adminCount', async (req, res) => {
    const collection = db.collection('user');
    try {
      const adminCount = await collection.countDocuments();
      //console.log('Admin Count:', adminCount);
      res.json({ adminCount });
    } catch (err) {
      res.json({ Error: 'Error in running query' });
    }
  });


// app.get('/employeeCount', (req, res) => {
//     const sql = "Select count(id) as employee from employee";
//     con.query(sql, (err, result) => {
//         if(err) return res.json({Error: "Error in runnig query"});
//         return res.json(result);
//     })
// })

app.get('/employeeCount', async (req, res) => {
    const collection = db.collection('employee');
    try {
      const employeeCount = await collection.countDocuments();
      //console.log('Employee Count:', employeeCount);
      res.json({ employeeCount });
    } catch (err) {
      res.json({ Error: 'Error in running query' });
    }
  });

// app.get('/salary', (req, res) => {
//     const sql = "Select sum(salary) as sumOfSalary from employee";
//     con.query(sql, (err, result) => {
//         if(err) return res.json({Error: "Error in runnig query"});
//         return res.json(result);
//     })
// })

app.get('/salary', async (req, res) => {
    const aggregateQuery = [
      { $group: { _id: null, sumOfSalary: { $sum: '$salary' } } },
    ];
    
    try {
      const result = await db.collection('employee').aggregate(aggregateQuery).toArray();
      console.log(result);
      res.json({ result });
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving salary data' });
    }
  });
  


// app.post('/login', (req, res) => {
//     const sql = "SELECT * FROM user Where email = ? AND  password = ?";
//     con.query(sql, [req.body.email, req.body.password], (err, result) => {
//         if(err) return res.json({Status: "Error", Error: "Error in running query"});
//         if(result.length > 0) {
//             const id = result[0].id;
//             const token = jwt.sign({role: "admin"}, "jwt-secret-key", {expiresIn: '1d'});
//             res.cookie('token', token);
//             return res.json({Status: "Success"})
//         } else {
//             return res.json({Status: "Error", Error: "Wrong Email or Password"});
//         }
//     })
// })

app.post('/login', async (req, res) => {
    const email = req.body.email.toString();
    const password = req.body.password.toString();
    console.log(email)
    console.log(password)
  
    const user = await db.collection('user').findOne({ email : email });
   // console.log(user.email)
    //console.log(user.password)
  
    if (!user) {
      return res.json({ Status: 'Error', Error: 'Wrong Email' });
    }
    //password = user.password
  
    if (password !== user.password) {
        return res.json({ Status: 'Error', Error: 'Wrong Password' });
      }
      
  
    const token = jwt.sign({ role: user.role }, 'jwt-secret-key', { expiresIn: '1d' });
    res.cookie('token', token);
    return res.json({ Status: 'Success' });
  });

// app.post('/employeelogin', (req, res) => {
//     const sql = "SELECT * FROM employee Where email = ?";
//     con.query(sql, [req.body.email], (err, result) => {
//         if(err) return res.json({Status: "Error", Error: "Error in runnig query"});
//         if(result.length > 0) {
//             bcrypt.compare(req.body.password.toString(), result[0].password, (err, response)=> {
//                 if(err) return res.json({Error: "password error"});
//                 if(response) {
//                     const token = jwt.sign({role: "employee", id: result[0].id}, "jwt-secret-key", {expiresIn: '1d'});
//                     res.cookie('token', token);
//                     return res.json({Status: "Success", id: result[0].id})
//                 } else {
//                     return res.json({Status: "Error", Error: "Wrong Email or Password"});
//                 }
                
//             })
            
//         } else {
//             return res.json({Status: "Error", Error: "Wrong Email or Password"});
//         }
//     })
// })

app.post('/employeelogin', async (req, res) => {
    const email = req.body.email.toString();
    const password = req.body.password.toString();
    console.log(email)
    console.log(password)
  
    const user = await db.collection('employee').findOne({ email : email });
    //console.log(user.email)
    //console.log(user.password)
  
    if (!user) {
      return res.json({ Status: 'Error', Error: 'Wrong Email' });
    }
    //password = user.password
  
    if (password !== user.password) {
        return res.json({ Status: 'Error', Error: 'Wrong Password' });
      }
  
    const token = jwt.sign({ role: user.role }, 'jwt-secret-key', { expiresIn: '1d' });
    res.cookie('token', token);
    return res.json({ Status: 'Success',id: user.id });
  });


app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

// app.post('/create',upload.single('image'), (req, res) => {
//     const sql = "INSERT INTO employee (`name`,`email`,`password`, `address`, `salary`,`image`) VALUES (?)";
//     bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
//         if(err) return res.json({Error: "Error in hashing password"});
//         const values = [
//             req.body.name,
//             req.body.email,
//             hash,
//             req.body.address,
//             req.body.salary,
//             req.file.filename
//         ]
//         con.query(sql, [values], (err, result) => {
//             if(err) return res.json({Error: err}, console.log(err));
//             return res.json({Status: "Success"});
//         })
//     } )
// })

app.post('/create', upload.single('image'), async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;
    const salary = parseInt(req.body.salary);
    const image = req.file.filename;
    const id = parseInt(req.body.id);
  
    // Hash the password.
    const hash = await bcrypt.hash(password, 10);
  
    // Create the employee document.
    const employee = {
      name,
      email,
      password,
      address,
      salary,
      image,
      id
    };
  
    // Save the employee document to the database.
    await db.collection('employee').insertOne(employee);
  
    // Return a success response.
    return res.json({ Status: 'Success' });
  });

app.listen(8081, ()=> {
    console.log("Running");
})