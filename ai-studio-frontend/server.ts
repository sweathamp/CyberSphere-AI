import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();

const PORT = 3000;
const BACKEND_URL = "http://127.0.0.1:8000";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


/*
========================================
BACKEND HEALTH CHECK
========================================
*/

app.get("/api/health", async (_req, res) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/openapi.json`
    );

    res.json({
      status: "ok",
      frontend: "running",
      backend: response.ok
        ? "connected"
        : "unavailable"
    });

  } catch (error) {

    console.error(
      "Backend Health Check Failed:",
      error
    );

    res.json({
      status: "ok",
      frontend: "running",
      backend: "unavailable"
    });

  }
});


/*
========================================
CHAT API PROXY
========================================
*/

app.post("/api/chat", async (req, res) => {

  try {

    const {
      message,
      log_data,
      code_data
    } = req.body;


    if (
      !message &&
      !log_data &&
      !code_data
    ) {

      return res.status(400).json({
        error:
          "Please provide a message or analysis data."
      });

    }


    console.log("\n================================");
    console.log("CYBERSPHERE REQUEST RECEIVED");
    console.log("================================");

    console.log(
      "Message:",
      message || "[No message]"
    );

    console.log(
      "Log Data:",
      log_data
        ? "Provided"
        : "None"
    );

    console.log(
      "Code Data:",
      code_data
        ? "Provided"
        : "None"
    );


    console.log(
      "\nSending request to FastAPI backend..."
    );


    const controller =
      new AbortController();


    const timeout =
      setTimeout(() => {

        controller.abort();

      }, 120000);


    let backendResponse: Response;


    try {

      backendResponse = await fetch(
        `${BACKEND_URL}/api/chat`,
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            message:
              message || "",

            log_data:
              log_data || null,

            code_data:
              code_data || null

          }),

          signal:
            controller.signal

        }
      );

    } finally {

      clearTimeout(timeout);

    }


    console.log(
      "Backend Status:",
      backendResponse.status
    );


    /*
    ========================================
    BACKEND ERROR
    ========================================
    */

    if (!backendResponse.ok) {

      const errorText =
        await backendResponse.text();


      console.error(
        "\nBACKEND ERROR:"
      );

      console.error(
        errorText
      );


      return res.status(
        backendResponse.status
      ).json({

        error:
          "CyberSphere backend analysis failed.",

        details:
          errorText

      });

    }


    /*
    ========================================
    GET BACKEND RESPONSE
    ========================================
    */

    const data =
      await backendResponse.json();


    console.log(
      "\nBACKEND RESPONSE RECEIVED"
    );

    console.log(
      "Agent Used:",
      data.agent
    );

    console.log(
      "Reply Generated:",
      data.reply
        ? "Yes"
        : "No"
    );


    /*
    ========================================
    SEND RESPONSE TO FRONTEND
    ========================================
    */

    return res.json(data);


  } catch (error: any) {

    console.error(
      "\n================================"
    );

    console.error(
      "CYBERSPHERE SERVER ERROR"
    );

    console.error(
      "================================"
    );

    console.error(error);


    if (
      error?.name === "AbortError"
    ) {

      return res.status(504).json({

        error:
          "CyberSphere analysis timed out. Please try again."

      });

    }


    return res.status(500).json({

      error:
        "Unable to connect to CyberSphere backend."

    });

  }

});


/*
========================================
CONVERSATIONS API PROXY
========================================
*/

app.get(
  "/api/conversations",
  async (_req, res) => {

    try {

      console.log(
        "Fetching conversations..."
      );


      const backendResponse =
        await fetch(
          `${BACKEND_URL}/api/conversations`
        );


      if (!backendResponse.ok) {

        const errorText =
          await backendResponse.text();


        console.error(
          "Conversation Backend Error:",
          errorText
        );


        throw new Error(
          "Failed to fetch conversations"
        );

      }


      const data =
        await backendResponse.json();


      console.log(
        `Conversations received: ${data.length}`
      );


      return res.json(data);


    } catch (error) {

      console.error(
        "Conversation Fetch Error:",
        error
      );


      return res.status(500).json({

        error:
          "Unable to fetch conversation history."

      });

    }

  }
);


/*
========================================
VITE + EXPRESS SERVER
========================================
*/

async function startServer() {

  if (
    process.env.NODE_ENV !== "production"
  ) {

    const vite =
      await createViteServer({

        server: {
          middlewareMode: true
        },

        appType: "spa"

      });


    app.use(
      vite.middlewares
    );


  } else {

    const distPath =
      path.join(
        process.cwd(),
        "dist"
      );


    app.use(
      express.static(
        distPath
      )
    );


    app.get(
      "*",
      (_req, res) => {

        res.sendFile(

          path.join(
            distPath,
            "index.html"
          )

        );

      }
    );

  }


  app.listen(
    PORT,
    "0.0.0.0",
    () => {

      console.log(
        "\n================================"
      );

      console.log(
        "CYBERSPHERE AI COMMAND CENTER"
      );

      console.log(
        "================================"
      );

      console.log(
        `Frontend: http://localhost:${PORT}`
      );

      console.log(
        `Backend: ${BACKEND_URL}`
      );

      console.log(
        "\nCyberSphere Ready.\n"
      );

    }
  );

}


startServer();