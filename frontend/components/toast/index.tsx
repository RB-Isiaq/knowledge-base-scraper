import { Toaster as Toast } from "react-hot-toast";
function Toaster() {
  return (
    <Toast
      toastOptions={{
        style: {
          maxWidth: "700px",
          padding: "12px 16px",
          fontSize: "16px",
          fontWeight: "400",
        },
        error: {
          style: {
            color: "red",
          },
        },
        success: {
          style: {
            color: "green",
          },
        },
      }}
      position="top-center"
      reverseOrder={false}
    />
  );
}

export default Toaster;
