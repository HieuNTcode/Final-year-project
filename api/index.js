const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const imageDownloader = require('image-downloader');
const Place = require('./models/Place.js')
const jwt = require('jsonwebtoken');
const app = express();
const multer = require('multer');
const fs = require('fs');
const Booking = require('./models/Booking.js');
const Review = require('./models/Review.js');
const nodemailer = require('nodemailer');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'ahwehjapowejpwejk';

app.use(express.json());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}))

mongoose.connect(process.env.MONGO_URL);
// 28hbNxKrylVmHO9l


function getUserDataFromToken(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;resolve(userData);
    });
  });
}

app.get('/test', (req,res) =>{
    res.json('test ok');
});

app.post('/register', async (req,res) => {
    const {name, email, password ,Cpassword} = req.body;
    try{
         const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
        Cpassword:bcrypt.hashSync(Cpassword, bcryptSalt),
    });
       res.json(userDoc);
    }catch (e){
        res.status(422).json(e);
    }
   
    
});

app.post('/login', async (req, res) => {
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
          jwt.sign({
            email:userDoc.email,
            id:userDoc._id
          }, jwtSecret, {}, (err,token) => {
            if (err) throw err;
            res.cookie('token', token).json(userDoc);
          });
        } else {
          res.status(422).json('pass not ok');
        }
      } else {
        res.json('not found');
      }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  if (token){
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
          if(err) throw err;
          const user = await User.findById(userData.id);
          if (user) {
              const {name,email,_id,imageProfile,description,
                age,language,lived} = user;
              res.json({name,email,_id,imageProfile,description,
                age,language,lived});
          } else {
              res.status(404).json({ error: 'User not found' });
          }
      })
  } else {
      res.json(null);
  }
})

app.post('/logout', (req,res) => {
    res.cookie('token', '').json(true);
})


app.post('/upload-by-link', async (req,res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' +newName,
  });
  res.json(newName);
}); 

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads\\',''));
  }
  res.json(uploadedFiles);
});

app.post('/places', (req,res) => {
  const {token} = req.cookies;
  const {
    title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if(err) throw err;
  const placeDoc = await Place.create({
    owner:userData.id,
    title,address,photos:addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
   });
   res.json(placeDoc);
  });
});

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get('/user-places', async (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Place.find({owner:id}));
  });
});

app.get('/places/:id', async (req,res) => {
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});


app.get('/places/:id', async (req, res) => {
  const placeId = req.params.id;
  try {
    const place = await Place.findById(placeId);
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve place' });
  }
});


app.put('/places', async (req,res) =>{
  const {token} = req.cookies;
  const {id,
    title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body; 
  jwt.verify(token, jwtSecret, {}, async (err, userData) => { 
    if (err) throw err;
    const placeDoc = await Place.findById(id);
     if (userData.id === placeDoc.owner.toString()){
      placeDoc.set({   
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      placeDoc.save();
      res.json('ok');
     }
  });
});

app.get('/places', async (req, res) => {
  const places = await Place.find();
  res.json(places);
});


app.post('/bookings', async (req,res) => {
  const userData = await getUserDataFromToken(req);
  const {place,checkIn,checkOut,numberOfGuests,name,phone,price,paymentname,creditNumber} = req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,price,user:userData.id,paymentname,creditNumber
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});



app.get('/bookings', async (req,res) => {
  const userData = await getUserDataFromToken(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
});

app.get('/edit-user/:id', async (req,res) => {
  const {id} = req.params;
  res.json(await User.findById(id));
});

app.put('/edit-user', async (req,res) =>{
  const {token} = req.cookies;
  const {id,
    name,email,addedPhotos,description,
    age,language,lived,
  } = req.body; 
  jwt.verify(token, jwtSecret, {}, async (err, userData) => { 
    if (err) throw err;
    const userDoc = await User.findById(id);
     if (userData.id){
      userDoc.set({   
        name,email,imageProfile:addedPhotos,description,
        age,language,lived,
      });
      userDoc.save();
      res.json('ok');
     }
  });
});

app.get('/edit-user', async (req, res) => {
  const user = await User.find();
  res.json(user);
});

app.delete('/places/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPlace = await Place.findByIdAndDelete(id);
    const owner = deletedPlace.owner;

    // Send email to the owner
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      service: 'gmail',
      auth: {
        user: 'hieuntgcd201925@fpt.edu.vn',
        pass: 'qtuu cpxg ltny tiud',
      },
    });

    const mailOptions = {
      from: 'hieuntgcd201925@fpt.edu.vn',
      to: owner.email,
      subject: 'Place Deleted',
      text: `Dear ${owner.name},\n\nYour place with the address ${deletedPlace.address} has been deleted by the admin.\n\nRegards,\nThe Admin`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Error deleting place:', error);
    res.status(500).json({ error: 'Failed to delete place' });
  }
});

app.delete('/bookings/place/:placeId', async (req,res) => {
  const { placeId } = req.params;
  await Booking.deleteMany({ place: placeId });
  res.json({ message: 'Bookings associated with the place deleted successfully' });
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the user using the provided ID
    const user = await User.findById(id);

    // Display modal for confirmation
    // Handle user confirmation (e.g., using frontend)

    // Delete the user's places
    await Place.deleteMany({ owner: user._id });

    // Delete the user
    await User.findByIdAndDelete(id);

    res.sendStatus(204); // Send a success status code (204 - No Content)
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const requestingUser = await User.findById(userId);

  if (requestingUser.role === 'admin') {
    try {
      const user = await User.findById(userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve user' });
    }
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
});

app.get('/user/role', async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      const { id } = userData || {}; // Set a default empty object if userData is null or undefined
      const user = id ? await User.findById(id) : null; // Only query the user if id is truthy
      const role = user ? user.role : null; // Retrieve the role if user is not null
      res.json({ role });
    }
  });
});

app.post('/reviews', async (req,res) => {
  const userData = await getUserDataFromToken(req);
  const {comment,rating,place} = req.body;
  Review.create({
    comment,rating,user:userData.id,place
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});


app.get('/reviews/place/:id', async (req, res) => {
  const placeId = req.params.id;
  try {
    const reviews = await Review.find({ place: placeId });
    res.json(reviews);
  } catch (e) {
    res.status(404).json({ error: 'Reviews not found' });
  }
});

app.get('/bookings/count', async (req, res) => {
  try {
    const { userId } = req.query;

    // Perform the necessary logic to count the bookings for the user
    const bookingCount = await Booking.countDocuments({ user: userId });

    // Return the count as a response
    res.json({ count: bookingCount });
  } catch (error) {
    // Handle any errors that may occur
    console.error('Error counting bookings:', error);
    res.status(500).json({ error: 'An error occurred while counting bookings' });
  }
});

app.get('/reviews/count', async (req, res) => {
  try {
    const { userId } = req.query;

    // Perform the necessary logic to count the bookings for the user
    const reviewCount = await Review.countDocuments({ user: userId });

    // Return the count as a response
    res.json({ count: reviewCount });
  } catch (error) {
    // Handle any errors that may occur
    console.error('Error counting bookings:', error);
    res.status(500).json({ error: 'An error occurred while counting bookings' });
  }
});




app.get('/bookingBy', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('place');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.get('/bookingBy/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const booking = await Booking.findById(bookId).populate('place');
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve book' });
  }
});

app.post('/send-email', (req, res) => {
  const {  sender, recipient, subject, message } = req.body;

  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: sender,
      pass: 'qtuu cpxg ltny tiud',
    },
  });

  // Setup email data
  const mailOptions = {
    from: sender,
    to: recipient,
    subject: subject,
    text: message,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Failed to send email.');
    } else {
      console.log('Email sent successfully!');
      res.status(200).send('Email sent successfully!');
    }
  });
});

app.post('/send-deletion-email', async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hieuntgcd201925@fpt.edu.vn',
      pass: 'qtuu cpxg ltny tiud',
    },
  });

  const mailOptions = {
    from: 'hieuntgcd201925@fpt.edu.vn',
    to: email,
    subject: 'Account Deletion',
    text: 'Your account has been deleted by the admin.',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Deletion email sent successfully.');
    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to send deletion email:', error);
    res.sendStatus(500);
  }
});


app.listen(4000);