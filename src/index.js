import Movements from "./movements.js";
import blockchain from "./Web3.js";
import abi from "./abi/abi.json" assert { type: "json" };
import * as THREE from "three";
import { OrbitControls, MapControls } from "../controls/OrbitControls.js";
import { smart_contract_address } from "./contractparams.js";
import { VRButton } from "./VRButton.js";
import { GLTFLoader } from "./GLTFLoader.js";

// Declaration  of a new scene with Three.js
const container = document.querySelector(".scene");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x404040);

// Camera and renderer configuration
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;

// Orbit controls
let controls = new OrbitControls(camera, renderer.domElement);

// Setting the scene lights
const ambient_light = new THREE.AmbientLight(0xffffff, 0.8);
const direction_light = new THREE.DirectionalLight(0xebd7d3, 0.3);
direction_light.position.set(0, 0, 0);
direction_light.target.position.set(0, 0, 0);
ambient_light.add(direction_light);
scene.add(ambient_light);

//point light
const Point_Light = new THREE.PointLight(0xdb5424, 1.5);
Point_Light.position.set(30, 100, 30);
scene.add(Point_Light);

//Rect Light
const width = 2.0;
const height = 20.0;
const RectLight = new THREE.RectAreaLight(0xffffff, 1.0, width, height);
RectLight.position.set(100, 10, 0);
RectLight.lookAt(0, 0, 0);
scene.add(RectLight);

//Load 3D models
const loader = new GLTFLoader();
//flying Island
loader.load("../models/flying/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  let flying = gltf.scene.children[0];
  flying.position.set(500, -80, -50);
  flying.scale.set(0.1, 0.1, 0.1);
});

//magic ring -yellow
loader.load("../models/magic_ring/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  let magic = gltf.scene.children[0];
  magic.position.set(-38, 80, 120);
  magic.scale.set(7, 7, 7);
  magic.rotation.set(0, 0, Math.PI);
});

//magic crystals
loader.load("../models/magic_crystals/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  let magic = gltf.scene.children[0];
  magic.position.set(10, 25, -290);
  magic.scale.set(0.8, 0.8, 0.8);
  magic.rotation.set(Math.PI / -2, 0, 0);
});

//sky
loader.load("../models/sky/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  let sky = gltf.scene.children[0];
  sky.position.set(0, 0, -3500);
  sky.scale.set(3, 3, 3);
  sky.rotation.set(Math.PI / 2, 0, 0);
});

//dragon
loader.load("../models/dragon/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  let dragon = gltf.scene.children[0];
  dragon.position.set(-400, -60, -100);
  dragon.scale.set(15, 15, 15);
  dragon.rotation.set(Math.PI / -2, 0, 0);
});

window.addEventListener("resize", onWindowResize);

camera.position.set(250, 10, 0);

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  requestAnimationFrame(animate);
  controls.update();
  // Movement to the left
  if (Movements.isPressed(37)) {
    camera.position.x -= 0.5;
  }
  // Upward movement
  if (Movements.isPressed(38)) {
    camera.position.x += 0.5;
    camera.position.y += 0.5;
  }
  // Movement to the right
  if (Movements.isPressed(39)) {
    camera.position.x += 0.5;
  }
  // Downward movement
  if (Movements.isPressed(40)) {
    camera.position.x -= 0.5;
    camera.position.y -= 0.5;
  }

  // camera.lookAt(space.position);
  renderer.render(scene, camera);
}
animate();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// New NFT
const buttonMint = document.getElementById("mint");
buttonMint.addEventListener("click", mintNFT);

function mintNFT() {
  // Parameters to create a NFT in the Metaverse
  let nft_name = document.getElementById("nft_name").value;
  let nft_width = document.getElementById("nft_width").value;
  let nft_height = document.getElementById("nft_height").value;
  let nft_depth = document.getElementById("nft_depth").value;
  let nft_x = document.getElementById("nft_x").value;
  let nft_y = document.getElementById("nft_y").value;
  let nft_z = document.getElementById("nft_z").value;

  // If Metamask is not available
  if (typeof window.ethereum == "undefined") {
    rej("You should install Metamask to use it!");
  }

  // Web3 Instance
  let web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(abi, smart_contract_address);

  web3.eth.getAccounts().then((accounts) => {
    contract.methods
      .cost()
      .call()
      .then((cost_nft) => {
        contract.methods
          .mint(nft_name, nft_width, nft_height, nft_depth, nft_x, nft_y, nft_z)
          .send({ from: accounts[0], value: parseInt(cost_nft) })
          .then((data) => {
            alert("NFT available in the Metaverse!");
          });
      });
  });
}

// Profit extraction
const buttonProfit = document.getElementById("profit");
buttonProfit.addEventListener("click", profitNFT);

function profitNFT() {
  // If Metamask is not available
  if (typeof window.ethereum == "undefined") {
    rej("You should install Metamask to use it!");
  }

  // Web3 Instance
  let web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(abi, smart_contract_address);

  web3.eth.getAccounts().then((accounts) => {
    contract.methods
      .withdraw()
      .send({ from: accounts[0] })
      .then((data) => {
        alert("Profit extraction!");
      });
  });
}

// Web3 connection to the data generated in the blockchain to be
// represented in the Metaverse
const NFT = blockchain.then((result) => {
  // For each building paid for in the Smart Contract,
  // a graphical representation is made in the Metaverse
  result.building.forEach((building, index) => {
    if (index <= result.supply) {
      // Representation of NFT Tokens as boxes
      const boxGeometry = new THREE.OctahedronGeometry(
        building.w
        // building.h,
        // building.d
      );
      const boxMaterial = new THREE.MeshPhongMaterial({
        color: 0xe3d534,
        specular: 0x050505,
      });
      const nft = new THREE.Mesh(boxGeometry, boxMaterial);
      nft.position.set(building.x, building.y, building.z);
      scene.add(nft);
    }
  });
});
