export const config = {
  auth: false,
}


/// <reference lib="deno.ns" />

import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5?target=deno";


const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);


Deno.serve(async (req: Request) => {
  console.log("👉 Webhook request received");

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ No stripe-signature header");
    return new Response("No signature", { status: 400 });
  }

  const body = await req.arrayBuffer();

  // let event: any;

  let event: Stripe.Event;

try {
  event = await stripe.webhooks.constructEventAsync(
    new Uint8Array(body),
    signature,
    Deno.env.get("STRIPE_WEBHOOK_SECRET")!
  );

  console.log("✅ Signature verified:", event.type);
} catch (err) {
  console.error("❌ Signature verification failed:", err);
  return new Response("Invalid signature", { status: 400 });
}

  // try {
  //   event = await stripe.webhooks.constructEvent(
  //     new Uint8Array(body),
  //     signature,
  //     Deno.env.get("STRIPE_WEBHOOK_SECRET")!
  //   );

  //   console.log("✅ Signature verified");
  //   console.log("📦 Event type:", event.type);

  // } catch (err) {
  //   console.error("❌ Signature verification failed:", err);
  //   return new Response("Invalid signature", { status: 400 });
  // }

  if (event.type === "checkout.session.completed") {
    console.log("💰 Checkout session completed");

    const session = event.data.object as any;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email,
        total_amount: session.amount_total! / 100,
        currency: session.currency,
        payment_status: session.payment_status,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Insert order failed:", error);
      return new Response("DB error", { status: 500 });
    }

    console.log("✅ Order inserted with id:", order.id);

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    for (const item of lineItems.data) {
      await supabase.from("order_items").insert({
        order_id: order.id,
        product_name: item.description,
        quantity: item.quantity,
        unit_price: item.amount_total! / 100,
      });
    }

    console.log("✅ Order items inserted");
  }

  console.log("🎉 Webhook handled successfully");
  return new Response("ok", { status: 200 });
});


// Deno.serve(async (req: Request) => {
//   const signature = req.headers.get("stripe-signature");

//   if (!signature) {
//     return new Response("No signature", { status: 400 });
//   }

//   const body = await req.arrayBuffer();


//   let event: any;

//   try {
//     event = stripe.webhooks.constructEvent(
//   new Uint8Array(body),
//   signature,
//   Deno.env.get("STRIPE_WEBHOOK_SECRET")!
// );

//   } catch (err) {
//     console.error("Webhook signature verification failed:", err);
//     return new Response("Invalid signature", { status: 400 });
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as any;

//     const { data: order, error } = await supabase
//       .from("orders")
//       .insert({
//         stripe_session_id: session.id,
//         customer_email: session.customer_details?.email,
//         total_amount: session.amount_total! / 100,
//         currency: session.currency,
//         payment_status: session.payment_status,
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error("Insert order failed:", error);
//       return new Response("DB error", { status: 500 });
//     }

//     let lineItems;
//     try {
//       lineItems = await stripe.checkout.sessions.listLineItems(session.id);
//     } catch (e) {
//       console.error("Fetching line items failed:", e);
//       return new Response("Line items error", { status: 500 });
//     }

//     for (const item of lineItems.data) {
//       await supabase.from("order_items").insert({
//         order_id: order.id,
//         product_name: item.description,
//         quantity: item.quantity,
//         unit_price: item.amount_total! / 100,
//       });
//     }
//   }

//   return new Response("ok", { status: 200 });
// });


// export default async (req: Request) => {
//   const signature = req.headers.get("stripe-signature");

//   if (!signature) {
//     return new Response("No signature", { status: 400 });
//   }

//   const body = await req.text();

//   let event: any;

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       Deno.env.get("STRIPE_WEBHOOK_SECRET")!
//     );
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err);
//     return new Response("Invalid signature", { status: 400 });
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as any;

//     const { data: order, error } = await supabase
//       .from("orders")
//       .insert({
//         stripe_session_id: session.id,
//         customer_email: session.customer_details?.email,
//         total_amount: session.amount_total! / 100,
//         currency: session.currency,
//         payment_status: session.payment_status,
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error("Insert order failed:", error);
//       return new Response("DB error", { status: 500 });
//     }

//     const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

//     for (const item of lineItems.data) {
//       await supabase.from("order_items").insert({
//         order_id: order.id,
//         product_name: item.description,
//         quantity: item.quantity,
//         unit_price: item.amount_total! / 100,
//       });
//     }
//   }

//   return new Response("ok", { status: 200 });
// };





// // Follow this setup guide to integrate the Deno language server with your editor:
// // https://deno.land/manual/getting_started/setup_your_environment
// // This enables autocomplete, go to definition, etc.

// // Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// console.log("Hello from Functions!")

// Deno.serve(async (req) => {
//   const { name } = await req.json()
//   const data = {
//     message: `Hello ${name}!`,
//   }

//   return new Response(
//     JSON.stringify(data),
//     { headers: { "Content-Type": "application/json" } },
//   )
// })

// /* To invoke locally:

//   1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
//   2. Make an HTTP request:

//   curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripe-webhook' \
//     --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODQ2ODc2ODR9.8Ax8Lt1-k9QKfvW7aBluLgWgOCAOQ8TUHW64Zdob4aXd9rHZs8_kWKvVyOuBRx3PD2-5TsEKS1UwuL_pc9wbzQ' \
//     --header 'Content-Type: application/json' \
//     --data '{"name":"Functions"}'

// */
