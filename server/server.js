require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');

const authRoute = require('./routes/authRoute');
const mediaRoute = require('./routes/mediaRoute');
const CourseRoute = require('./routes/CourseRoute')
const ContactRoute= require('./routes/ContactRoute')
const StudentRoute= require('./routes/StudentRoute')
const StudentOrderRoute = require('./routes/OrderRoute')
const studentCoursesRoutes = require("./routes/studentCoursesRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// DB CONNECTION 

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB is connected ✅"))
.catch((error) => console.log(error));

// routes config

app.use('/auth', authRoute);
app.use('/media', mediaRoute);
app.use('/contact', ContactRoute);
app.use("/instructor/course", CourseRoute);
app.use("/student/course", StudentRoute);
app.use("/student/order", StudentOrderRoute)
app.use("/student/courses-bought", studentCoursesRoutes);


app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong'
    })
    
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
