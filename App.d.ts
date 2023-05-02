import { Scene, Engine, AbstractMesh, Mesh, int, StandardMaterial, ArcRotateCamera } from "babylonjs";
import "babylonjs-loaders";
import "babylonjs-gui";
import { SelectionPanel, TextBlock } from "babylonjs-gui";
export declare class App {
    private canvas;
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
    alreadyRunwayOutfit: string[];
    constructor(canvas: HTMLCanvasElement);
    run(): void;
    CreateScene(): Scene;
    CreateSky(): void;
    CreateCharacter(): Promise<void>;
    CreateMouton(mouton: Mouton): Promise<void>;
    Mouton1OnClick(self: App, mouton: Mouton): void;
    CreateCptLaine(): void;
    Timer(self: App, mouton: Mouton): void;
    Waiting(self: App, mouton: Mouton): void;
    CreateEnvironment(): Promise<void>;
    CreateActions(obj: AbstractMesh): void;
    ClickMamie(self: App): void;
    CreateChooseYourOutfit(): void;
    ClickOutfit(self: App): void;
    CreateCutScene(self: App): void;
    SecondAnimation(self: App): void;
    AfterCutScene(self: App): void;
    CreatePersonnage(): Promise<void>;
    CreateStartRunway(): void;
    CreateMamie(): Promise<void>;
    Shop(self: App): void;
}
declare class Mouton {
    timer: int;
    avancement: int;
    available: boolean;
    path: string;
    plane: Mesh;
    constructor(path: string);
}
declare class Cloth {
    name: string;
    price: int;
    worn: boolean;
    owned: boolean;
    constructor(n: string, p: int);
}
export {};
