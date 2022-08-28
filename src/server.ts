import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  /* https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg cannot be used since this URL will not work correctly with CORS. It does not have the access-control-allow-origin header set to *. Without this header, requests from other domains cannot be made to it via a users browser. */

  /* sample link that works:  
  http://localhost:8082/filteredimage?image_url=https%3A%2F%2Fcdn.motor1.com%2Fimages%2Fmgl%2Fmrz1e%2Fs1%2Fcoolest-cars-feature.jpg&imgrefurl=https%3A%2F%2Fwww.motor1.com%2Ffeatures%2F447037%2Fcoolest-cars%2F&tbnid=z4t7U0uZlwRpRM&vet=12ahUKEwi73Nv5yuX5AhXvSkEAHbdtBJoQMygNegUIARCSAw..i&docid=LBt-IiFPpVXXIM&w=1920&h=1080&q=car&ved=2ahUKEwi73Nv5yuX5AhXvSkEAHbdtBJoQMygNegUIARCSAw */

  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {
  
  let { image_url } = req.query;
    

//   1. validate the image_url query
      if (!image_url) {
        res.status(400).send("Image url required!!!");
      } else {
//   2. call filterImageFromURL(image_url) to filter the image
        await filterImageFromURL(image_url.toString())
          .then(function (image_filtered_path) {
//   3. send the resulting file in the response
            res.sendFile(image_filtered_path, () => {
//   4. deletes any files on the server on finish of the response
              deleteLocalFiles([image_filtered_path]);
            });
          })
          .catch(function (err) {
            res.status(422).send("Image was not filtered!!!");
          });
      }
    }
  );

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
