import { redirect } from "next/navigation";

// The sandbox was renamed to /play (a friendlier home for the "Take a break"
// game). Keep this route as a permanent redirect so old links still work.
export default function SandboxRedirect() {
  redirect("/play");
}
