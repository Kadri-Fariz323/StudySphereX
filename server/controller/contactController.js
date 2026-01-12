const Contact = require("../model/Contact"); 


const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;


    const newContact = await Contact.create({
      name,
      email,
      message,
    });


    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newContact,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages, 
      });
    }

    console.error("Contact Controller Error:", error);
    res.status(500).json({
      success: false,
      error: "Server Error. Please try again later.",
    });
  }
};

module.exports = {
  createContact,
};