import {App} from "./App";


  let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  let app = new App(canvas,document);
  app.run();
  
