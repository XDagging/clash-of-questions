import kaplay from "kaplay";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardCommandKey } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
// Define the shape of the data we expect from the server for clarity
interface ServerCharacter {
    id: string;
    ownerId: string;
    name: string;
    pos: { x: number; y: number };
    vel: { x: number; y: number };
    health: number;
    maxHealth: number;
    type: string;
    // We might add more from the server later, like 'isAttacking'
}

interface GameStateUpdate {
    type: "GAME_STATE_UPDATE";
    characters: ServerCharacter[];
    playerOneCoconuts: number;
    playerTwoCoconuts: number;
}

interface GameStart {
    type: "GAME_START";
    yourPlayerId: string;
    // any other initial data...
}

// Props are no longer needed as the server will provide all game data
export default function Game() {
    const [searchParams] = useSearchParams();
    const [hasStarted, setHasStarted] = useState(false);
    const kaplayInitialized = useRef(false);
    const kaplayInstance = useRef<any>(null);    
    // Refs to hold persistent objects without causing re-renders
    const serverObjects = useRef(new Map<string, any>());
    const ws = useRef<WebSocket | null>(null);
    const localPlayerId = useRef<string | null>(null);

    const [socketMessage, setSocketMessage] = useState<any>(null);

    useEffect(() => {
 

        // --- 3. WEBSOCKET CONNECTION & EVENT HANDLING ---

        try {
          console.log("we just tried connecting to the websocket")
          ws.current = new WebSocket("wss://localhost:443"); // Use your actual server URL

          ws.current.onopen = async() => {
            // await new Promise(r => setTimeout(r, 250));
            // sometimes the event is buggy and this opens too early
            console.log("✅ WebSocket connection established.");
            const gameId = searchParams.get("gameId")
            if (gameId) {
                ws.current?.send(gameId);
            } else {
                console.error("No gameId found in URL!");
            }
          };

        ws.current.onmessage = (event) => {
            const message: GameStateUpdate | GameStart = JSON.parse(event.data);
            
            if (message.type === "GAME_START") {
                setHasStarted(true);
                localPlayerId.current = message.yourPlayerId;
                console.log(`🎉 Game started! This client is Player ID: ${localPlayerId.current}`);
            }
            
            if (message.type === "GAME_STATE_UPDATE") {
                // console.log("we are receiving an updatee", message)
                setSocketMessage(message);

                
                // synchronizeGameState(message);
                
                // Update UI elements like coconut count
            
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
        if (!hasStarted) {
          return;
        }

       
   

      

      
      if (!kaplayInitialized.current) {
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

        const k = kaplayInstance.current===null ? kaplay({
            width: window.innerWidth / 2,
            height: window.innerHeight,
        }) : kaplayInstance.current;


        if (kaplayInstance.current ===null) {
          kaplayInstance.current = k;
        }
    const sourceTileWidth = 32;
     const maxCoconuts = 10;

    // These are some universal constants
    const totalWidth = window.outerWidth / 2;
    const totalHeight = window.outerHeight;

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
        "shoot_front": {from: 0, to: 3, speed: 10}
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
    const cardDefinitions = {
        tower: {
            sprite: listOfAllSprites.tower,
            name: "tower",
            cost: 0,
            type: "tower",
            health: 2000,
            maxHealth: 2000,
            damage: 15,
            attackRadius: 175,
            attackSpeed: 1.2,
        }
      }



      

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

      const map = k.addLevel(dynamicMap, mapConfig);
    }
        // --- 2. CORE RENDERING & SYNCHRONIZATION LOGIC ---

        /**
         * Creates a new Kaplay game object based on data from the server.
         * This includes the character sprite and its health bar.
         */



    





        
        const directionalCharacters = ["shooterMonkey", "giant", "monkey"];

    // **CORRECTED FUNCTION**
    function createCharacterObject(serverChar: ServerCharacter) {
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
          console.log("this is the normalized position", normalizedPos)
          return normalizedPos

        }


        function synchronizeGameState(state: GameStateUpdate) {
    const k = kaplayInstance.current;

    // This logic for updating coconut count is fine
    const coconutText = k.get("coconutLabel")[0];
    if (coconutText && localPlayerId.current) {
        const myCoconuts = localPlayerId.current==="playerOne" ? state.playerOneCoconuts : state.playerTwoCoconuts;

        gameStats.coconuts = myCoconuts;
        coconutText.text = String(Math.floor(myCoconuts));
    }

    const receivedIds = new Set<string>();
    console.log("this is the length of all characters", state.characters.length)
    for (const serverChar of state.characters) {
        receivedIds.add(serverChar.id);
        console.log("this is the serverchar id", serverChar.id)
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

        // **NEW**: Define which characters need directional sprites
        const directionalCharacters = ["shooterMonkey", "giant", "monkey"];

        if (isMoving && directionalCharacters.includes(serverChar.name)) {
            // This logic is mostly the same, but now guarded
            const direction = serverChar.vel.y < 0 ? "Back" : "Front";
            const animName = `walk_${direction.toLowerCase()}`;
            if (localObj.curAnim() !== animName) {
                localObj.use(k.sprite(serverChar.name + direction + "Walking"));
                localObj.play(animName);
            }
        } else {
            // **REVISED LOGIC FOR STATIONARY OBJECTS**
            // if (localObj.isAnimPlaying()) localObj.stop();
            
            let spriteKey = serverChar.name; // Default to the base name (e.g., "tower")

            // If it's a directional character, then append "Front" or "Back"
            if (directionalCharacters.includes(serverChar.name)) {
                // Use <= 0 to correctly handle the stationary case where vel.y is 0
                const direction = serverChar.vel.y <= 0 ? "Back" : "Front";
                spriteKey += direction;
            } else if (serverChar.type === "tower") {
              localObj.use(listOfAllSprites["tower"]);
              return;
            }
            
            // This is now safe because spriteKey will be "tower" for towers, 
            // and "shooterMonkeyFront" for shooter monkeys, etc.
            localObj.use(listOfAllSprites[spriteKey]);
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

            let currentDrag: any = null;
            let originalCard: any = null;

            // --- INPUT HANDLING ---
            k.onMouseRelease(() => {
                if (!currentDrag) return;

                const placementPos = k.mousePos();

                // Check if placement is in the valid area (above the UI)
                if (placementPos.y < uiPanel.pos.y) {
                    console.log(`Sending PLACE_CHARACTER for ${originalCard.cardData.name}`);
                    
                    // FORWARD THE ACTION TO THE SERVER
                    ws.current?.send(JSON.stringify({
                        type: "PLACE_CHARACTER",
                        cardName: originalCard.cardData.name,
                        position: { x: placementPos.x, y: placementPos.y },
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
            
            // onMousePress and onMouseMove for dragging visuals can remain the same
            // ...
        });

        k.go("game");

        (kaplayInstance.current as any).synchronizeGameState = synchronizeGameState;
   
      }

      if (socketMessage !== null && kaplayInstance.current?.synchronizeGameState) {
         console.log("we are calling the syncrhornize gamestate here")
        kaplayInstance.current.synchronizeGameState(socketMessage);
        setSocketMessage(null); // Reset after processing
      }

      

        // --- 5. CLEANUP LOGIC ---
    },[hasStarted, socketMessage])








    
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