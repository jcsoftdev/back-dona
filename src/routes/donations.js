const router = require('express').Router()
const User = require('../models/User')
const verify = require('../middlewares/validateToken')


//GET - LOGEED USER

router.get('/', verify, async (req, res) => {
  try {
    const validatedUser = await User.findById(req.user._id)
    res.send(validatedUser)
    // console.log(validatedUser)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }

})

//PUT - LOGGED USER

router.put('/', verify, async (req, res) => {
  console.log(req.user);
  console.log(req.body);
  try {
    const validatedUser = await User.findById(req.user._id)

    if (validatedUser) {
      try {
        validatedUser.products.forEach(product => {
          if (product._id == req.body.id) {
            product.state = true
          }
        })
        validatedUser.save()
        res.json(validatedUser)
      } catch (error) {
        res.json({ message: error })
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }

})

//DELETE - LOGGED USER

router.delete('/', verify, async (req, res) => {
  try {
    // const validatedUser = await User.findById(req.user._id)
    const removedUser = await User.findByIdAndDelete(req.user._id)
    res.json(removedUser)
  } catch (error) {
    res.json({ message: error })
  }
})

// //PUT - ADD NEW PRODUCT

// router.put('/', verify, async (req, res) => {

//   try {
//     const validatedUser = await User.findById(req.user._id)

//     if (validatedUser) {
//       try {
//         let addedProducts = req.body // SE MANDA UN ARREGLO DE PRODUCTOS

//         addedProducts.forEach(product => {
//           if(product.productName !== "") {
//             validatedUser.products.push(product) // SOLO SE GUARDAN LOS PRODUCTOS QUE TENGAN NOMBRE
//           }
//         })

//         validatedUser.save()
//         res.json(validatedUser)
//       } catch (error) {
//         res.json({ message: error })
//       }
//     }
//   } catch (error) {
//     console.log(error)
//     res.status(500).json(error)
//   }
// })

module.exports = router
