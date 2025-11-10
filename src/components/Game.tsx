/* eslint-disable */
import kaplay from "kaplay";
import { useEffect, useRef, useState, useContext } from "react";
// import { MdKeyboardCommandKey } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserContext from "../context";
import type { User } from "../types";
// import { WarehouseIcon } from "lucide-react";

// Define the shape of the data we expect from the server for clarity
interface ServerCharacter {
  id: string;
  ownerId: string;
  name: string;
  pos: { x: number; y: number };
  vel: { x: number; y: number };
  health: number;
  animation: string;
  maxHealth: number;
  isBackwards: boolean;
  type: string;
  // We might add more from the server later, like 'isAttacking'
}

interface GameStateUpdate {
    type: "GAME_STATE_UPDATE";
    characters: ServerCharacter[];
    coconuts: number;
}

interface GameStart {
  type: "GAME_START";
  playerId: string;
  // any other initial data...
}

interface NewQuestion {
  type: "NEW_QUESTION";
  question: any;
  wasRight: boolean;
  answer: string;
}

interface WinCondition {
  type: "WIN_CONDITION";
  hasWon: boolean;





}

interface GameProps {
  websocketRef: any
  setUpdateQuestion: any
  setHasWon: any

}


// Props are no longer needed as the server will provide all game data
export default function Game(props: GameProps) {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const [hasStarted, setHasStarted] = useState(false);
  const kaplayInitialized = useRef(false);
  const kaplayInstance = useRef<any>(null);
  // Refs to hold persistent objects without causing re-renders
  const serverObjects = useRef(new Map<string, any>());
  const ws = useRef<WebSocket | null>(null);
  const localPlayerId = useRef<string | null>(null);
  const user = useContext(UserContext) as User | null;
  const latestGameState = useRef<GameStateUpdate | null>(null);
  useEffect(() => {
    if (!user) {
      nav("/login");
    }
  }, [user, nav]);

    // const stateQueue = useRef<GameStateUpdate[]>([]);

  useEffect(() => {
    // --- 3. WEBSOCKET CONNECTION & EVENT HANDLING ---
    // if (ws.current) {
    //   return; // Already connected
    // }
    try {
      const endpoint = (window.location.href.includes("localhost")) ?  "wss://localhost:443" : "wss://api.clashofquestions.com";
      console.log("we just tried connecting to the websocket");
      ws.current = new WebSocket(endpoint); // Use your actual server URL
      props.websocketRef.current = ws.current;
      ws.current.onopen = async () => {
        // await new Promise(r => setTimeout(r, 250));
        // sometimes the event is buggy and this opens too early
        console.log("✅ WebSocket connection established.");
        const gameId = searchParams.get("gameId");
        if (gameId) {
          ws.current?.send(gameId);
        } else {
          console.error("No gameId found in URL!");
        }
      };

      ws.current.onmessage = (event) => {
        const message: GameStateUpdate | GameStart | NewQuestion | WinCondition = JSON.parse(event.data);

        if (message.type === "GAME_START") {
          setHasStarted(true);
          localPlayerId.current = message.playerId;
          console.log(
            `🎉 Game started! This client is Player ID: ${localPlayerId.current}`
          );
        } else if (message.type === "GAME_STATE_UPDATE") {
          // console.log("we just received a new message", message)
          latestGameState.current = message;
          // console.log("we just received a gameState update from the server");
          // stateQueue.current.push(message);

          // synchronizeGameState(message);

          // Update UI elements like coconut count
        } else if (message.type === "NEW_QUESTION") {
          console.log("we just received a new message", message)
          props.setUpdateQuestion({
            question: message.question,
            wasRight: message.wasRight,
            answer: message.answer
          })


        } else if (message.type === "WIN_CONDITION") {
          console.log('this is the type of message ts has',message);

          console.log("the hasWOn value type is:", typeof message.hasWon)
          if (typeof message.hasWon === "boolean") {
            console.log("THIS IS THE WIN CONDITION: ", message.hasWon)
            props.setHasWon(message.hasWon);
          } else {
            console.log("this is thw ")
          }


        }

      };

        ws.current.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket connection closed.");
        };


        } catch(e) {
          console.log("we had an error", e)
        }
     

        // --- 4. SCENE & UI SETUP ---
      

    }, []); // Empty dependency array ensures this runs only once


    

    useEffect(() => {
        console.log("this 2nd useEffect was called", hasStarted)
        if (!hasStarted || kaplayInitialized.current) {
          return;
        }

       
   

      

      
      
        const gameStats = {
        leftTower: 2000,
        rightTower: 2000,
        middleTower: 2500,
        coconuts: 10,
      };
    
        kaplayInitialized.current = true;
        
        // --- 1. KAPLAY ENGINE & ASSET SETUP ---
        const tileWidth = 32;
        const heightOfUI = 120;
        const totalWidth = window.innerWidth / 2;
        const totalHeight = window.innerHeight;
        const k = kaplayInstance.current===null ? kaplay({
            width: totalWidth,
            height: totalHeight,
        }) : kaplayInstance.current;


        if (kaplayInstance.current ===null) {
          kaplayInstance.current = k;
        }
    const sourceTileWidth = 32;
    //  const maxCoconuts = 10;

    // These are some universal constants
  

    const totalColumns = 288 / sourceTileWidth; // 36
    const totalRows = 576 / sourceTileWidth; // 18
        
        k.loadSprite("all-assets", "spritesForClash.png", {
      sliceX: totalColumns,
      sliceY: totalRows,
    });

    k.loadSprite("shooterMonkeyBackAnimationShooting", "shooterMonkeyShootingAnimationBack.png", {
      sliceX: 3,
      anims: {
        "shoot_back": { from: 0, to: 2, speed: 3, loop: false },
      }
    })

    k.loadSprite("shooterMonkeyFrontAnimationShooting","shooterMonkeyShootingAnimationFront.png", {
      sliceX: 4,
      anims: {
        "shoot_front": {from: 0, to: 3, speed: 10, loop: true}
      }
    })

    k.loadSprite("monkeyFrontAnimationShooting", "monkeyAttackingFront.png", {
      sliceX: 3,
      anims: {
        "shoot_front": {from:0, to: 2, speed: 10, loop: true}
      }
    })

    k.loadSprite("monkeyBackAnimationShooting", "monkeyAttackingBack.png", {
      sliceX: 3,
      anims: {
        "shoot_back": {from:0, to: 2, speed: 10, loop: true}
      }
    })





    k.loadSprite("monkeyBackWalking", "monkeyBackWalking.png", {
      sliceX: 3,
      anims: {
        "walk_back": {from: 0, to: 2, speed: 10, loop: true}
      }
    })

    k.loadSprite("monkeyFrontWalking", "monkeyFrontWalking.png", {
      sliceX: 3,
      anims: {
        "walk_front": {from: 0, to: 2, speed: 10, loop: true}
      }
      
    })

    k.loadSprite("shooterMonkeyBackWalking", "shooterMonkeyBackWalking.png", {
      sliceX: 3,
      anims: {
        "walk_back": {from: 0, to: 2, speed: 10, loop: true}
      }
    })

    k.loadSprite("shooterMonkeyFrontWalking", "shooterMonkeyWalkingFront.png", {
      sliceX: 2,
      anims: {
        "walk_front": {from: 0, to: 1, speed: 10, loop: true}
      }
    })


    k.loadSprite("towerShooting", "towerShooting.png", {
      sliceX: 5, 
      anims: {
        "shoot": {
          from: 0,
          to: 4,
          speed: 10,
          loop: false
        }
      }
    })


    k.loadSprite("giantFrontAnimationShooting", "giantFrontAttack.png", {
      sliceX: 3,
      anims: {
        "shoot_front": {
          from: 0,
          to: 2,
          speed: 10,
        }
      }
    })


    k.loadSprite("giantFrontAnimationShooting", "giantFrontAttack.png", {
      sliceX: 3,
      anims: {
        "shoot_front": {
          from: 0,
          to: 2,
          speed: 10,
        }
      }
    })
    

    k.loadSprite("giantBackAnimationShooting", "giantBackAttack.png", {
      sliceX: 3,
      anims: {
        "shoot_back": {
          from: 0,
          to: 2,
          speed: 10,
        }
      }
    })
    

    k.loadSprite("giantFrontWalking", "giantFrontWalking.png", {
      sliceX: 3,
      anims: {
        "walk_front": {from: 0, to: 2, speed: 10, loop: true}
      }
    })


    k.loadSprite("giantBackWalking", "giantBackWalking.png", {
      sliceX: 3,
      anims: {
        "walk_back": {from: 0, to: 2, speed: 10, loop: true}
      }
    })



   
     
      


        const listOfAllSprites: { [key: string]: any } = {
      fireball: null,
      giantBack: null,
      giantFront: null,
      shooterMonkeyBack: null,
      shooterMonkeyFront: null,
      bullet: null,
      coconut: null,
      grassOne: null,
      grassTwo: null,
      monkeyFront: null,
      monkeyBack: null,
      tower: null,
    };
  



      

    // const allSpritesAvailable = Object.keys(listOfAllSprites);

    // Manually assign each sprite to its correct frame index
    // New totalColumns is 18
    listOfAllSprites.fireball = k.sprite("all-assets", { frame: 0 });
    listOfAllSprites.giantBack = k.sprite("all-assets", { frame: 1 });
    listOfAllSprites.giantFront = k.sprite("all-assets", { frame: 2 });
    listOfAllSprites.shooterMonkeyBack = k.sprite("all-assets", { frame: 3 });
    listOfAllSprites.shooterMonkeyFront = k.sprite("all-assets", { frame: 4 });
    listOfAllSprites.bullet = k.sprite("all-assets", { frame: 5 });
    listOfAllSprites.coconut = k.sprite("all-assets", { frame: 6 });
    listOfAllSprites.grassOne = k.sprite("all-assets", { frame: 7 });
    listOfAllSprites.grassTwo = k.sprite("all-assets", { frame: 8 });

    // No, it just loops every 9 frames.
    listOfAllSprites.monkeyFront = k.sprite("all-assets", { frame: 9 });
    listOfAllSprites.monkeyBack = k.sprite("all-assets", { frame: 10 });
    listOfAllSprites.tower = k.sprite("all-assets", { frame: 11 });

    // Apply the universal width and height to all created sprites
    for (const spriteName in listOfAllSprites) {
      listOfAllSprites[spriteName].width = tileWidth;
      listOfAllSprites[spriteName].height = tileWidth;
    }


     function generateDynamicMapLayout() {
      // Calculate how many tiles fit on the screen
      const mapCols = Math.ceil(totalWidth / tileWidth);
      const mapRows = Math.ceil(totalHeight / tileWidth);

      const mapLayout = [];

      for (let r = 0; r < mapRows; r++) {
        let rowStr = "";
        for (let c = 0; c < mapCols; c++) {
          // Randomly add a 'g' or 'G' tile
          rowStr += Math.random() < 0.8 ? "g" : "G";
        }
        mapLayout.push(rowStr);
      }

      return mapLayout;
    }

    function generateMap() {
      const dynamicMap = generateDynamicMapLayout(); // This function stays the same

      const mapConfig = {
        tileHeight: tileWidth,
        tileWidth: tileWidth,
        // Define the tiles directly here
        tiles: {
          g: () => [
            // 'g' is always frame 7 from the "all-assets" sheet
            k.sprite("all-assets", { frame: 7 }),
          ],
          G: () => [
            // 'G' is always frame 8 from the "all-assets" sheet
            k.sprite("all-assets", { frame: 8 }),
          ],
        },
      };

      k.addLevel(dynamicMap, mapConfig);
    }
        // --- 2. CORE RENDERING & SYNCHRONIZATION LOGIC ---

        /**
         * Creates a new Kaplay game object based on data from the server.
         * This includes the character sprite and its health bar.
         */



    





        
        const directionalCharacters = ["shooterMonkey", "giant", "monkey"];

    // **CORRECTED FUNCTION**
    function createCharacterObject(serverChar: ServerCharacter) {

        console.log("owner id of serverchar", serverChar.ownerId)
        const isFriendly = (serverChar.ownerId === localPlayerId.current);
        const k = kaplayInstance.current;

        // **FIXED LOGIC**: Determine the correct sprite key before creating the object
        let spriteKey = serverChar.name;
        if (directionalCharacters.includes(serverChar.name)) {
            const direction = isFriendly ? "Front" : "Back";
            spriteKey += direction;
        }

        const normalizedPos = normalizePosition(serverChar.pos);

        const charObj: any = k.add([
            listOfAllSprites[spriteKey], // Now this is safe
            k.pos(normalizedPos.x, normalizedPos.y),
            k.scale(2),
            serverChar.isBackwards ? k.rotate(180): "",
            // k.body(),
            // k.area(),
            k.anchor("center"),
            isFriendly ? "friend" : "enemy",

        ]);

        if (serverChar.maxHealth > 0) {
            const fullBar = charObj.add([
                k.rect(charObj.width, 4),
                k.pos(0, -charObj.height / 2 - 4),
                k.anchor("center"),
                k.color(k.BLACK),
            ]);
            const healthBar = fullBar.add([
                k.rect(fullBar.width - 2, fullBar.height - 2),
                k.pos(0, 0),
                k.anchor("center"),
                k.color(isFriendly ? k.GREEN : k.RED),
            ]);
            charObj.fullBar = fullBar;
            charObj.healthBar = healthBar;
        }
        return charObj;
    }

        /**
         * This is the heart of the "dumb renderer". It makes the client scene
         * perfectly match the state received from the server.
         */
        function normalizePosition(objPos: {x: number, y: number}) {
          const WORLD_WIDTH = 1000;
          const WORLD_HEIGHT = 1800;


          const normalizedPos = {
            x: totalWidth*(objPos.x/WORLD_WIDTH),
            y: totalHeight*(objPos.y/WORLD_HEIGHT)

          }
          // console.log("this is the normalized position", normalizedPos)
          return normalizedPos

        }


        function synchronizeGameState(state: GameStateUpdate) {
        const k = kaplayInstance.current;

    

    // This logic for updating coconut count is fine
   if (localPlayerId.current) {
    gameStats.coconuts = state.coconuts;
} else {
    // This might still log if the player ID isn't set, but the coconutText error is gone
    console.log("localPlayerId is null", localPlayerId.current) 
}
    const receivedIds = new Set<string>();
    // console.log("this is the length of all characters", state.characters.length)
    for (const serverChar of state.characters) {
        // console.log("we are at ")
        receivedIds.add(serverChar.id);
        let localObj = serverObjects.current.get(serverChar.id);

        if (!localObj) {
            localObj = createCharacterObject(serverChar);
            serverObjects.current.set(serverChar.id, localObj);
        }

        const normalizedPos = normalizePosition(serverChar.pos);
        // we need to normalize the positions here
        localObj.pos.x = normalizedPos.x;
        localObj.pos.y = normalizedPos.y;

        if (localObj.healthBar) {
            const percentage = serverChar.health / serverChar.maxHealth;
            localObj.healthBar.width = (localObj.fullBar.width - 2) * percentage;
        }

        // console.log("this is the serverchar", serverChar.vel)
        const isMoving = serverChar.vel.x !== 0 || serverChar.vel.y !== 0;

// === START: REPLACEMENT LOGIC ===

if (isMoving) {
    // 1. HANDLE MOVING CHARACTERS
    const direction = serverChar.vel.y < 0 ? "Back" : "Front";
    const animName = `walk_${direction.toLowerCase()}`;
    
    // Only switch animation if it's not already playing
    if (localObj.curAnim() !== animName) {
        localObj.use(k.sprite(serverChar.name + direction + "Walking"));
        localObj.play(animName);
    }
} else {
    // 2. HANDLE STATIONARY CHARACTERS (ATTACKING OR IDLE)
    if (serverChar.animation.includes("Shooting")) {
        // A. Handle attacking
        const correspondingCommand: Record<string, string> = {
            "FrontAnimationShooting": "shoot_front",
            "BackAnimationShooting": "shoot_back",
            "Shooting": "shoot", // For towers
        };
        const cmd = correspondingCommand[serverChar.animation];

        if (cmd && localObj.curAnim() !== cmd) {
            // The sprite name is composed, e.g., "giant" + "BackAnimationShooting"
            localObj.use(k.sprite(serverChar.name + serverChar.animation));
            localObj.play(cmd);
        }
    } else {
        // B. Handle idle
        let spriteKey = serverChar.name;
        if (directionalCharacters.includes(serverChar.name)) {
            // Determine facing direction based on last known velocity or default
            // Assuming friendly units face front when idle
            const isFriendly = (serverChar.ownerId === localPlayerId.current);
            spriteKey += isFriendly ? "Front" : "Back";
        }
        // Use the static sprite from the list
        localObj.use(listOfAllSprites[spriteKey]);
    }
}
    }

    for (const [id, localObj] of serverObjects.current.entries()) {
        if (!receivedIds.has(id)) {
            localObj.destroy();
            serverObjects.current.delete(id);
        }
    }
}



        k.scene("game", () => {

          k.onUpdate(() => {
                // Check if there are any new states in the queue
                if (latestGameState.current) {
                    // Grab only the MOST RECENT state from the server
                    synchronizeGameState(latestGameState.current);

                    // Synchronize the game using this definitive state
                   
                    // console.log
                }
          });
            // Your map and UI setup code (largely unchanged)
            // ... generateMap(), uiPanel, coconut bar, etc.
             
     generateMap();

  const uiPanel = k.add([
        k.rect(k.width(), heightOfUI), // Made it a bit taller
        k.color(k.BLACK),
        k.pos(0, k.height() - heightOfUI),
        k.fixed(),

        k.z(3), // Use z() to make sure UI is always on top
      ]);

      // --- 2. The Coconut Bar ---
      const maxCoconuts = 10;

      // The background of the bar
      const barBg = uiPanel.add([
        k.rect(200, 30, { radius: 8 }),
        k.pos(heightOfUI, 80), // Positioned relative to the uiPanel
        k.color(40, 40, 40),
      ]);
      const coconutCounter = uiPanel.add([
        k.pos(heightOfUI + barBg.width / 2, 40), // Positioned to the left of the bar
        "coconutLabel"
      ]);

      // The magenta fill of the bar
      const barFill = barBg.add([
        k.rect(0, 22, { radius: 6 }), // Starts with 0 width
        k.pos(4, 4), // A little padding inside the background
        k.color(255, 255, 255),
      ]);

      // The coconut icon and text count

      coconutCounter.add([
        listOfAllSprites.coconut,
        k.scale(3),
        k.anchor("center"),
      ]);

      const coconutLabel = coconutCounter.add([
        k.text(String(gameStats.coconuts), { size: 16 }),
        k.anchor("center"),
        k.pos(0, 0),
        k.color(k.BLACK),
 
      ]);

      coconutCounter.onUpdate(() => {
        coconutLabel.text = String(Math.floor(gameStats.coconuts));
      });

      // This function updates the bar's width based on the current coconut count
      barFill.onUpdate(() => {
        const percentage = gameStats.coconuts / maxCoconuts;
        // barBg.width - 8 gives us the max fill width with padding
        barFill.width = (barBg.width - 8) * percentage;
      });

            
            // Your card deck setup (unchanged)
            // ... playerDeck, cardContainer, etc.

            const playerDeck = [
        {
          sprite: listOfAllSprites.shooterMonkeyFront,
          name: "shooterMonkey",
          cost: 1,
          type: "troop",
          health: 100,
          maxHealth: 100,
          damage: 20,
          attackRadius: 150,
          speed: 200,
          attackSpeed: 1.2,
        },
        {
          sprite: listOfAllSprites.giantFront,
          cost: 4,
          name: "giant",
          type: "troop",
          health: 400,
          maxHealth: 400,
          damage: 200,
          attackRadius: 60,
          speed: 20,
          attackSpeed: 1.2,
        },
        {
          sprite: listOfAllSprites.monkeyFront,
          cost: 3,
          name: "monkey",
          type: "troop",
          health: 100,
          maxHealth: 100,
          damage: 200,
          attackRadius: 40,
          speed: 100,
          attackSpeed: 1.2,
        },
        {
          sprite: listOfAllSprites.fireball,
          cost: 5,
          name: "fireball",
          type: "spell",
          health: 0,
          maxHealth: 0,
          damage: 200,
          attackRadius: 100,
          speed: 20,
          attackSpeed: 1.2,
        },
      ];

      const cardSpacing = 10;
      const cardWidth = 80;
      const cardHeight = 100;

      const cardObjects: any[] = [];

      // A container to hold all the cards, making them easy to position as a group
      const cardContainer = uiPanel.add([
        k.pos(k.center().x, 10), // Position the whole deck
        k.anchor("top"),
      ]);

       playerDeck.forEach((cardData, i) => {
        // Calculate the position for each card
        const xPos = i * (cardWidth + cardSpacing);

        // Add the card frame
        const card = cardContainer.add([
          k.rect(cardWidth, cardHeight, { radius: 8 }),
          k.pos(xPos, 0),
          k.outline(2, k.WHITE),
          k.color(80, 80, 100),
          k.area(), // Make it clickable
          "card", // Add a tag to identify it
        ]);

        (card as any).cardData = cardData;

        cardObjects.push(card);

        // Add the character sprite inside the card
        card.add([
          cardData.sprite,
          k.pos(card.width / 2, card.height / 2 - 10),
          k.anchor("center"),
          k.scale(2),
          "card-icon",
        ]);

        // Add the coconut cost bubble
        const costBubble = card.add([
          listOfAllSprites.coconut,
          k.pos(15, card.height - 15),
          k.scale(1.2),
          k.anchor("center"),
          k.color(255, 0, 255),
        ]);

        // Add the cost text inside the bubble
        costBubble.add([
          k.text(String(cardData.cost), { size: 12 }),
          k.anchor("center"),
          k.pos(0, 0),
          k.color(k.BLACK),
        ]);
      });



            let currentDrag: any = null;
            let originalCard: any = null;

            // --- INPUT HANDLING ---
            k.onMouseRelease(() => {
                if (!currentDrag) return;

                const placementPos = k.mousePos();

                // Check if placement is in the valid area (above the UI)
                if (placementPos.y < uiPanel.pos.y) {
                    console.log(`Sending PLACE_CHARACTER for ${originalCard.cardData.name}`);
                    // In your frontend Game.tsx file, inside onMouseRelease

const normalizeBackwards = (screenPos: { x: number, y: number }) => {
    const WORLD_WIDTH = 1000;
    const WORLD_HEIGHT = 1800;

    // Correctly scale the screen coordinate percentage to the world coordinate dimensions
    const worldPos = {
        x: WORLD_WIDTH * (screenPos.x / totalWidth),
        y: WORLD_HEIGHT * (screenPos.y / totalHeight)
    };

    return worldPos;
}

                    

                    
                    const normalizePlaced = normalizeBackwards(placementPos)

                    // FORWARD THE ACTION TO THE SERVER
                    ws.current?.send(JSON.stringify({
                        type: "PLACE_CHARACTER",
                        cardName: originalCard.cardData.name,
                        position: { x: normalizePlaced.x, y: normalizePlaced.y },
                    }));

                    
                    // The client DOES NOT check for coconuts or create the character.
                    // It just sends the request and waits for the next GAME_STATE_UPDATE.
                }

                // Cleanup the drag ghost
                if (originalCard) {
                    originalCard.color = k.rgb(80, 80, 100);
                }
                currentDrag.destroy();
                currentDrag = null;
                originalCard = null;
            });

            k.onMousePress(() => {
        // Don't start a new drag if one is already happening
        if (currentDrag) return;
        // console.log("this was triggerd", k.get("card"));
        // Get the mouse position once
        const mpos = k.mousePos();

        // Check every object with the "card" tag
        cardObjects.forEach((card) => {
        //   console.log("the card exist right");
          // THE FIX: Manually check if the mouse position is inside the card's area
          if (card.isHovering()) {
            // console.log("Manual hover check successful!");

            // --- This is your original drag logic, it can now run ---

            const icon = card.cardData;

            // console.log("this is the icon we found", icon.sprite);
            originalCard = card;

            currentDrag = k.add([
              icon.sprite,
              k.area(),
              k.pos(mpos), // Start the drag at the current mouse position
              k.anchor("center"),
              k.z(5),
            ]);
            if (icon.type === "spell") {

                // We need to add a transparent circle to do this
                currentDrag.add([
                    // currentDrag.center(),
                    k.circle(icon.attackRadius),
                    // k.color(0,0,0),
                    // k.outline(2, k.rgb(0, 0, 255)),
                    k.area(),
                    // k.color(255, 255, 255),
                    k.anchor('center')
                ])

                // circle.color.a = 0
            }

            originalCard.color = k.rgb(128, 128, 128);

            // Important: exit the loop once we've found a card to drag
            return;
          }
        });
      });


            k.onMouseMove((pos: any) => {
        // defensively resolve the entity returned by k.get("cursor")

        if (currentDrag) {
        //   console.log("we r moving!");
          currentDrag.pos = k.mousePos();
        }

        const found = (k.get as any)("cursor");
        const entity = Array.isArray(found) ? found[0] : found;
        if (!entity) return;

        // Try common movement APIs; fall back to setting x/y
        try {
          if (typeof entity.moveTo === "function") {
            // accepts (x, y)
            (entity as any).moveTo(pos.x, pos.y);
            return;
          }

          if (typeof entity.pos === "function") {
            // some kaplay wrappers use pos(x,y)
            (entity as any).pos(pos.x, pos.y);
            return;
          }

          // array-wrapped entity
          if (entity[0] && typeof entity[0].moveTo === "function") {
            entity[0].moveTo(pos.x, pos.y);
            return;
          }

          // fallback: set properties directly
          (entity as any).x = pos.x;
          (entity as any).y = pos.y;
        } catch (e) {
          // ignore any runtime errors from unknown shapes
        }
      });



            

            
            
            // onMousePress and onMouseMove for dragging visuals can remain the same
            // ...
        });

        

        k.go("game");

        // (kaplayInstance.current as any).synchronizeGameState = synchronizeGameState;
   
      


    },[hasStarted])




    // useEffect(() => {
    //     // Check if there's a message and if the game engine is ready
    //     if (stateQueue.current && kaplayInstance.current?.synchronizeGameState) {
    //         console.log("SYNCING GAME STATE");
    //         kaplayInstance.current.synchronizeGameState(socketMessage);
    //         // Optional: You might not need to setSocketMessage(null) if you're okay
    //         // with re-syncing the last state on other re-renders, but it can be cleaner.
    //     }
    // }, [socketMessage]); // Dependency: only runs when `socketMessage` changes




    useEffect(() => {


        return () => {
            console.log("this final cleanup function was called");
            kaplayInitialized.current = false;
            ws.current?.close();
            // k?.destroy();
        };

    },[])



    return null; // The Kaplay canvas is managed outside of React's DOM tree
}