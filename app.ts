
import { Scene, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, SceneInstrumentation, MeshBuilder, AbstractMesh, Constants, Mesh, ActionManager, ExecuteCodeAction, PhysicsImpostor, int, AdvancedTimer, StandardMaterial, Texture, Vector4, Color3, Color4, Animation, CubeTexture, PhotoDome, ArcRotateCamera, DirectionalLight, CannonJSPlugin, Sound, AnimationGroup } from "babylonjs";
import "babylonjs-loaders";
import "babylonjs-gui";
import { AdvancedDynamicTexture, Button, Control, GUI3DManager, MeshButton3D, SelectionPanel, TextBlock } from "babylonjs-gui";
//import setAndStartTimer from "@babylonjs/Misc/timer";
import * as CANNON from "cannon";
export class App {
  scene: Scene;
  engine: Engine;
  cptLaine: int;
  textBox: SelectionPanel;
  text: TextBlock;
  mouton1: boolean;
  available1: string;
  timing: int;
  timersec: int;
  plane: Mesh;
  matcollect: StandardMaterial;
  avancement: int;
  camera: ArcRotateCamera;
  cptFashion: int;
  wardrobe: Cloth[];
  currentoutfit: string;
  alreadyRunwayOutfit :string[];
  heroMesh:AbstractMesh;
  runway:boolean;
  up: boolean;
  left: boolean;
  down: boolean;
  right: boolean;
  PersoAnim: AnimationGroup[];
  runwayMusic : Sound;
  background : Sound;


  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.engine.displayLoadingUI(); //page de chargement

    this.scene = this.CreateScene();

    this.CreateEnvironment();
    this.CreateSky();
    this.heroMesh;
    //this.runway=false;
    this.PersoAnim;

    //partie Physics
    this.scene.enablePhysics(new Vector3(0,-9.81,0),new CannonJSPlugin(true,10,CANNON));
    //const box =MeshBuilder.CreateBox("Box",{width:50,height:.1,depth:50},this.scene);
    //box.physicsImpostor=new PhysicsImpostor(box,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0},this.scene);
    //box.position=new Vector3(0,1,0);
    //box.isVisible=false;
    
    
    //this.scene.debugLayer.show();
    //this.camera = new FreeCamera("camera", new Vector3(0, 10, 0), this.scene);
    this.camera=new ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, new Vector3(0, 1, 0), this.scene);
    this.scene.activeCamera = this.camera;
    this.scene.activeCamera.attachControl(this.canvas, true);
    this.camera.lowerRadiusLimit = 2;
    this.camera.upperRadiusLimit = 10;
    this.camera.wheelDeltaPercentage = 0.01;
    this.camera.lowerBetaLimit = -Math.PI / 2;
    this.camera.upperBetaLimit = Math.PI / 2;

    //this.CreateController();
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);
    light.intensity = 0.6;
    light.specular = Color3.Black();

    const light2 = new DirectionalLight("dir01", new Vector3(0, -0.5, -1.0), this.scene);
    light2.position = new Vector3(0, 1, 5);
    this.CreateSky();
    this.CreateEnvironment();
    this.CreateCharacter("init.glb",Vector3.Zero());

    this.CreateChooseYourOutfit();


    //Setup pour le cpt de Laine
    this.textBox = new SelectionPanel("textBox");
    this.text = new TextBlock();
    this.cptLaine = 0;
    this.mouton1 = true;
    this.available1 = "Collect your yarn !";
    this.timing = 0;
    this.avancement = 1;
    this.timersec = 5;
    const f = new Vector4(0, 0, 1, 1);
    this.plane = MeshBuilder.CreatePlane("plane", { frontUVs: f, backUVs: f, sideOrientation: Mesh.DOUBLESIDE });
    this.matcollect = new StandardMaterial("", this.scene);
    this.matcollect.diffuseTexture = new Texture("./textures/timer/collect.png");

    //pour les vetements:
    this.wardrobe = [];
    this.currentoutfit = "";
    this.alreadyRunwayOutfit = [];
    this.cptFashion = 0;
    //A AJOUTER
    this.up=false;
    this.left=false;
    this.down=false;
    this.right=false;

    this.CreateMouton(new Mouton("moutonGwen.glb"));
    this.CreateMouton(new Mouton("moutonGwen2.glb"));
    this.CreateMouton(new Mouton("moutonGwen3.glb"));
    this.CreateMouton(new Mouton("moutonGwen4.glb"));
    this.CreateMouton(new Mouton("moutonGwen5.glb"));

    

    //this.CreateCutScene();
    this.CreateStartRunway();
    //partie son
    this.SoundMamie();
    this.SoundMouton();
    this.background = new Sound("background","./audio/background.mp3",this.scene,null,{volume:0.3, autoplay : true});
    this.runwayMusic = new Sound("runway", "./audio/runway.mp3", this.scene,null,{volume:0.6});
    this.CreateMamie(); //Laisser ça comme le dernier pour l'ecran de chargement
    
    this.EndOfLoading();


  }
  run() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    //const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

    scene.onPointerDown=(evt)=>{
      //for the mouse settings, 0:left click,1:middle mouse button,2:right click
      if (getComputedStyle(document.querySelector("#laineMobile")! as HTMLDivElement).display=="none"){ //On est pas en version mobile
        if (evt.button===0) this.engine.enterPointerlock();
        if (evt.button===1) this.engine.exitPointerlock();
      }
  }
    //onst framesPerSecond = 60;
    //const gravity = -9.81;
    //gravity on the y axis
    //scene.gravity = new Vector3(0, gravity / framesPerSecond, 0);
    //enable collisions
    scene.collisionsEnabled = true;

    //Creating the environment using a Skybox
    /*const envTex=CubeTexture.CreateFromPrefilteredData("./environment/environment.env", scene);
    scene.environmentTexture=envTex;
    scene.createDefaultSkybox(envTex,true);
    scene.environmentIntensity=0.45; //reducing the environment lighting*/


    return scene;
  }
  SoundMamie(){
    const music = new Sound("mamie","./audio/knitting.mp3",this.scene, null, {
      loop: true,
      autoplay: true,
      spatialSound: true,
      maxDistance:10,
    });
    music.setPosition(new Vector3(-40, 0, 25));
  }

  SoundMouton(){
    /*
    const plane = MeshBuilder.CreatePlane("plane");
    plane.position = new Vector3(36,2,10);
    const plane1 = MeshBuilder.CreatePlane("plane");
    plane1.position = new Vector3(45,2,1);
    const plane2 = MeshBuilder.CreatePlane("plane");
    plane2.position = new Vector3(45,2,-8);
    const plane3 = MeshBuilder.CreatePlane("plane");
    plane3.position = new Vector3(50,2,18);
    const plane4 = MeshBuilder.CreatePlane("plane");
    plane4.position = new Vector3(55,2,10);
    */

    const mouton1 = new Sound("mouton","./audio/mouton.mp3",this.scene, null, {
      loop: true,
      volume:0.5,
      autoplay: true,
      spatialSound: true,
      maxDistance:8,
    });  // LE NOM DED MOUTONS MATCH PAS AVEC LES FICHIER BLENDER
    mouton1.setPosition(new Vector3(36,2,10));

    const mouton2 = new Sound("mouton","./audio/mouton.mp3",this.scene, null, {
      loop: true,
      volume:0.5,
      autoplay: true,
      spatialSound: true,
      maxDistance:8,
    });  // LE NOM DED MOUTONS MATCH PAS AVEC LES FICHIER BLENDER
    mouton2.setPosition(new Vector3(45,2,1));

    const mouton3 = new Sound("mouton","./audio/mouton.mp3",this.scene, null, {
      loop: true,
      volume:0.5,
      autoplay: true,
      spatialSound: true,
      maxDistance:8,
    });  // LE NOM DED MOUTONS MATCH PAS AVEC LES FICHIER BLENDER
    mouton3.setPosition(new Vector3(45,2,-8));

    const mouton4 = new Sound("mouton","./audio/mouton.mp3",this.scene, null, {
      loop: true,
      volume:0.5,
      autoplay: true,
      spatialSound: true,
      maxDistance:8,
    });  // LE NOM DED MOUTONS MATCH PAS AVEC LES FICHIER BLENDER
    mouton4.setPosition(new Vector3(50,2,18));

    const mouton5 = new Sound("mouton","./audio/mouton.mp3",this.scene, null, {
      loop: true,
      volume:0.5,
      autoplay: true,
      spatialSound: true,
      maxDistance:8,
    });  // LE NOM DED MOUTONS MATCH PAS AVEC LES FICHIER BLENDER
    mouton5.setPosition(new Vector3(55,2,10));

  }

  CreateSky() {
    const dome = new PhotoDome(
      "testdome",
      "./environment/sky3.png",
      {},
      this.scene
    );
  }
  async CreateCharacter(path:string, pos:Vector3){
    // Keyboard events
  const inputMap: { [id: string] : boolean} = {}
  this.scene.actionManager = new ActionManager(this.scene);
  this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  }));
  this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  }));

  const{meshes,animationGroups}=await SceneLoader.ImportMeshAsync("","./animated/",path);
  const hero=meshes[0];
  this.heroMesh=hero;
  console.log(this.heroMesh);
  //this.heroMesh.showBoundingBox=true;
  //this.heroMesh.physicsImpostor = new PhysicsImpostor(this.heroMesh,PhysicsImpostor.BoxImpostor, { mass: 0.1 }, this.scene);
  
  
  this.heroMesh.position=new Vector3(0,0,0);
  
  hero.position=pos;
  console.log(pos);
  hero.scaling.scaleInPlace(2.5);
  this.camera.lockedTarget=hero;

  const heroSpeed = 0.15;
  const heroSpeedBackwards = 0.15;
  const heroRotationSpeed = 0.05;
  this.PersoAnim=animationGroups;
  console.log(this.PersoAnim);
  const idle=this.PersoAnim[1]; 
  const catWalking=this.PersoAnim[2];
  const walking=this.PersoAnim[3];
  const collect=this.PersoAnim[0];
  let animating=true;
  collect.stop();
  idle.start();
  this.scene.onBeforeRenderObservable.add(() => {
      let keydown = false;
      this.heroMesh.position.y=0;
      console.log("position:"+this.heroMesh.position);
      console.log("positioneny "+this.heroMesh.position.y);
      //Manage the movements of the character (e.g. position, direction)
      if (inputMap["w"]||this.up||inputMap["z"]) {
          hero.moveWithCollisions(hero.forward.scaleInPlace(heroSpeed));
          keydown = true;
      }
      if (inputMap["s"]||this.down) {
          hero.moveWithCollisions(hero.forward.scaleInPlace(-heroSpeedBackwards));
          keydown = true;
      }
      if (inputMap["a"]||this.left||inputMap["q"]) {
          hero.rotate(Vector3.Up(), -heroRotationSpeed);
          keydown = true;
      }
      if (inputMap["d"]||this.right) {
          hero.rotate(Vector3.Up(), heroRotationSpeed);
          keydown = true;
      }
      

      //Manage animations to be played  
      if (keydown) {
          if (!animating) {
              animating = true;
              if (inputMap["s"]) {
                  //Walk backwards
                  walking.start(true, 1.0, walking.from, walking.to, false);
              }
              else {
                  //Walk
                  walking.start(true, 1.0, walking.from, walking.to, false);
              }
          }
      }
      else {

          if (animating) {
              //Default animation is idle when no key is down     
              idle.start(true, 1.0, idle.from, idle.to, false);

              //Stop all animations besides Idle Anim when no key is down
              
              walking.stop();

              //Ensure animation are played only once per rendering loop
              animating = false;
          }
        //if (this.runway){
          //animating=false;
          //walking.stop();
          //idle.stop();
          //catWalking.start(true);
        //}
      }
  });
  

}
ChangePerso(new_path:string){
  const getPos=this.heroMesh.position;
  console.log("c'est la nouvelle position :"+getPos);
  this.heroMesh.dispose();
  this.CreateCharacter(new_path,getPos);

}
async CreateMouton(mouton : Mouton): Promise<void> {
    
  const { meshes } = await SceneLoader.ImportMeshAsync(
    "",
    "./models/",
    mouton.path,
    this.scene
  );
  //apply collisions to every mesh in the model
  //.map goes through every mesh
  let i =0;
  meshes.map(mesh=>{ //for each mesh apply collisions donc c'est comme un for i in list par exemple
     mesh.checkCollisions=true;
     //console.log("meshes : "+i+" "+mesh);
     i++;
    //Création de l'intéraction avec mouton
    mesh.actionManager = new ActionManager(this.scene);
    mesh.actionManager.registerAction(
      new ExecuteCodeAction({trigger: ActionManager.OnPickTrigger},(evt) => this.Mouton1OnClick(this,mouton)));  //Quand on click sur la boule ca lance Mouton1OnClick

  })

  //Plan 2D qui donne des infos au dessus
  //const plane = Mesh.CreatePlane("plane",2,this.scene); //plane, le plan 2D sur lequel on va cliquer, 2=size
  //plane.parent = meshes[0];
  //plane.position.y = 2;

  
  //const matcollect = new StandardMaterial("",this.scene);
  //matcollect.diffuseTexture = new Texture("./textures/timer/collect.png");   ////./textures/timer/collect.png
  //textures pour la barres qui augmente
  //const matbarre = new StandardMaterial("",this.scene);             CES DEUX LIGNE ELLES SONT UTILS ??
  //matbarre.diffuseTexture = new Texture("./textures/timer/barre1.png");
  
  
  //const f = new Vector4(0,0, 1 , 1); // front image = half the whole image along the width 
  //const b = new Vector4(1,0, 1, 1); // back image = second half along the width
  
  //const plane = MeshBuilder.CreatePlane("plane", {frontUVs: f, backUVs: f, sideOrientation: Mesh.DOUBLESIDE});
  mouton.plane.parent = meshes[1];
  mouton.plane.position.y = 2;
  mouton.plane.scaling.x=4;
  mouton.plane.scaling.y=1;
  mouton.plane.rotate(new Vector3(0,1,0),-1.5708);
  mouton.plane.material = this.matcollect;
}

Mouton1OnClick(self : App, mouton : Mouton):void{
  if (mouton.available){
    self.cptLaine+=1;
    document.getElementById("cptLaineM")!.innerHTML = self.cptLaine+"" ;
    document.getElementById("cptLaineO")!.innerHTML = self.cptLaine+"" ;
    mouton.available=false;
    console.log("Juste avant timer");
    //button.textBlock!.text = "Please wait to collect your yarn";
    const timer = new AdvancedTimer({timeout:10,contextObservable: self.scene.onBeforeRenderObservable});  //Timer à 0 jsp pk mais j'ai pas vu de changements en fonctions des valeurs
    timer.onTimerEndedObservable.add((evt) => self.Timer(self,mouton));
    timer.onEachCountObservable.add((evt) => self.Waiting(self,mouton));   /// CA FAIT UN PTN DE NB DE FOIS ALEATOIRE
    //timer.start(self.timersec*1000); //La durée du timer
    timer.start(5000); //La durée du timer
  }
  self.textBox.addControl(self.text);

}


  Timer(self :App,mouton : Mouton) : void{
    mouton.available=true;
    //button.textBlock!.text = this.available1 ;
    mouton.plane.material = self.matcollect ;
    mouton.timer=0;
    mouton.avancement = 1 ;
  }

  Waiting(self : App,mouton : Mouton) : void{
    mouton.available=false;
    console.log("le Timer ???");
    if (mouton.timer%(Math.trunc(self.timersec*1000/340))==0&&mouton.avancement<=17){
      const matbarre = new StandardMaterial("",this.scene);
      matbarre.diffuseTexture = new Texture("./textures/timer/barre"+mouton.avancement+".png");
      // mettre self.timersec/340 en entier 
      mouton.plane.material = matbarre ;
      //console.log("la valeur : "+Math.trunc(self.timersec*1000/340));
      mouton.avancement+=1;
      //matbarre.diffuseTexture = new Texture("./textures/timer/barre1.png");
      //button.textBlock!.text = `Wait ${self.timersec - (self.timing/(self.timersec*10))} seconds to collect your next yarn` ;
    }
    mouton.timer+=1;
     
  }

  async CreateEnvironment(): Promise<void> {

    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "withRunway.glb",
      this.scene
    );

    //apply collisions to every mesh in the model
    //.map goes through every mesh
    meshes.map(mesh => { //for each mesh apply collisions donc c'est comme un for i in list par exemple
      mesh.checkCollisions = true;
    })

  }

  //CreateController(): void {
    //const camera=new FreeCamera("camera",new Vector3(0,10,0),this.scene); //without a camera we can't see anything
    //static camera unless we attach control
    /* this.camera.attachControl();


    this.camera.applyGravity = true; //applies gravity to the camera which is our controller
    this.camera.checkCollisions = true;
    //but this will not work unless we can "detect" the camera, we need to create a 'body' for the camera => elipsoid 

    this.camera.ellipsoid = new Vector3(1, 1, 1);

    this.camera.minZ = 0.45; //this allows us to not get very close to the objects and see through them
    this.camera.speed = 0.5;
    this.camera.angularSensibility = 4000; //rotate more slowly

    //personalize the keys for the controller movement
    //we can still use arrows keys for movement donc both options are available
    this.camera.keysUp.push(87); //keycode for W is 87 check https://www.toptal.com/developers/keycode
    this.camera.keysUp.push(90); // 90 : z pour les azerty : dsl hajar
    this.camera.keysRight.push(68); //65: d
    this.camera.keysDown.push(83);//83:s
    this.camera.keysLeft.push(81);//81:q
    */ 



  //}

 

  CreateActions(obj: AbstractMesh): void {
    obj.actionManager = new ActionManager(this.scene);
    obj.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickTrigger

        }, () => this.ClickMamie(this)));
  }
  ClickMamie(self: App) {
    self.engine.exitPointerlock();
    console.log(document.getElementById("modal-wrapper"));
    (document.querySelector(".modal-wrapper") as HTMLDivElement).style.display = "block";  //AFFICHE LA PAGE SHOP
    (document.querySelector(".modal-close") as HTMLDivElement).addEventListener("click", hide);  //Clique de la croix ?
    (document.querySelector(".AV1") as HTMLDivElement).addEventListener("click", hide);   //Clique du bouton ?

    function hide() {
      (document.querySelector(".modal-wrapper") as HTMLDivElement).style.display = "none";  //Enlève la page shop
      self.engine.enterPointerlock();
    }
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
    button1.onPointerUpObservable.add(() => this.ClickOutfit(this));
    advancedTexture2.addControl(button1);
    
  }

  ClickOutfit(self : App):void{
    (document.querySelector(".modal-wrapper-outfit") as HTMLDivElement).style.display = "block";  //AFFICHE LA PAGE SHOP
    
    (document.querySelector(".modal-close-outfit") as HTMLDivElement).addEventListener("click", hide);  //Clique de la croix ?
      document.getElementById("./image/horizontal/manche.png")!.addEventListener("click", (evt)=>wear("manche",evt));
      document.getElementById("./image/horizontal/manche_bob.png")!.addEventListener("click", (evt)=>wear("manche_bob",evt));
      document.getElementById("./image/horizontal/long_blanc.png")!.addEventListener("click", (evt)=>wear("long_blanc",evt));
      document.getElementById("./image/horizontal/fleur_blanc.png")!.addEventListener("click", (evt)=>wear("fleur_blanc",evt));
      document.getElementById("./image/horizontal/fleur_blanc_bob.png")!.addEventListener("click", (evt)=>wear("fleur_blanc_bob",evt));
      document.getElementById("./image/horizontal/fleur_bleu.png")!.addEventListener("click", (evt)=>wear("fleur_bleu",evt));
      document.getElementById("./image/horizontal/fleur_bleu_bob.png")!.addEventListener("click", (evt)=>wear("fleur_bleu_bob",evt));
      document.getElementById("./image/horizontal/long_blanc_bob.png")!.addEventListener("click", (evt)=>wear("long_blanc_bob",evt));
      document.getElementById("./image/horizontal/long_marron_bob.png")!.addEventListener("click", (evt)=>wear("long_marron_bob",evt));
      document.getElementById("./image/horizontal/long_marron.png")!.addEventListener("click", (evt)=>wear("long_marron",evt));
      document.getElementById("./image/horizontal/initial_bob.png")!.addEventListener("click", (evt)=>wear("bob",evt));

    
    // fonction pour changer d'outfit 

    function wear(id:string,evt:Event){
      const outfit = [];
      const clothes = ["bob", "manche", "fleur_blanc", "fleur_bleu", "long_blanc", "long_marron"];
      for(let i=0; i<clothes.length; i++){
        if(id.includes(clothes[i])){
          outfit.push(clothes[i]);
        }
      }
      let wearable = true;
      for(let i=0; i<outfit.length; i++){
        if(isOwned(outfit[i])==false){
          wearable = false;
        }
      }
      if(wearable == true){
        self.currentoutfit = "./outfit/"+id+".png";
        console.log(self.currentoutfit);
        document.getElementById("imgoutfit")!.setAttribute('src', self.currentoutfit );
        console.log(document.getElementById("imgoutfit")!.getAttribute("src"));
        const new_path=id+".glb";
        self.ChangePerso(new_path);
        console.log("on va changer d'outfit");
      }
      else{
        alert("You dont own that outfit for the moment :(");
      }
      evt.stopImmediatePropagation();
    }

    
    //fonction pour voir si on possède un habit
    function isOwned(name: string){
      for(const c of self.wardrobe){
        if(c.name==name){
          return true;
        }
      }
      return false;
    }
  

    function hide() {
        (document.querySelector(".modal-wrapper-outfit") as HTMLDivElement).style.display = "none";  //Enlève la page shop
        }

    ///////// Debut du cpt de fashion ///////////////
    ///Mettre dans un event Listener on a changé d'outfit
    /*
    for (let i =0 ; i<= self.fashionLevel ; i++){
      (document.querySelector("#etoile"+i) as HTMLImageElement).style.display = "none" ;//  ../../public/fashion/star65.png Mettre ca pour l'hebergement je pense
      (document.querySelector("#etoile"+i+"Obtenue") as HTMLImageElement).style.display = "block" ;
    }
    
    self.fashionLevel += 0.5;
    */
  }
  
  CreateCutScene(self : App):void{
    // ------ partie etoiles  -----
    console.log("dans cutscene", this.cptFashion);
    let alreadyWorn = false;
    for(let i=0; i<=this.alreadyRunwayOutfit.length; i++){
      if(this.alreadyRunwayOutfit[i]==this.currentoutfit){
        alreadyWorn = true;
      }
    }
    //si outfit n'a jamais été porté sur le runway: augmenter le conteur de fashion

    if(!alreadyWorn){
      this.alreadyRunwayOutfit.push(this.currentoutfit);
      console.log("pas worn", this.cptFashion,"already warn :",alreadyWorn);
      this.cptFashion+=1;
      if (this.cptFashion%2==0){
        for (let i =0 ; i< this.cptFashion/2 ; i++){
          (document.querySelector("#etoile"+i) as HTMLImageElement).style.display = "none" ;//  ../../public/fashion/star65.png Mettre ca pour l'hebergement je pense
          (document.querySelector("#etoile"+i+"Half") as HTMLImageElement).style.display = "none" ;
          (document.querySelector("#etoile"+i+"Obtenue") as HTMLImageElement).style.display = "block" ;
        }
        console.log("dans le if", this.cptFashion);
      }
      else{
        for (let i =0 ; i< (this.cptFashion-1)/2 ; i++){
          (document.querySelector("#etoile"+i) as HTMLImageElement).style.display = "none" ;//  ../../public/fashion/star65.png Mettre ca pour l'hebergement je pense
          (document.querySelector("#etoile"+i+"Half") as HTMLImageElement).style.display = "none" ;
          (document.querySelector("#etoile"+i+"Obtenue") as HTMLImageElement).style.display = "block" ;
        }
        (document.querySelector("#etoile"+((this.cptFashion-1)/2)) as HTMLImageElement).style.display = "none" ;//  ../../public/fashion/star65.png Mettre ca pour l'hebergement je pense
        (document.querySelector("#etoile"+((this.cptFashion-1)/2)+"Half") as HTMLImageElement).style.display = "block" ;
        console.log("dans le else", this.cptFashion);
      }
      
    }
    // ________ music ________
    this.background.pause();
    this.runwayMusic.play();

    //------- avancement -----------
    //this.runway=true;
    this.PersoAnim[3].stop();
    this.PersoAnim[1].stop();
    this.PersoAnim[2].play();
    this.heroMesh.position = new Vector3(-15,1.65,-26.5);
    console.log((document.querySelector("#laine")! as HTMLDivElement).style.display=="block");
    (document.querySelector("#overlay") as HTMLImageElement).style.display = "none" ;
    const i =0;
    const timer1 = new AdvancedTimer({timeout:14,contextObservable: self.scene.onBeforeRenderObservable});  //Timer à 0 jsp pk mais j'ai pas vu de changements en fonctions des valeurs
    timer1.onTimerEndedObservable.add(() => this.Move1(i));
    timer1.start(14);


    // ------ Manip camera cut scene -----
    const FreeCam=new FreeCamera("FreeCam", new Vector3(0, 10, 0), this.scene);
    const camKeys = [];
    console.log("Dans la methode",self);
    const fps = 60;
    const camAnim = new Animation(
      "camAnim",
      "position",
      fps,Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      true);

    camKeys.push({frame:0 , value: new Vector3(-15,3,-20)});
    camKeys.push({frame:6* fps , value: new Vector3(-23.5,3,-20)});
    //camKeys.push({frame:5* fps , value: new Vector3(-35,2,-20)});
    camKeys.push({frame:12* fps , value: new Vector3(-32,3,-20)});
    //camKeys.push({frame:8* fps +1 , value: new Vector3(-28,4,-23)});
    //camKeys.push({frame:16* fps , value: new Vector3(-15,4,-23)});
    camAnim.setKeys(camKeys);
    this.camera.detachControl();
    this.scene.activeCamera = FreeCam ;
    FreeCam.position = new Vector3(-15,3,-20);
    FreeCam.rotation = new Vector3(0,Math.PI,0);
    FreeCam.minZ=0.45; //this allows us to not get very close to the objects and see through them
    FreeCam.speed=0.01;
    FreeCam.animations.push(camAnim);
    self.scene.beginAnimation(FreeCam, 0,12* fps);
    const timer = new AdvancedTimer({timeout:8* fps,contextObservable: self.scene.onBeforeRenderObservable});  //Timer à 0 jsp pk mais j'ai pas vu de changements en fonctions des valeurs
    timer.onTimerEndedObservable.add(() => {
      this.PersoAnim[2].stop();
      this.PersoAnim[1].play();
      self.SecondAnimation(self,FreeCam)});
    timer.start(18000);


  }

  Move1(i : any){
    if (i<170){
      const timer1 = new AdvancedTimer({timeout:14,contextObservable: this.scene.onBeforeRenderObservable});  //Timer à 0 jsp pk mais j'ai pas vu de changements en fonctions des valeurs
      timer1.onTimerEndedObservable.add(() => this.Move1(i));
      timer1.start(50);
      this.heroMesh.position=this.heroMesh.position.add(new Vector3(-0.1,0,0));
      i++;
    }
  }

  Move2(i : any){
    if (i<170){
      const timer1 = new AdvancedTimer({timeout:14,contextObservable: this.scene.onBeforeRenderObservable});  //Timer à 0 jsp pk mais j'ai pas vu de changements en fonctions des valeurs
      timer1.onTimerEndedObservable.add(() => this.Move2(i));
      timer1.start(50);
      this.heroMesh.position=this.heroMesh.position.add(new Vector3(0.1,0,0));
      i++;
    }
  }

  SecondAnimation(self: App,FreeCam : FreeCamera) {
    const fps = 60;
    const camKeys = [];
    const camAnim = new Animation(
      "camAnim",
      "position",
      fps, Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      true);
    

      const i =0;
      const timer1 = new AdvancedTimer({timeout:14,contextObservable: self.scene.onBeforeRenderObservable});  //Timer à 0 jsp pk mais j'ai pas vu de changements en fonctions des valeurs
      timer1.onTimerEndedObservable.add(() => {
        //Mettre idle animation
        this.heroMesh.rotate(Vector3.Up(),Math.PI);
        this.PersoAnim[2].stop();
        this.PersoAnim[1].play();
        this.Move2(i)
      });
      timer1.start(2400);


    camKeys.push({ frame: 0, value: new Vector3(-40, 5.5, -26) });
    camKeys.push({ frame: 2 * fps, value: new Vector3(-40, 5.5, -26) });
    camKeys.push({ frame: 10 * fps, value: new Vector3(-26, 5.5, -26) });
    camAnim.setKeys(camKeys);
    FreeCam.rotation = new Vector3(Math.PI / 8, Math.PI / 2, 0);
    FreeCam.position = new Vector3(-40, 5.5, -26);
    FreeCam.animations.slice(0, FreeCam.animations.length);
    FreeCam.animations.push(camAnim);
    self.camera.speed=0.001;
    self.scene.beginAnimation(FreeCam, 0, 10 * fps);
    const timer = new AdvancedTimer({ timeout: 8 * fps, contextObservable: self.scene.onBeforeRenderObservable });  //Timer à 0 jsp pk mais j'ai pas vu de changements en fonctions des valeurs
    timer.onTimerEndedObservable.add(() => {
      (document.querySelector("#overlay") as HTMLImageElement).style.display = "block" ;
      self.AfterCutScene(self,FreeCam);
      this.runwayMusic.pause();
      this.background.play();
      this.PersoAnim[1].stop();
      this.PersoAnim[2].stop();
      this.PersoAnim[3].play();
      });
    timer.start(19000);
  }

  AfterCutScene(self: App,FreeCam : FreeCamera) {
    /*FreeCam.position = new Vector3(-10, 2, -29);
    FreeCam.attachControl();
    FreeCam.applyGravity = true; //applies gravity to the camera which is our controller
    FreeCam.checkCollisions = true;
    //but this will not work unless we can "detect" the camera, we need to create a 'body' for the camera => elipsoid 

    FreeCam.ellipsoid = new Vector3(1, 1, 1);

    FreeCam.minZ = 0.45; //this allows us to not get very close to the objects and see through them
    FreeCam.speed = 0.5;
    FreeCam.angularSensibility = 4000; //rotate more slowly
    FreeCam.keysUp.push(87); //keycode for W is 87 check https://www.toptal.com/developers/keycode
    FreeCam.keysUp.push(90); // 90 : z pour les azerty : dsl hajar
    FreeCam.keysRight.push(68); //65: d
    FreeCam.keysDown.push(83);//83:s
    FreeCam.keysLeft.push(81);//81:q*/
    this.scene.activeCamera = this.camera;
    this.camera.attachControl();
    this.runway = false;

  }

  /*async CreatePersonnage(): Promise<void> {
    
    const { meshes , animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "./animated/",
      "long_marron.glb",
      this.scene
    );
    meshes[0].rotate(Vector3.Up(),Math.PI/2);
    meshes[0].position = new Vector3(-15,1.65,-26.5);
    meshes[0].scaling = new Vector3(2,2,2);
    
    //console.log("Animation group : ", animationGroups);

    animationGroups[0].stop();
    animationGroups[2].play(true);
  }*/

  CreateStartRunway():void {
    const plane = Mesh.CreatePlane("plane",3,this.scene); //plane, le plan 2D sur lequel on va cliquer, 2=size
    plane.position.y = 2;
    plane.position.x = -9;
    plane.position.z = -26.5;
    plane.rotate(new Vector3(0,1,0),-1.5708);

    const advancedTexture2 = AdvancedDynamicTexture.CreateForMesh(plane);

    const button1 = Button.CreateSimpleButton("but1", "Start your runway");
    button1.width = 1;
    button1.height = 0.4;
    button1.color = "black";
    button1.fontSize = 50;
    button1.background = "pink";
    advancedTexture2.addControl(button1);
    console.log("Juste avant",this);
    button1.onPointerUpObservable.add(() => this.CreateCutScene(this));
    
    
  }
  async CreateMamie(): Promise<void> {
    
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "MamieAnimated.glb",
      this.scene
    );
    //apply collisions to every mesh in the model
    //.map goes through every meshs
    meshes.map(mesh=>{ //for each mesh apply collisions donc c'est comme un for i in list par exemple
       mesh.checkCollisions=true;
      mesh.actionManager = new ActionManager(this.scene);
      mesh.actionManager.registerAction(
        new ExecuteCodeAction({trigger: ActionManager.OnPickTrigger},() => this.Shop(this)));  //Quand on click sur la boule ca lance Mouton1OnClick
    })
    //meshes[0].rotate(Vector3.Up(),Math.PI/2);
    meshes[0].position = new Vector3(-40,0,25);
    meshes[0].scaling = new Vector3(2,2,2);

    this.engine.hideLoadingUI(); //la page a fini de charger
  }
  Shop(self : App){
    (document.querySelector(".modal-wrapper") as HTMLDivElement).style.display = "block";  //AFFICHE LA PAGE SHOP
        (document.querySelector(".modal-close") as HTMLDivElement).addEventListener("click", hide);  //Clique de la croix ?


        document.getElementById("manche")!.addEventListener("click",(evt) => buy("manche",self,evt));  //buy cloth1
        (document.querySelector("#fleur_bleu") as HTMLButtonElement)!.addEventListener("click",(evt) => buy("fleur_bleu",self,evt));
        (document.querySelector("#fleur_blanc") as HTMLButtonElement)!.addEventListener("click",(evt) => buy("fleur_blanc",self,evt));
        (document.querySelector("#long_blanc") as HTMLButtonElement)!.addEventListener("click",(evt) => buy("long_blanc",self,evt));
        (document.querySelector("#long_marron") as HTMLButtonElement)!.addEventListener("click",(evt) => buy("long_marron",self,evt));
        (document.querySelector("#bob") as HTMLButtonElement)!.addEventListener("click",(evt) => buy("bob", self,evt));
      /*
        document.getElementById("./image/horizontal/manche.png")!.addEventListener("click", (evt)=>wear("manche",evt));
        document.getElementById("./image/horizontal/manche_bob.png")!.addEventListener("click", (evt)=>wear("manche_bob",evt));
        document.getElementById("./image/horizontal/long_blanc.png")!.addEventListener("click", (evt)=>wear("long_blanc",evt));
        document.getElementById("./image/horizontal/fleur_blanc.png")!.addEventListener("click", (evt)=>wear("fleur_blanc",evt));
        document.getElementById("./image/horizontal/fleur_blanc_bob.png")!.addEventListener("click", (evt)=>wear("fleur_blanc_bob",evt));
        document.getElementById("./image/horizontal/fleur_bleu.png")!.addEventListener("click", (evt)=>wear("fleur_bleu",evt));
        document.getElementById("./image/horizontal/fleur_bleu_bob.png")!.addEventListener("click", (evt)=>wear("fleur_bleu_bob",evt));
        document.getElementById("./image/horizontal/long_blanc_bob.png")!.addEventListener("click", (evt)=>wear("long_blanc_bob",evt));
        document.getElementById("./image/horizontal/long_marron_bob.png")!.addEventListener("click", (evt)=>wear("long_marron_bob",evt));
        document.getElementById("./image/horizontal/long_marron.png")!.addEventListener("click", (evt)=>wear("long_marron",evt));
        document.getElementById("./image/horizontal/initial_bob.png")!.addEventListener("click", (evt)=>wear("bob",evt));
*/
        
      function hide() {
          (document.querySelector(".modal-wrapper") as HTMLDivElement).style.display = "none";  //Enlève la page shop
          }

      

      //fonction pour obtenir un vetement

      function buy(name: string, self: App,evt:Event){
        if(isOwned(name)==true){
          alert("You already own "+name);
        }
        else{
          console.log(name);
          let price = 6;
          if(name=="bob"){
            price = 3;
          }
          const cloth = new Cloth(name, price);
          if((self.cptLaine >= cloth.price)){
            self.cptLaine = self.cptLaine-cloth.price;
            document.getElementById("cptLaineM")!.innerHTML = self.cptLaine+"" ;
            document.getElementById("cptLaineO")!.innerHTML = self.cptLaine+"" ;
            cloth.owned = true;
            self.wardrobe.push(cloth);
            alert("You just bought "+cloth.name);
            }
           
          else{
             alert("You dont have enought wool, soory :(");
          }
        }
        evt.stopImmediatePropagation();
      
      }   
    
      //fonction pour voir si on possède un habit
      function isOwned(name: string){
        for(const c of self.wardrobe){
          if(c.name==name){
            return true;
          }
        }
        return false;
      }
    }

    EndOfLoading() {
      document.querySelector(".modal-close-beginning")!.addEventListener("click",() => {
        (document.querySelector(".modal-wrapper-beginning") as HTMLDivElement).style.display = "none";
      })
      
      document.querySelector("#flecheU").addEventListener("mouseenter",() => this.up=true);
      document.querySelector("#flecheD").addEventListener("mouseenter",() => this.down=true);
      document.querySelector("#flecheL").addEventListener("mouseenter",() => this.left=true);
      document.querySelector("#flecheR").addEventListener("mouseenter",() => this.right=true);

      document.querySelector("#flecheU").addEventListener("mouseleave",() => this.up=false);
      document.querySelector("#flecheD").addEventListener("mouseleave",() => this.down=false);
      document.querySelector("#flecheL").addEventListener("mouseleave",() => this.left=false);
      document.querySelector("#flecheR").addEventListener("mouseleave",() => this.right=false);
      //Affichier la page de départ avec les regles/explication
  
    }
}
class Mouton{
  public timer : int;
  public avancement : int;
  public available : boolean;
  public path : string;
  public plane : Mesh;
  //public matcollect : StandardMaterial;

  constructor(path : string){
    this.timer=0;
    this.avancement=1;
    this.available=true;
    this.path=path;
    const f = new Vector4(0,0, 1 , 1);
    this.plane = MeshBuilder.CreatePlane("plane", {frontUVs: f, backUVs: f, sideOrientation: Mesh.DOUBLESIDE});
    //this.matcollect = new StandardMaterial("",this.scene);
    //this.matcollect.diffuseTexture = new Texture("./textures/timer/collect.png");
    
  }
}



class Cloth{
  name: string;
  price: int;
  worn : boolean;
  owned: boolean;

  constructor(n:string, p: int ){
    this.name = n;
    this.price = p;
    this.worn = false;
    this.owned = false;
  }

}
