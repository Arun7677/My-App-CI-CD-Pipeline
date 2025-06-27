const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const userModel = require('./models/userModel');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = swaggerJsdoc(require('./swaggerConfig'));


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.set('view engine','ejs');

app.get('/user/create' , (req,res)=>{
    res.render('create');
})
app.get('/',(req,res)=>{
    res.render('login');
})

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully created
 */

app.post('/user/create',(req,res)=>{
    let{name,email,password} = req.body;
    bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password, salt,async function(err, hash) {
    let user = await userModel.create({
    name,
    email,
    password:hash,
 })
 res.json({
    success: true,
    message: 'User successfully created!',
    redirectUrl: '/login'
});
 });
    })
 })

app.post('/login',(req,res)=>{
    let{email,password}= req.body;
    let user = userModel.findOne({email:email});
    if(user){
        bcrypt.compare(password,user.password,(err,result)=>{
            if(!result){
                res.json({
                    message:"No User Found!",
                    redirectUrl:"/user/create"
                })
            }
            else{
                res.json({
                    success:true,
                    message:"Sucessfully Logged In",
                    redirectUrl:"/profile/:user"
                 })
            }
         } )}
  })

app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/user/update',(req,res)=>{
    let {id, name, email} = req.body;
    userModel.findByIdAndUpdate(id, {name, email}, {new: true})
    .then(user => {
        if(user) {
            res.json({
                success: true,
                message: 'User updated successfully!',
                user: user
            });
        } else {
            res.json({
                success: false,
                message: 'User not found!'
            });
        }
    })
    .catch(err => {
        res.json({
            success: false,
            message: 'Error updating user!'
        });
    });
})

app.delete('/user/delete/:id',(req,res)=>{
    let {id} = req.params;
    userModel.findByIdAndDelete(id)
    .then(user => {
        if(user) {
            res.json({
                success: true,
                message: 'User deleted successfully!'
            });
        } else {
            res.json({
                success: false,
                message: 'User not found!'
            });
        }
    })
    .catch(err => {
        res.json({
            success: false,
            message: 'Error deleting user!'
        });
    });
})

app.get('/user/:id',(req,res)=>{
    let {id} = req.params;
    userModel.findById(id)
    .then(user => {
        if(user) {
            res.json({
                success: true,
                user: user
            });
        } else {
            res.json({
                success: false,
                message: 'User not found!'
            });
        }
    })
    .catch(err => {
        res.json({
            success: false,
            message: 'Error fetching user!'
        });
    });
})

app.get('/users',(req,res)=>{
    userModel.find({})
    .then(users => {
        res.json({
            success: true,
            users: users
        });
    })
    .catch(err => {
        res.json({
            success: false,
            message: 'Error fetching users!'
        });
    });
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});