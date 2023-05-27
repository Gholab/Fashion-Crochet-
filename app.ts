
import { Scene, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, SceneInstrumentation, MeshBuilder, AbstractMesh, Constants, Mesh, ActionManager, ExecuteCodeAction, PhysicsImpostor, int, AdvancedTimer, StandardMaterial, Texture, Vector4, Color3, Color4, Animation, CubeTexture, PhotoDome, ArcRotateCamera, DirectionalLight, CannonJSPlugin, Sound, AnimationGroup } from "babylonjs";
import "babylonjs-loaders";
import "babylonjs-gui";
import { AdvancedDynamicTexture, Button, Control, GUI3DManager, MeshButton3D, SelectionPanel, SelectorGroup, Slider3D, TextBlock } from "babylonjs-gui";
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
  new_path: string;
  alreadyRunwayOutfit :string[];
  heroMesh:AbstractMesh;
  up: boolean;
  left: boolean;
  down: boolean;
  right: boolean;
  PersoAnim: AnimationGroup[];
  runwayMusic : Sound;
  background : Sound;
  id: string;

  memoryPlaying : boolean;
  memoCartes : any[];
  memo1 : int;
  memoTries : int;
  memoWait :boolean;
  memoWin : int;
  cptFood :int;

  nberreurs :int;
  motadecouvrir :string;
  currentmot:string[];
  currentmotjoli :string[];
  limiteerreurs :int;
  enjeu :boolean;
  dico :string[];

  rotation : int;
  heroRotationSpeed : int;


  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.engine.displayLoadingUI(); //page de chargement

    this.scene = this.CreateScene();

    //this.CreateEnvironment();
    this.CreateSky();
    this.heroMesh;
    
    this.PersoAnim;
    this.id;

    this.new_path;
    
    
    //this.scene.debugLayer.show();
    
    this.camera=new ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, new Vector3(0, 1, 0), this.scene);
    this.scene.activeCamera = this.camera;
    this.scene.activeCamera.attachControl(this.canvas, true);
    this.camera.lowerRadiusLimit = 2;
    this.camera.upperRadiusLimit = 10;
    this.camera.wheelDeltaPercentage = 0.01;
    this.camera.lowerBetaLimit = -Math.PI / 2.1;
    this.camera.upperBetaLimit = Math.PI / 2.1;
    console.log("camera est changee 2.3");
    const light = new HemisphericLight("light1", new Vector3(0, 2, 0), this.scene);
    light.intensity = 0.6;
    light.specular = Color3.Black();

    const light2 = new HemisphericLight("light1", new Vector3(10, 2, 10), this.scene);
    const light3 = new HemisphericLight("light1", new Vector3(1, 2, 25), this.scene);
    this.CreateSky();
    //this.CreateEnvironment();

    this.CreateChooseYourOutfit();


    //Setup pour le cpt de Laine
    this.textBox = new SelectionPanel("textBox");
    this.text = new TextBlock();

    if (localStorage.getItem("cptLaine")){
      this.cptLaine=JSON.parse(localStorage.getItem("cptLaine"));
      document.getElementById("cptLaineM")!.innerHTML = this.cptLaine+"" ;
      document.getElementById("cptLaineO")!.innerHTML = this.cptLaine+"" ;
    }
    else{
      this.cptLaine = 100;
      document.getElementById("cptLaineM")!.innerHTML = this.cptLaine+"" ;
      document.getElementById("cptLaineO")!.innerHTML = this.cptLaine+"" ;
    }
    console.log("local Storage "+localStorage.getItem("cptLaine"));
    console.log("compteur de laine:"+this.cptLaine);
    this.mouton1 = true;
    this.available1 = "Collect your yarn !";
    this.timing = 0;
    this.avancement = 1;
    this.timersec = 5;
    const f = new Vector4(0, 0, 1, 1);
    //this.plane = MeshBuilder.CreatePlane("plane", { frontUVs: f, backUVs: f, sideOrientation: Mesh.DOUBLESIDE });
    this.matcollect = new StandardMaterial("", this.scene);
    this.matcollect.diffuseTexture = new Texture("./textures/timer/collect.png");

    //pour les vetements:
    if(localStorage.getItem("wardrobe")){
      this.wardrobe=JSON.parse(localStorage.getItem("wardrobe"));
    }
    else{
    this.wardrobe = [];
    }
   

    if(localStorage.getItem("currentoutfit")){
      this.currentoutfit=JSON.parse(localStorage.getItem("currentoutfit"));
      this.CreateCharacter(this.currentoutfit+".glb",Vector3.Zero());
      
      console.log("currentoutfit "+this.currentoutfit.toString());
    }
    else{
      this.currentoutfit = "";
      this.CreateCharacter("initial.glb",Vector3.Zero());
    }
    
    if (localStorage.getItem("alreadyRunwayOutfit")){
      this.alreadyRunwayOutfit=JSON.parse(localStorage.getItem("alreadyRunwayOutfit"));
    }
    else{
      this.alreadyRunwayOutfit = [];
    }

    
    if (localStorage.getItem("cptFashion")){
      this.cptFashion=JSON.parse(localStorage.getItem("cptFashion"));
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
    else{
      this.cptFashion = 0;
    }
    
    //A AJOUTER
    this.up=false;
    this.left=false;
    this.down=false;
    this.right=false;

    // 2e merge
    this.CreateMemoryPlane()
    this.memoryPlaying=false;
    this.memoCartes = ["bobimg","bobimg","manches","manches","fleurBleu","fleurBleu","fleurBlanc","fleurBlanc","longBlanc","longBlanc","longMarron","longMarron"];
    this.memo1=-1;
    this.memoTries=10;
    this.memoWait=false;
    this.memoWin=0;

    this.heroRotationSpeed = 0.05;


    if (localStorage.getItem("cptFood")){
      this.cptFood=JSON.parse(localStorage.getItem("cptFood"));
      document.getElementById("cptFood")!.innerHTML = this.cptFood+"" ;
      
      
    }
    else{
      this.cptFood = 0;
      //test de changement
    }
    // PENDU
    this.nberreurs=1;
    this.motadecouvrir ="";
    this.currentmot = [];
    this.currentmotjoli =[];
    this.limiteerreurs =10;
    this.enjeu = false;
    this.dico = ["WOOL","CROCHET","FASHION","HOOK","HANDMADE","GREEN","SUSTAINABLE","RUNWAY","CATWALK","STAR","SHEEP","CLOTHES"];
    this.CreatePendu();
    
    //this.ChangePerspective();
    //rotation
    this.rotation=0;

    this.CreateStartRunway();
    //partie son
    this.SoundMamie();
    this.SoundMouton();
    this.background = new Sound("background","./audio/background.mp3",this.scene,null,{volume:0.3, autoplay : true, loop:true}); // HajarTEST j'ai fait loop le sound pour
    // pas que ca s'arrete en pleine session.
    this.runwayMusic = new Sound("runway", "./audio/runway.mp3", this.scene,null,{volume:0.6});
    //this.CreateMamie(); //Laisser ça comme le dernier pour l'ecran de chargement
    
    this.EndOfLoading();
    this.LoadMeshes();


  }
  ChangePerspective(){
    if ((this.heroMesh.position.x<(-37))&&(this.heroMesh.position.x>=(-33))&&(this.heroMesh.position.z<(20))&&(this.heroMesh.position.z>=(18.9))){
      this.Alert("je rentre dans le shop");
    }
  
  }
  async LoadMeshes(){
    await this.CreateMamie();
    await this.CreateEnvironment();
    await this.CreateMouton(new Mouton("moutonGwen.glb"));
    await this.CreateMouton(new Mouton("moutonGwen2.glb"));
    await this.CreateMouton(new Mouton("moutonGwen3.glb"));
    await this.CreateMouton(new Mouton("moutonGwen4.glb"));
    await this.CreateMouton(new Mouton("moutonGwen5.glb"));
    this.engine.hideLoadingUI();
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
   
    scene.collisionsEnabled = true;

    


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
  this.heroMesh=meshes[0];
  console.log(this.heroMesh);
  //this.heroMesh.showBoundingBox=true;
  //this.heroMesh.physicsImpostor = new PhysicsImpostor(this.heroMesh,PhysicsImpostor.BoxImpostor, { mass: 0.1 }, this.scene);
  
  this.heroMesh.ellipsoid=new Vector3(1,0.1,1);
  this.heroMesh.position=new Vector3(0,0.1,0);
  
  this.heroMesh.position=pos;
  //console.log(pos);
  this.heroMesh.scaling.scaleInPlace(2);
  this.camera.lockedTarget=this.heroMesh;

  const heroSpeed = 0.15;
  const heroSpeedBackwards = 0.15;
  //const heroRotationSpeed = 0.05;
  this.PersoAnim=animationGroups;

  const idle=this.PersoAnim[1]; 
  const catWalking=this.PersoAnim[2];
  const walking=this.PersoAnim[3];
  const collect=this.PersoAnim[0];

  let animating=true;
  collect.stop();
  idle.start();
  this.scene.onBeforeRenderObservable.add(() => {
      let keydown = false;
      //console.log(this.heroMesh.position);
      
      if (inputMap["w"]||this.up||inputMap["z"]) {
          this.heroMesh.moveWithCollisions(this.heroMesh.forward.scaleInPlace(heroSpeed));
          keydown = true;
      
      }
      if (inputMap["s"]||this.down) {
          this.heroMesh.moveWithCollisions(this.heroMesh.forward.scaleInPlace(-heroSpeedBackwards));
          keydown = true;
      }
      if (inputMap["a"]||this.left||inputMap["q"]) {
          this.heroMesh.rotate(Vector3.Up(), -this.heroRotationSpeed);
          keydown = true;
          this.rotation--;
      }
      if (inputMap["d"]||this.right) {
          this.heroMesh.rotate(Vector3.Up(), this.heroRotationSpeed);
          keydown = true;
          this.rotation++;
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
      //console.log(mesh);
  })
 
  mouton.plane.parent = meshes[1];
  mouton.plane.position.y = 2;
  mouton.plane.scaling.x=4;
  mouton.plane.scaling.y=1;
  mouton.plane.rotate(new Vector3(0,1,0),-1.5708);
  const matFood = new StandardMaterial("",this.scene);
  matFood.diffuseTexture = new Texture("./textures/timer/food.png");
  mouton.plane.material = matFood;
}

Mouton1OnClick(self : App, mouton : Mouton):void{
  if (mouton.available){
    self.cptLaine+=1;
    
    localStorage.setItem("cptLaine",JSON.stringify(self.cptLaine));
    console.log("local Storage "+localStorage.getItem("cptLaine"));

    document.getElementById("cptLaineM")!.innerHTML = self.cptLaine+"" ;
    document.getElementById("cptLaineO")!.innerHTML = self.cptLaine+"" ;
    mouton.available=false;
    const matFood = new StandardMaterial("",this.scene);
    matFood.diffuseTexture = new Texture("./textures/timer/food.png");
    mouton.plane.material = matFood;
  }

  else if(self.cptFood>=1&&!mouton.load){ // On a assez de laine pour lancer le chargement et il est pas déjà en train de charger
    self.cptFood-=1;
    mouton.load=true;
    document.getElementById("cptFood")!.innerHTML = this.cptFood+"" ;
    localStorage.setItem("cptFood",JSON.stringify(self.cptFood));
    const timer = new AdvancedTimer({timeout:10,contextObservable: self.scene.onBeforeRenderObservable});  //Timer à 0 jsp pk mais j'ai pas vu de changements en fonctions des valeurs
    timer.onTimerEndedObservable.add((evt) => self.Timer(self,mouton));
    timer.onEachCountObservable.add((evt) => self.Waiting(self,mouton));   /// CA FAIT UN PTN DE NB DE FOIS ALEATOIRE
    //timer.start(self.timersec*1000); //La durée du timer
    timer.start(5000); //La durée du timer

  }
  

}


Timer(self : App,mouton : Mouton) : void{
  //mouton.available=true;
  //button.textBlock!.text = this.available1 ;
  mouton.plane.material = self.matcollect ;
  mouton.timer=0;
  mouton.avancement = 1 ;
  mouton.available=true;
  mouton.load=false;
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
      "ground+fences.glb",
      this.scene
    );
    await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "room.glb",
      this.scene
    );
    await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "runway.glb",
      this.scene
    );
    await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "shop.glb",
      this.scene
    );
    await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "tiles.glb",
      this.scene
    );
    //apply collisions to every mesh in the model
    //.map goes through every mesh
    meshes.map(mesh => { //for each mesh apply collisions donc c'est comme un for i in list par exemple
      mesh.checkCollisions = true;
    })

  }

  

 

  CreateActions(obj: AbstractMesh): void {
    obj.actionManager = new ActionManager(this.scene);
    obj.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickTrigger

        }, () => this.ClickMamie(this)));
  }
  ClickMamie(self: App) {
    console.log("je suis dans click mamie");
    console.log(document.getElementById("modal-wrapper"));
    (document.querySelector(".modal-wrapper") as HTMLDivElement).style.display = "block";  //AFFICHE LA PAGE SHOP
    (document.querySelector(".modal-close") as HTMLDivElement).addEventListener("click", hide);  //Clique de la croix ?
    (document.querySelector(".AV1") as HTMLDivElement).addEventListener("click", hide);   //Clique du bouton ?

    function hide() {
      (document.querySelector(".modal-wrapper") as HTMLDivElement).style.display = "none";  //Enlève la page shop
  
    }
  }
  CreateChooseYourOutfit():void {
    const plane = Mesh.CreatePlane("plane",3,this.scene); //plane, le plan 2D sur lequel on va cliquer, 2=size
    plane.position.y = 2;
    plane.position.x = -40;
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
    self.engine.exitPointerlock(); 
    console.log("im supposed to be exiting the pointer lock");
    (document.querySelector(".modal-wrapper-outfit") as HTMLDivElement).style.display = "block";  //AFFICHE LA PAGE SHOP
    
    (document.querySelector(".modal-close-outfit") as HTMLDivElement).addEventListener("click", hide);  
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
      document.getElementById("./image/horizontal/initial.png")!.addEventListener("click", (evt)=>wear("initial",evt));
    
    // fonction pour changer d'outfit 
    function wear(id:string,evt:Event){
      self.id=id;
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
        var outfitDisplay=id;
        console.log(outfitDisplay);
        document.getElementById("imgoutfit")!.setAttribute('src', './image/outfit/'+outfitDisplay+'.png');
        console.log(document.getElementById("imgoutfit")!.getAttribute("src"));
        self.new_path=id+".glb";
        document.getElementById("save").addEventListener("click",SaveOutfit,{once:true})!;
      
      }
      else{
        self.Alert("You dont own that outfit for the moment :(");
      }
      evt.stopImmediatePropagation();
    }
    function SaveOutfit(){
      console.log("je rentre dans SaveOutfit");
        if (self.currentoutfit+".glb"!=self.new_path){
          self.Alert("You have changed your outfit")
          self.currentoutfit = self.id;
          localStorage.setItem("currentoutfit",JSON.stringify(self.currentoutfit));
          console.log("on va changer d'outfit");
          self.ChangePerso(self.new_path);
          hide();
          }
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
        self.engine.enterPointerlock(); 
        console.log("im supposed to be entering the pointer lock");
        }

    
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
      localStorage.setItem("alreadyRunwayOutfit",JSON.stringify(this.alreadyRunwayOutfit));
      console.log("pas worn", this.cptFashion,"already warn :",alreadyWorn);
      this.cptFashion+=1;
      localStorage.setItem("cptFashion",JSON.stringify(this.cptFashion));

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
    this.PersoAnim[2].play(true); //catWalk
    this.heroMesh.position = new Vector3(-15,1.65,-26.5);
    console.log((document.querySelector("#laine")! as HTMLDivElement).style.display=="block");
    (document.querySelector("#overlay") as HTMLImageElement).style.display = "none" ;
    const i =0;
    const timer1 = new AdvancedTimer({timeout:14,contextObservable: self.scene.onBeforeRenderObservable});  //Timer à 0 jsp pk mais j'ai pas vu de changements en fonctions des valeurs
    timer1.onTimerEndedObservable.add(() => this.Move1(i));
    timer1.start(14);

    // ---- Orientation
    if (this.rotation<0){
      for (let i=0;i>this.rotation;i--){
        this.heroMesh.rotate(Vector3.Up(), this.heroRotationSpeed);
      }
    }
    if (this.rotation>0){
      for (let i=0;i<this.rotation;i++){
        this.heroMesh.rotate(Vector3.Up(), -this.heroRotationSpeed);
      }
    }

    this.heroMesh.rotate(Vector3.Up(), -Math.PI/2);


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
      this.PersoAnim[1].play(true); // etre en idle
      self.SecondAnimation(self,FreeCam)});
    timer.start(15000);  // timer fin 1ere avancement


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
        this.PersoAnim[1].stop();
        this.PersoAnim[2].play(true); //remettre en catWalk
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
      // FIN DU RUNWAY
      (document.querySelector("#overlay") as HTMLImageElement).style.display = "block" ;
      self.AfterCutScene(self,FreeCam);
      this.heroMesh.position = new Vector3(-10,0,-31);
      this.runwayMusic.pause();
      this.background.play();
      this.PersoAnim[3].stop();
      this.PersoAnim[2].stop();
      this.PersoAnim[1].play(true);
      });
    timer.start(19000);
  }

  AfterCutScene(self: App,FreeCam : FreeCamera) {
    
    this.scene.activeCamera = this.camera;
    this.camera.attachControl();

    this.heroMesh.rotate(Vector3.Up(), -Math.PI/2);
    this.rotation = 0;
    
    // HAJAR RAJOUE CA
    if (self.cptFashion == 12 ){
      (document.querySelector(".modal-wrapper-end") as HTMLDivElement).style.display="block";
    }

  }

  

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
        new ExecuteCodeAction({trigger: ActionManager.OnPickTrigger},() => this.Shop(this)));  
        
    })
    //meshes[0].rotate(Vector3.Up(),Math.PI/2);
    meshes[0].position = new Vector3(-40,0,25);
    meshes[0].scaling = new Vector3(2,2,2);

    //this.engine.hideLoadingUI(); //la page a fini de charger
  }
  Shop(self : App){
    self.engine.exitPointerlock();
    console.log("je suis dans le shop");
    (document.querySelector(".modal-wrapper") as HTMLDivElement).style.display = "block";  //AFFICHE LA PAGE SHOP
        (document.querySelector(".modal-close") as HTMLDivElement).addEventListener("click", hide);  //Clique de la croix ?


        document.getElementById("manche")!.addEventListener("click",(evt) => buy("manche",self,evt));  //buy cloth1
        (document.querySelector("#fleur_bleu") as HTMLButtonElement)!.addEventListener("click",(evt) => buy("fleur_bleu",self,evt));
        (document.querySelector("#fleur_blanc") as HTMLButtonElement)!.addEventListener("click",(evt) => buy("fleur_blanc",self,evt));
        (document.querySelector("#long_blanc") as HTMLButtonElement)!.addEventListener("click",(evt) => buy("long_blanc",self,evt));
        (document.querySelector("#long_marron") as HTMLButtonElement)!.addEventListener("click",(evt) => buy("long_marron",self,evt));
        (document.querySelector("#bob") as HTMLButtonElement)!.addEventListener("click",(evt) => buy("bob", self,evt));

        document.getElementsByClassName("recycle")[0].addEventListener("click",(evt)=>recycle("manche",self,evt));
        document.getElementsByClassName("recycle")[1].addEventListener("click",(evt)=>recycle("fleur_blanc",self,evt));
        document.getElementsByClassName("recycle")[2].addEventListener("click",(evt)=>recycle("fleur_bleu",self,evt));
        document.getElementsByClassName("recycle")[3].addEventListener("click",(evt)=>recycle("long_blanc",self,evt));
        document.getElementsByClassName("recycle")[4].addEventListener("click",(evt)=>recycle("long_marron",self,evt));
        document.getElementsByClassName("recycle")[5].addEventListener("click",(evt)=>recycle("bob",self,evt));
      
        
      function hide() {
          (document.querySelector(".modal-wrapper") as HTMLDivElement).style.display = "none";  //Enlève la page shop
          self.engine.enterPointerlock();
          }

      // RECYCLE
      function recycle(name:string, self: App,evt:Event){
        if(isOwned(name) && (self.currentoutfit.indexOf(name)==-1)){
          if(name=="bob"){
              self.cptLaine +=1;
              localStorage.setItem("cptLaine",JSON.stringify(self.cptLaine));
              self.text.text = "laine : "+self.cptLaine;
          }
          else{
              self.cptLaine +=3;
              localStorage.setItem("cptLaine",JSON.stringify(self.cptLaine));
              self.text.text = "laine : "+self.cptLaine;
          }
          self.wardrobe = self.wardrobe.filter((cloth)=>cloth.name!=name);
          localStorage.setItem("wardrobe",JSON.stringify(self.wardrobe));
          self.Alert("you just recycled "+name);
          document.getElementsByClassName(name)[0].classList.add("notOwned");
          if(isOwned("bob") && name!="bob"){
            document.getElementsByClassName(name+"_bob")[0].classList.add("notOwned");
          }
        }
        else{
            self.Alert("You cant recycle this item");
        }
        evt.stopImmediatePropagation();
      }
      


      
      //fonction pour obtenir un vetement

      function buy(name: string, self: App,evt:Event){
        if(isOwned(name)==true){
          self.Alert("You already own "+name);
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
            localStorage.setItem("cptLaine",JSON.stringify(self.cptLaine));
            document.getElementById("cptLaineM")!.innerHTML = self.cptLaine+"" ;
            document.getElementById("cptLaineO")!.innerHTML = self.cptLaine+"" ;
            cloth.owned = true;
            self.wardrobe.push(cloth);
            localStorage.setItem("wardrobe",JSON.stringify(self.wardrobe));

            self.Alert("You just bought "+cloth.name);
            }
           
          else{
             self.Alert("You dont have enought wool, soory :(");
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
      });
      document.querySelector(".modal-close-memo")!.addEventListener("click",() => {
        this.engine.enterPointerlock();
        (document.querySelector(".modal-wrapper-memo") as HTMLDivElement).style.display = "none";
        (document.querySelector("#memo-right") as HTMLDivElement).style.display = "none";
        (document.querySelector("#triesMemo") as HTMLDivElement).style.display = "none";
        (document.querySelector("#memo-start") as HTMLDivElement).style.display = "block";
        (document.querySelector("#reset") as HTMLDivElement).style.display = "none";
      });
      document.querySelector(".buttonMemo")!.addEventListener("click",() => {
        // ----------- On affiche la page du jeu --------------
        (document.querySelector("#memo-right") as HTMLDivElement).style.display = "grid";
        (document.querySelector("#triesMemo") as HTMLDivElement).style.display = "block";
        (document.querySelector("#memo-start") as HTMLDivElement).style.display = "none";
        (document.querySelector("#reset") as HTMLDivElement).style.display = "block";
        // ---------- On remet tout à 0 (au cas où on y avait joué et on réouvre le jeu) ---------
        this.memoTries=10;
        this.memo1=-1;
        this.memoWait=false;
        this.memoWin=0;
        this.memoryPlaying=false;
        document.getElementById("triesMemo")!.innerHTML = "You have 10 tries left" ;
        (document.querySelector("#memo0")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo1")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo2")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo3")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo4")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo5")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo6")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo7")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo8")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo9")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo10")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo11")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
      });
  
      document.querySelector("#resetbtn")!.addEventListener("click",() => {
        // ---------- On remet tout à 0  ---------
        this.memoTries=10;
        this.memo1=-1;
        this.memoWait=false;
        this.memoWin=0;
        this.memoryPlaying=false;
        document.getElementById("triesMemo")!.innerHTML = "You have 10 tries left" ;
        (document.querySelector("#memo0")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo1")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo2")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo3")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo4")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo5")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo6")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo7")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo8")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo9")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo10")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
        (document.querySelector("#memo11")! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
      });
  
      document.querySelector("#memo0")!.addEventListener("click",() => this.Memory(0));
      document.querySelector("#memo1")!.addEventListener("click",() => this.Memory(1));
      document.querySelector("#memo2")!.addEventListener("click",() => this.Memory(2));
      document.querySelector("#memo3")!.addEventListener("click",() => this.Memory(3));
      document.querySelector("#memo4")!.addEventListener("click",() => this.Memory(4));
      document.querySelector("#memo5")!.addEventListener("click",() => this.Memory(5));
      document.querySelector("#memo6")!.addEventListener("click",() => this.Memory(6));
      document.querySelector("#memo7")!.addEventListener("click",() => this.Memory(7));
      document.querySelector("#memo8")!.addEventListener("click",() => this.Memory(8));
      document.querySelector("#memo9")!.addEventListener("click",() => this.Memory(9));
      document.querySelector("#memo10")!.addEventListener("click",() => this.Memory(10));
      document.querySelector("#memo11")!.addEventListener("click",() => this.Memory(11));
      //Affichier la page de départ avec les regles/explication
      
      //console.log((document.getElementById("memo1") as HTMLImageElement).src,"he oh");
      document.querySelector(".modal-close-restart")!.addEventListener("click",() => {
        (document.querySelector(".modal-wrapper-restart") as HTMLDivElement).style.display = "none";
      });
      document.querySelector("#buttonCancel")!.addEventListener("click",() => {
        (document.querySelector(".modal-wrapper-restart") as HTMLDivElement).style.display = "none";
      });
      document.querySelector("#restart")!.addEventListener("click",() => {
        (document.querySelector(".modal-wrapper-restart") as HTMLDivElement).style.display = "block";
      });
      document.querySelector("#restartbtn")!.addEventListener("click",() => {
        // HAJAR
        localStorage.clear();
        location.reload();
      });

      document.querySelector("#flecheU")!.addEventListener("click",() => {
        this.up=!this.up;
        console.log("up");
      });
      document.querySelector("#flecheL")!.addEventListener("click",() => {
        this.left=!this.left;
        console.log("left");
      });
      document.querySelector("#flecheD")!.addEventListener("click",() => {
        this.down=!this.down;
        console.log("down",this.down);
      });
      document.querySelector("#flecheR")!.addEventListener("click",() => {
        this.right=!this.right;
        console.log("right",this.right);
      });

       // Pour page fin :
      document.querySelector(".modal-close-end")!.addEventListener("click",() => {
        (document.querySelector(".modal-wrapper-end") as HTMLDivElement).style.display = "none";
      });
      document.querySelector("#buttonCancelEnd")!.addEventListener("click",() => {
        (document.querySelector(".modal-wrapper-end") as HTMLDivElement).style.display = "none";
      });
      document.querySelector("#restartbtnEnd")!.addEventListener("click",() => {
        localStorage.clear();
        location.reload();
      });
    
    }

    CreateMemoryPlane():void {
      const plane = Mesh.CreatePlane("plane",3,this.scene); //plane, le plan 2D sur lequel on va cliquer, 2=size
      plane.position.y = 2;
      plane.position.x = 20;
      plane.position.z = 28;
      plane.rotate(new Vector3(0,1,0),-1.5708);
  
      const advancedTexture2 = AdvancedDynamicTexture.CreateForMesh(plane);
  
      const button1 = Button.CreateSimpleButton("butMemory", "Start a memory game!");
      button1.width = 1;
      button1.height = 0.4;
      button1.color = "black";
      button1.fontSize = 50;
      button1.background = "pink";
      button1.onPointerUpObservable.add(() => {
        this.engine.exitPointerlock();
        (document.querySelector(".modal-wrapper-memo") as HTMLDivElement)!.style.display ="block";
        this.memoryPlaying=false;
      });
      advancedTexture2.addControl(button1);
      
    }
  
    Memory(position : int){
      //console.log((document.getElementById(this.memoCartes[0]) as HTMLImageElement).src);
      if ((document.getElementById("memo"+position)! as HTMLImageElement).src == (document.getElementById("cartes") as HTMLImageElement).src){
        if (!this.memoryPlaying){ //Le debut du jeu, on met random les images
          const shuffle = (array: any[]) => {
          array.sort(() => Math.random() - 0.5);
          }
          shuffle(this.memoCartes);
          this.memoryPlaying=true;
        }
        if(!this.memoWait&&this.memoWin<this.memoCartes.length/2&&this.memoTries>0){
          if (this.memo1==-1){ //On est en train de choisir la 1ere carte
            this.memo1=position;
            (document.getElementById("memo"+position)! as HTMLImageElement).src = (document.getElementById(this.memoCartes[position]) as HTMLImageElement).src;
          }
          else if (position!=this.memo1){ //On est en train de choisir la 2ere carte qui n'est pas la meme que la 1ere
            //this.memo2=position;
            (document.getElementById("memo"+position)! as HTMLImageElement).src = (document.getElementById(this.memoCartes[position]) as HTMLImageElement).src;
            if (this.memoCartes[position]!=this.memoCartes[this.memo1]){ //C'est pas les mm et il nous reste des tries
              this.memoTries--; //tentative qui diminue
              this.memoWait=true;  //pour empecher de cliquer autre part pendant que nos 2 cartes sont retournées
              document.getElementById("triesMemo")!.innerHTML = "You have "+this.memoTries+" tries left" ;
              const timer = new AdvancedTimer({timeout:8 ,contextObservable: this.scene.onBeforeRenderObservable}); 
              timer.onTimerEndedObservable.add(() => {
                (document.getElementById("memo"+position)! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
                (document.getElementById("memo"+this.memo1)! as HTMLImageElement).src = (document.getElementById("cartes") as HTMLImageElement).src;
                this.memo1=-1;
                this.memoWait=false;
                });
              timer.start(1400); // Le temps de voir les 2 cartes et après elles sont re retournées
              if(this.memoTries==0){
                document.getElementById("triesMemo")!.innerHTML = "You have lost ;( click on reset to start a new game!";
                this.memoryPlaying=false;
              }
            }
            else if (this.memoTries>0){  //Cartes pareil mais il reste des tries
              this.memo1=-1;
              this.memoWin++;
              
            }
          }
        }
        if(this.memoWin>=this.memoCartes.length/2){
          document.getElementById("triesMemo")!.innerHTML = "Congratulation you have won! You own 3 more carrots to feed your sheep with";
          this.memoryPlaying=false;
          this.cptFood+=3;
          localStorage.setItem("cptFood",JSON.stringify(this.cptFood));
          document.getElementById("cptFood")!.innerHTML = this.cptFood+"" ;
          this.Alert("You have "+this.cptFood+" carrots now, go feed your sheep!");
        }
      }
    }
  
    Alert(message : string){
      (document.getElementById("pop-up")! as HTMLDivElement).style.display = "block";
      document.getElementById("pop-up-text")!.innerHTML = message;
      const timer = new AdvancedTimer({timeout:8 ,contextObservable: this.scene.onBeforeRenderObservable}); 
      timer.onTimerEndedObservable.add(() => {
        (document.getElementById("pop-up")! as HTMLDivElement).style.display = "none";
        });
        timer.start(5000); // Le temps du mesage qui s'affiche
    }
  
    // PENDU
    async CreatePendu(): Promise<void>{
      const plane = Mesh.CreatePlane("plane",3,this.scene); //plane, le plan 2D sur lequel on va cliquer, 2=size
      plane.position.y = 2;
      plane.position.x = -6;
      plane.position.z = 0;
      plane.rotate(new Vector3(0,0,0),-1.5708);
  
      const advancedTexture2 = AdvancedDynamicTexture.CreateForMesh(plane);
  
      const button1 = Button.CreateSimpleButton("but1", "Let's play !");
      button1.width = 1;
      button1.height = 0.4;
      button1.color = "black";
      button1.fontSize = 50;
      button1.background = "pink";
      button1.onPointerUpObservable.add(() => this.ClickPendu(this));
      advancedTexture2.addControl(button1);
    }
    
  
  
    ClickPendu(self : App):void{
      self.engine.exitPointerlock();
      (document.querySelector("#modal-wrapper-pendu") as HTMLDivElement).style.display="block";  
      (document.querySelector("#modal-close-pendu") as HTMLDivElement).addEventListener("click", hide);
      refresh();
  
      function hide() {
        self.engine.enterPointerlock();
        (document.querySelector("#modal-wrapper-pendu") as HTMLDivElement).style.display = "none";  
      }
  
  
  
  document.getElementById("pendu-reset")!.addEventListener("click", refresh);
  
  document.getElementById(String.fromCharCode(65))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(65),evt));
  document.getElementById(String.fromCharCode(66))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(66),evt));
  document.getElementById(String.fromCharCode(67))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(67),evt));
  document.getElementById(String.fromCharCode(68))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(68),evt));
  document.getElementById(String.fromCharCode(69))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(69),evt));
  document.getElementById(String.fromCharCode(70))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(70),evt));
  document.getElementById(String.fromCharCode(71))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(71),evt));
  document.getElementById(String.fromCharCode(72))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(72),evt));
  document.getElementById(String.fromCharCode(73))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(73),evt));
  document.getElementById(String.fromCharCode(74))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(74),evt));
  document.getElementById(String.fromCharCode(75))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(75),evt));
  document.getElementById(String.fromCharCode(76))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(76),evt));
  document.getElementById(String.fromCharCode(77))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(77),evt));
  document.getElementById(String.fromCharCode(78))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(78),evt));
  document.getElementById(String.fromCharCode(79))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(79),evt));
  document.getElementById(String.fromCharCode(80))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(80),evt));
  document.getElementById(String.fromCharCode(81))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(81),evt));
  document.getElementById(String.fromCharCode(82))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(82),evt));
  document.getElementById(String.fromCharCode(83))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(83),evt));
  document.getElementById(String.fromCharCode(84))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(84),evt));
  document.getElementById(String.fromCharCode(85))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(85),evt));
  document.getElementById(String.fromCharCode(86))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(86),evt));
  document.getElementById(String.fromCharCode(87))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(87),evt));
  document.getElementById(String.fromCharCode(88))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(88),evt));
  document.getElementById(String.fromCharCode(89))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(89),evt));
  document.getElementById(String.fromCharCode(90))!.addEventListener("click", (evt)=>testLettre(String.fromCharCode(90),evt));
  
  
  
  
  
  //fonction pour initialiser le jeu
  function newGame(){
      console.log("in new gamme");
      const chiffre = Math.floor(Math.random()*self.dico.length);
      self.motadecouvrir = self.dico[chiffre];
      console.log(self.motadecouvrir);
      for(let i=0; i<self.motadecouvrir.length ; i++){
          self.currentmot.push("_");
          self.currentmotjoli.push((" _"));
      }
      console.log(self.currentmot.join(""));
      document.getElementById("motad")!.textContent = self.currentmotjoli.join("");
      document.getElementById("pendu-text")!.textContent = "Find the word before the sheep becomes nude";
    }
  
    //tester les entrées clavier
    function testLettreClavier(l:string, evt:Event){
      if(!self.enjeu){
        return 
      }
        let lettre = false;
        for(let i=0; i<26; i++){
            if(String.fromCharCode(97+i)==l){
                lettre = true;
            }
        }
        if(lettre){
            testLettre(l,evt);
        }
        //si le caractère n'est pas une lettre
        else{
            self.Alert("Please enter a letter");
            evt.stopImmediatePropagation();
        }
    }
  
  
  
    //fonction qui test les lettres
    function testLettre(lettre:string,evt:Event){  
        if(!self.enjeu){
          return 
        }  
        const value = lettre.toUpperCase();
        //si la lettre n'est pas dans le mot 
        if(self.motadecouvrir.includes(value)==false){
            self.nberreurs+=1;
            console.log(self.nberreurs);
            if(self.nberreurs>=self.limiteerreurs){
                document.getElementById("pendu-text")!.textContent = "You lost, try again "; 
                document.getElementById(value)!.style.background= "rgb(100, 34, 66)";
                self.enjeu=false; 
            }
            else{
                document.getElementById(value)!.style.background = "rgb(100, 34, 66)";   
                document.getElementById("pendu-text")!.textContent = "You have "+(10-self.nberreurs)+" tries left";
            }
  
        }
        //si la lettre est dans le mot 
        else{
            let nbtirets = 0;
            document.getElementById(value)!.style.background="rgb(255, 131, 173)";
            for(let i=0; i<self.motadecouvrir.length; i++){
                if(value==self.motadecouvrir[i]){
                    self.currentmot[i] = value;
                    self.currentmotjoli[i] = value;
                }
                if(self.currentmot[i]=="_"){
                    nbtirets+=1;
                }
            }
            document.getElementById("motad")!.innerText = self.currentmotjoli.join(""); 
            if(nbtirets==0){
              document.getElementById("pendu-text")!.textContent = "You just won 3 carrots to feed the sheeps ";
              self.enjeu = false;
              self.cptFood+=3;
              localStorage.setItem("cptFood",JSON.stringify(self.cptFood));
              document.getElementById("cptFood")!.innerHTML = self.cptFood+"" ;
            }
        }
        
        updateImage(); 
        evt.stopImmediatePropagation();
    }
  
  
    //fonction pour update l'image 
    function updateImage(){
        document.getElementById("img")!.setAttribute('src','./pendu/mouton'+self.nberreurs+'.png');
    } 
  
  
  
    function refresh(){
            //reinitialiser les variables du jeu:
            self.nberreurs = 1;
            self.currentmot = [];
            self.currentmotjoli = [];
            self.motadecouvrir = "";
            self.enjeu = true;
  
            //reinitialiser les lettres:
            for(let i=0; i<26; i++){
              document.getElementById((String.fromCharCode(65+i).toUpperCase()))!.style.background = "rgb(197, 34, 66)";
            }
            //reinitialiser le dessin
            updateImage();
            newGame();
  
        
    }
  
    
    window.addEventListener('keydown', function (e) {
        testLettreClavier(e.key, e)
      }, false);
  
      
    }
}

class Mouton{
  public timer : int;
  public avancement : int;
  public available : boolean;
  public path : string;
  public plane : Mesh;


  public load : boolean;

  constructor(path : string){
    this.timer=0;
    this.avancement=1;
    this.available=false;
    this.path=path;
    const f = new Vector4(0,0, 1 , 1);
    this.plane = MeshBuilder.CreatePlane("plane", {frontUVs: f, backUVs: f, sideOrientation: Mesh.DOUBLESIDE});
    //this.matcollect = new StandardMaterial("",this.scene);
    //this.matcollect.diffuseTexture = new Texture("./textures/timer/collect.png");


    this.load = false;
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
