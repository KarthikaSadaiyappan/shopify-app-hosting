// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
//import { LoaderArgs } from "@remix-run/node";
import prisma from "~/db.server";
// Define LoaderArgs interface
interface LoaderArgs {
    request: Request;
  }

export const loader = async ({ request }: LoaderArgs) => {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    const url = new URL("/", `http://${host}`);
    
    // Check database connectivity by making a query
    //await prisma.user.findMany(); // Assuming this is a valid query to check DB connectivity
    await prisma.$connect();
    
    // Check self-health by making a HEAD request
    const response = await fetch(url.toString(), { method: "HEAD" });
    if (!response.ok) {
      throw new Error("Self-health check failed");
    }

    return new Response("OK");
  } catch (error) {
    console.log("Health check failed ❌", error);
    return new Response("ERROR", { status: 500 });
  }
};
