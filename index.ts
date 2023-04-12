import {App} from "./App";

  window.addEventListener('DOMContentLoaded', () => {

  let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  let app = new App(canvas);
  app.run();
  });
