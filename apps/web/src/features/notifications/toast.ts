import { toast } from "react-toastify";

export function notify(message: string, type: "error" | "success" = "success") {
  if (type === "error") {
    toast.error(message);
    return;
  }

  toast.success(message);
}
