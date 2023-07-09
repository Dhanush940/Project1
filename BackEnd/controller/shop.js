const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
// const sendToken = require("../utils/jwtToken");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Event = require("../model/event");
// const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

const sendJWTToken = require("../utils/sendJWTToken");
const { sendSHOPToken } = require("../utils/sendSHOPToken");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");

// create shop multer
// router.post("/create-shop", upload.single("file"), async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const sellerEmail = await Shop.findOne({ email });
//     if (sellerEmail) {
//       const filename = req.file.filename;
//       const filePath = `uploads/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.log(err);
//           res.status(500).json({ message: "Error deleting file" });
//         }
//       });
//       return next(new ErrorHandler("User already exists", 400));
//     }

//     const filename = req.file.filename;
//     const fileUrl = path.join(filename);

//     const seller = {
//       name: req.body.name,
//       email: email,
//       password: req.body.password,
//       avatar: fileUrl,
//       address: req.body.address,
//       phoneNumber: req.body.phoneNumber,
//       zipCode: req.body.zipCode,
//     };

//     const activationToken = createActivationToken(seller);

// const activationUrl = `https://fullstack-ecommerce.netlify.app/shop/activation/${activationToken}`;
// const activationUrl = `http://localhost:3000/shop/activation/${activationToken}`;

//     try {
//       await sendMail({
//         email: seller.email,
//         subject: "Activate your Shop",
//         message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
//       });
//       res.status(201).json({
//         success: true,
//         message: `please check your email:- ${seller.email} to activate your shop!`,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 400));
//   }
// });

//create shop cloudinary
router.post(
  "/create-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // console.log("In api create shop");
      // console.log("req body is", req.body);
      const { email } = req.body;
      const sellerEmail = await Shop.findOne({ email });
      if (sellerEmail) {
        return res.status(404).json({ message: "Seller already exists" });
      }

      // console.log("seller email", sellerEmail);

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
      });

      // console.log("My cloud is ", myCloud);
      // console.log("seller email", sellerEmail);
      const seller = {
        name: req.body.name,
        email: email,
        password: req.body.password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        zipCode: req.body.zipCode,
      };

      // console.log("Seller is ", seller);
      const activationToken = createActivationToken(seller);

      const activationUrl = `https://fullstack-ecommerce.netlify.app/shop/activation/${activationToken}`;
      // const activationUrl = `http://localhost:3000/shop/activation/${activationToken}`;

      try {
        await sendMail({
          email: seller.email,
          subject: "Activate your Shop",
          message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
        });
        res.status(201).json({
          success: true,
          message: `please check your email:- ${seller.email} to activate your shop!`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      await sendMail({
        email: seller.email,
        subject: "Created Account",
        message: `Hello ${seller.name},Your shop has been successfully created with us.`,
      });

      sendJWTToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//My own . The problem is that post should be used to create a new resource while here i am not doing anything of that kind so commenting it out and actually pasting the mail content in the above route.This is misconception as in login route you don't actually create any resource but just set the cookie .
// router.post(
//   "/success",
//   catchAsyncErrors(async (req, res, next) => {
//     // console.log(req.body);
//     const seller = req.body.user;
//     // console.log(seller);
//     try {
//       await sendMail({
//         email: seller.email,
//         subject: "Created Account",
//         message: `Hello ${seller.name},Your shop has been successfully created with us.`,
//       });
//       res.status(201).json({
//         success: true,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }
      // console.log("Email", await Shop.findOne({ email }));

      // console.log(...(await Shop.findOne({ email }).select("+password")));

      const user = await Shop.findOne({ email }).select("+password");
      // console.log(
      //   "Password",
      //   await Shop.findOne({ email }).select("+password")
      // );

      if (!user) {
        return res.status(404).json({ message: "User doesn't exist" });
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        // return next(
        //   new ErrorHandler("Please provide the correct information", 400)
        // );
        return res.status(400).json({ message: "Password doesn't match" });
      }

      sendSHOPToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);
      // console.log("Seller", seller);
      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("SHOPTOKEN", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        domain: "",
        path: "/",
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile picture multer
// router.put(
//   "/update-shop-avatar",
//   isSeller,
//   upload.single("image"),
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const existsUser = await Shop.findById(req.seller._id);

//       const existAvatarPath = `uploads/${existsUser.avatar}`;

//       fs.unlinkSync(existAvatarPath);

//       const fileUrl = path.join(req.file.filename);

//       const seller = await Shop.findByIdAndUpdate(req.seller._id, {
//         avatar: fileUrl,
//       });

//       // const product = await Product.find({ shopId: req.seller._id });
//       // product.map(async (item, index) => {
//       //   // console.log(item.category);
//       //   // console.log(item.originalPrice);
//       //   // console.log(item.discountPrice);
//       //   // console.log(item.stock);
//       //   // console.log(item.images[0]);

//       //   // console.log("product shop is : ", item.shop)
//       //   console.log(item.shop.avatar);
//       //   item.shop.avatar = fileUrl;
//       //   // item = await item.save();
//       //   // item.update()
//       //   // item.tags = fileUrl;
//       //   // const add = item.shop;
//       //   // console.log("add is : ", add);
//       //   // add.avatar = fileUrl;
//       //   // await item.save();
//       //   product[index].save();
//       //   console.log("product shop is : ", item.shop);
//       // });

//       // await product.save();
//       // console.log("Hello f ", product[0]);

//       //Well the below one took me well over two hours for me.  Was trying various things and did not work out . Finally Done
//       await Product.updateMany(
//         { shopId: req.seller._id },
//         { $set: { "shop.avatar": fileUrl } }
//       );

//       await Event.updateMany(
//         { shopId: req.seller._id },
//         { $set: { "shop.avatar": fileUrl } }
//       );
//       // console.log("product 0 is :", product[0].shop.avatar);
//       res.status(200).json({
//         success: true,
//         seller,
//         // product,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

//update shop profile picture cloudinary
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsSeller = await Shop.findById(req.seller._id);

      const imageId = existsSeller.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });

      existsSeller.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      await existsSeller.save();

      res.status(200).json({
        success: true,
        seller: existsSeller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
