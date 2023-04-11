import { Scene, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, SceneInstrumentation, MeshBuilder, AbstractMesh, Constants, Mesh, ActionManager, ExecuteCodeAction, PhysicsImpostor, int, AdvancedTimer, StandardMaterial, Texture } from "babylonjs";
import "babylonjs-loaders";
import "babylonjs-gui";
import { AdvancedDynamicTexture, Button, Control, GUI3DManager, SelectionPanel, TextBlock } from "babylonjs-gui";
//import setAndStartTimer from "@babylonjs/Misc/timer";

export class App {
  scene: Scene;
  engine: Engine;
  cptLaine : int;
  textBox : SelectionPanel;
  text : TextBlock ;
  mouton1 : boolean ;
  available1 : string ;
  timing : int ;
  timersec : int ;
  

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);

    this.scene = this.CreateScene();

    this.CreateEnvironment();

    this.CreateController();

    this.CreateChooseYourOutfit();

    
    //Setup pour le cpt de Laine
    this.textBox = new SelectionPanel("textBox");
    this.text = new TextBlock();
    this.cptLaine=0;
    this.mouton1 = true;
    this.available1 = "Collect your yarn !";
    this.timing = 0 ;
    this.timersec = 6 ;

    this.CreateCptLaine();
    this.CreateMouton();
    

    
  }
  run(){
    this.engine.runRenderLoop(() => {
        this.scene.render();
      });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const light= new HemisphericLight("light",new Vector3(0,1,0),this.scene);

    scene.onPointerDown=(evt)=>{
        //for the mouse settings, 0:left click,1:middle mouse button,2:right click
        if (evt.button===0) this.engine.enterPointerlock();
        if (evt.button===1) this.engine.exitPointerlock();
    }
    const framesPerSecond=60;
    const gravity=-9.81;
    //gravity on the y axis
    scene.gravity=new Vector3(0,gravity/framesPerSecond,0);
    //enable collisions
    
  
    scene.collisionsEnabled=true;
   


    this.CreateObjects();

    return scene;
  }

  async CreateMouton(): Promise<void> {
    
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./",
      "mouton.glb",
      this.scene
    );
    //apply collisions to every mesh in the model
    //.map goes through every mesh
    meshes.map(mesh=>{ //for each mesh apply collisions donc c'est comme un for i in list par exemple
       mesh.checkCollisions=true;
      //Création de l'intéraction avec mouton
      mesh.actionManager = new ActionManager(this.scene);
      mesh.actionManager.registerAction(
        new ExecuteCodeAction({trigger: ActionManager.OnPickTrigger},(evt) => this.Mouton1OnClick(this,button1)));  //Quand on click sur la boule ca lance Mouton1OnClick

    })

    //Plan 2D qui donne des infos au dessus
    const plane = Mesh.CreatePlane("plane",2,this.scene); //plane, le plan 2D sur lequel on va cliquer, 2=size
    plane.parent = meshes[0];
    plane.position.y = 2;

   const advancedTexture2 = AdvancedDynamicTexture.CreateForMesh(plane);

    const button1 = Button.CreateSimpleButton("but1", this.available1);
    button1.width = 1;
    button1.height = 0.4;
    button1.color = "black";
    button1.fontSize = 100;
    button1.background = "transparent";

    button1.onPointerUpObservable.add((evt) => this.Mouton1OnClick(this,button1));
    advancedTexture2.addControl(button1);
  
    //Fin plan 2D

  }
  /*CreateMouton1():void{
    //Créer une boule mais ca va etre un mouton en vrai
    const ball = MeshBuilder.CreateSphere("ball",{diameter : 1} , this.scene);
      ball.physicsImpostor = new PhysicsImpostor(
          ball,
          PhysicsImpostor.SphereImpostor,
          { mass: 1, restitution: 0.8 }
        );
      ball.position=new Vector3(4,1,1);
    
    //Fin de création mouton 

    //Plan 2D qui donne des infos au dessus
    const plane = Mesh.CreatePlane("plane",2,this.scene); //plane, le plan 2D sur lequel on va cliquer, 2=size
    plane.parent = ball;
    plane.position.y = 2;

    const advancedTexture2 = AdvancedDynamicTexture.CreateForMesh(plane);

    const button1 = Button.CreateSimpleButton("but1", this.available1);
    button1.width = 1;
    button1.height = 0.4;
    button1.color = "black";
    button1.fontSize = 50;
    button1.background = "pink";

    button1.onPointerUpObservable.add((evt) => this.Mouton1OnClick(this,button1));
    advancedTexture2.addControl(button1);
    
    //Fin plan 2D

    //Création de l'intéraction avec mouton
    ball.actionManager = new ActionManager(this.scene);
    ball.actionManager.registerAction(
      new ExecuteCodeAction({trigger: ActionManager.OnPickTrigger},(evt) => this.Mouton1OnClick(this,button1)));  //Quand on click sur la boule ca lance Mouton1OnClick
  }*/

  Mouton1OnClick(self : App,button : Button):void{
    if (self.mouton1){
      self.cptLaine+=1;
      self.text.text = "laine : "+self.cptLaine;
      self.mouton1=false;
      console.log("Juste avant timer");
      button.textBlock!.text = "Please wait to collect your yarn";
      const timer = new AdvancedTimer({timeout:1000,contextObservable: self.scene.onBeforeRenderObservable});  //Timer à 0 jsp pk mais j'ai pas vu de changements en fonctions des valeurs
      timer.onTimerEndedObservable.add((evt) => self.Timer(self,button));
      timer.onEachCountObservable.add((evt) => self.Waiting(self,button));
      timer.start(this.timersec*1000); //La durée du timer
      
    }
    self.textBox.addControl(self.text);

  }

  CreateCptLaine():void{
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this.textBox.width = 0.25;
    this.textBox.height = 0.10;
    this.textBox.background = "#1388AF";
    this.textBox.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.textBox.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        
    this.text.text = "laine : "+ this.cptLaine;
    this.text.color = "white";
    this.text.fontSize = 30;
    this.textBox.addControl(this.text);  
    advancedTexture.addControl(this.textBox);

    /*const ball = MeshBuilder.CreateSphere("ball", { diameter: 2 }, this.scene);
    ball.position = new Vector3(40, 1, 0);
    const plane = Mesh.CreatePlane("plane",2,this.scene); //plane, le plan 2D sur lequel on va cliquer, 2=size
    plane.parent = ball;
    plane.position.y = 2;

    const advancedTexture2 = AdvancedDynamicTexture.CreateForMesh(plane);

    const button1 = Button.CreateSimpleButton("but1", "Recolter la laine");
    button1.width = 1;
    button1.height = 0.4;
    button1.color = "black";
    button1.fontSize = 50;
    button1.background = "pink";

    button1.onPointerUpObservable.add((evt) => this.Laine(this));
    advancedTexture2.addControl(button1);*/
  }

  /*Laine(self : FirstTry):void{
    if (self.mouton1){
      self.cptLaine+=1;
      self.text.text = "laine : "+self.cptLaine;
      self.mouton1=false;
      console.log("Juste avant timer");
      const timer = new AdvancedTimer({timeout:0,contextObservable: self.scene.onBeforeRenderObservable});  //Timer à 0 jsp pk mais j'ai pas vu de changements en fonctions des valeurs
      timer.onTimerEndedObservable.add((evt) => self.Timer(self,button));
      timer.start(5000); //La durée du timer
      
    }
    self.textBox.addControl(self.text);

  }*/

  Timer(self : App, button : Button ) : void{
    self.mouton1=true;
    button.textBlock!.text = this.available1 ;
    this.timing=0;
  }

  Waiting(self : App, button : Button) : void{
    self.mouton1=false;
    if (self.timing%(self.timersec*10)==0){
      button.textBlock!.text = `Wait ${self.timersec - (self.timing/(self.timersec*10))} seconds to collect your next yarn` ;
    }
    this.timing+=1; 
  }

  async CreateEnvironment(): Promise<void> {
    
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./",
      "test5.glb",
      this.scene
    );

    //apply collisions to every mesh in the model
    //.map goes through every mesh
    meshes.map(mesh=>{ //for each mesh apply collisions donc c'est comme un for i in list par exemple
       mesh.checkCollisions=true;
    })

  }

  CreateController():void{
    const camera=new FreeCamera("camera",new Vector3(0,10,0),this.scene); //without a camera we can't see anything
    //static camera unless we attach control
    camera.attachControl();

    camera.applyGravity=true; //applies gravity to the camera which is our controller
    camera.checkCollisions=true;
    //but this will not work unless we can "detect" the camera, we need to create a 'body' for the camera => elipsoid 

    camera.ellipsoid=new Vector3(1,1,1);

    camera.minZ=0.45; //this allows us to not get very close to the objects and see through them
    camera.speed=0.5;
    camera.angularSensibility=4000; //rotate more slowly

    //personalize the keys for the controller movement
    //we can still use arrows keys for movement donc both options are available
    camera.keysUp.push(87); //keycode for W is 87 check https://www.toptal.com/developers/keycode
    camera.keysUp.push(90); // 90 : z pour les azerty : dsl hajar
    camera.keysRight.push(68); //65: d
    camera.keysDown.push(83);//83:s
    camera.keysLeft.push(81);//81:q

    

    }
  
    CreateObjects():void {
      const ball = MeshBuilder.CreateSphere("ball",{diameter : 1} , this.scene);
      ball.physicsImpostor = new PhysicsImpostor(
          ball,
          PhysicsImpostor.SphereImpostor,
          { mass: 1, restitution: 0.8 }
        );
      ball.position=new Vector3(0,1,1);
      this.CreateActions(ball);

  }

  CreateActions(obj : AbstractMesh): void {
      obj.actionManager = new ActionManager(this.scene);
      obj.actionManager.registerAction(
          new ExecuteCodeAction(
          {
              trigger: ActionManager.OnPickTrigger

          },

          function () {
              (document.querySelector(".modal-wrapper") as HTMLDivElement).style.display = "block";  //AFFICHE LA PAGE SHOP
              (document.querySelector(".modal-close") as HTMLDivElement).addEventListener("click", hide);  //Clique de la croix ?
              (document.querySelector(".AV1") as HTMLDivElement).addEventListener("click",hide);   //Clique du bouton ?

              function hide() {
                  (document.querySelector(".modal-wrapper") as HTMLDivElement).style.display = "none";  //Enlève la page shop
                  }

          })
      );
    } 
    CreateChooseYourOutfit():void {
      const plane = Mesh.CreatePlane("plane",3,this.scene); //plane, le plan 2D sur lequel on va cliquer, 2=size
      plane.position.y = 2;
      plane.position.x = -45;
      plane.position.z = 28;
      plane.rotate(new Vector3(0,1,0),-1.5708);
  
      const advancedTexture2 = AdvancedDynamicTexture.CreateForMesh(plane);
  
      const button1 = Button.CreateSimpleButton("but1", "Choose your outfit");
      button1.width = 1;
      button1.height = 0.4;
      button1.color = "black";
      button1.fontSize = 50;
      button1.background = "pink";
      button1.onPointerUpObservable.add(this.ClickOutfit);
      advancedTexture2.addControl(button1);
      
    }
    ClickOutfit():void{
      (document.querySelector(".modal-wrapper-outfit") as HTMLDivElement).style.display = "block";  //AFFICHE LA PAGE SHOP
      (document.querySelector(".modal-close-outfit") as HTMLDivElement).addEventListener("click", hide);  //Clique de la croix ?
      (document.querySelector(".AV1-outfit") as HTMLDivElement).addEventListener("click",hide);   //Clique du bouton ?
      
      function hide() {
          (document.querySelector(".modal-wrapper-outfit") as HTMLDivElement).style.display = "none";  //Enlève la page shop
          }
    }
}