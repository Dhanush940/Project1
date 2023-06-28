import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import { toast } from "react-toastify";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  //MY own
  // useEffect(() => {
  //   if (activation_token) {
  //     const sendRequest = async () => {
  //       await axios
  //         .post(`${server}/shop/activation`, {
  //           activation_token,
  //         })
  //         .then(async (res) => {
  //           console.log(res);
  //           toast.success("Your account has been created successfully");
  //           await axios
  //             .post(`${server}/shop/success`, { user: res.data.user })
  //             .then((res) => {})
  //             .catch((err) => setError(true));
  //         })
  //         .catch((err) => {
  //           setError(true);
  //         });
  //     };
  //     sendRequest();
  //   }
  // }, [activation_token]);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/shop/activation`, {
            activation_token,
          })
          .then((res) => {
            console.log(res);
            toast.success("Your account has been created successfully");
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>Your token is expired!</p>
      ) : (
        <p>Your account has been created suceessfully!</p>
      )}
    </div>
  );
};

export default SellerActivationPage;
