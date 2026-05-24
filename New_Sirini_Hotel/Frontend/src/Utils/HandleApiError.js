import toast from "react-hot-toast";

export const handleApiError = (error) => {
  const status = error.response?.status;
  const message =
    error.response?.data?.message || "An error occurred. Please try again.";

  if (status === 429) {
    toast.error(message || "Too many attempts. Please wait 15 minutes.");
    return;
  } else {
    toast.error(message || "An error occurred. Please try again.");
  }
};
