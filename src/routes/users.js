const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { loginValidation } = require("../config/validation");

const router = express.Router();

//HTTP REQUESTS (GET, GET SPECIFIC, POST, PUT, DELETE)

//GET

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});

//GET SPECIFIC USER

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user);
  } catch (error) {
    res.json({ message: error });
  }
});

//POST

router.post("/", async (req, res) => {
  try {
    //VALIDATIONS

    if (req.body.name === "") {
      return res.status(400).send("Ingrese su nombre");
    }

    if (
      Number(req.body.dni) < 0 ||
      isNaN(Number(req.body.dni)) ||
      req.body.dni.toString().length < 6
    ) {
      return res.status(400).send("Ingrese un documento de identidad valido");
    }

    if (
      Number(req.body.cellphone) < 0 ||
      isNaN(Number(req.body.cellphone)) ||
      req.body.cellphone.toString().length !== 9
    ) {
      return res.status(400).send("Ingrese un numero de celular valido");
    }

    if (req.body.products[0].productName.length === 0) {
      return res.status(400).send("Ingrese el nombre del producto");
    }

    //CHECK IF USER EXISTS

    const userExists = await User.findOne({ dni: req.body.dni });

    //CHECK IF IS DONOR

    if (req.body.isDonor) {

      if (userExists) {
        userExists.products.push(req.body.products[0]);
        const saveUser = await userExists.save();
        res.json(saveUser);
      } else {
        res.status(400).send('Este documento de identidad no existe, si quiere donar marque la casilla "HA DONADO PREVIAMENTE"')
      }

    } else {
      if (userExists) {
        res.status(400).send('Este documento de indentidad ya existe, si quiere volver a donar desmarque la casilla "HA DONADO PREVIAMENTE"');
      } else {

        //CREATE DONATION

        console.log(req.body);
        const user = new User({
          name: req.body.name,
          dni: req.body.dni,
          cellphone: req.body.cellphone,
          location: req.body.location,
          products: req.body.products,
        });
        const saveUser = await user.save();
        try {
          res.json(saveUser);
        } catch (error) {
          console.log(error);
          res.json({ message: error });
        }
      }
    }

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//PUT

router.put("/", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);

    if (user) {
      try {
        user.products.forEach((product) => {
          if (product.productName === req.body.name) {
            product.state = true;
          }
        });
        user.save();
        res.json(user);
      } catch (error) {
        res.json({ message: error });
      }
    } else {
      res.status(404).send("No se encontro el produto");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//DELETE USER

router.delete("/", async (req, res) => {
  try {
    const removedUser = await User.deleteOne({ _id: req.body.id });
    res.json(removedUser);
  } catch (error) {
    res.json({ message: error });
  }
});

//====================================//

//LOGIN

router.post("/login", async (req, res) => {
  console.log(req.body);

  try {
    //VALIDATE LOGIN

    const { error } = loginValidation(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    //CHECK IF DNI EXISTS

    const userExists = await User.findOne({ dni: req.body.dni });

    if (!userExists) {
      return res
        .status(400)
        .send("Este numero de DNI no esta registrado, da click en donar");
    }

    // CHECK IF PASSWORD IS CORRECT

    const validCellphone = userExists.cellphone === Number(req.body.cellphone);

    if (!validCellphone) {
      return res.status(400).send("Su numero de Celular no es el correcto");
    }

    //CREATE AND ASSIGN TOKEN

    const token = jwt.sign({ _id: userExists._id }, process.env.JWT_TOKEN, {
      expiresIn: "1h",
    });
    const userData = {
      token,
      _id: userExists._id
    }
    console.log(userData)
    res.header("auth-token", token).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
