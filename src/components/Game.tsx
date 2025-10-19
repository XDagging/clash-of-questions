import kaplay from "kaplay";
import { useEffect, useRef } from "react";
import { crew } from "@kaplayjs/crew";

type GameProps = {
  coconutMultiplier: number;
}


export default function Game(props: GameProps) {
  const kaplayInitialized = useRef(false);
  const coconutMultiplier = useRef(Number(props.coconutMultiplier));



  useEffect(() => {
    console.log("the coconut multiplier is now", Number(props.coconutMultiplier))
    coconutMultiplier.current = Number(props.coconutMultiplier);
  },[props.coconutMultiplier])
 

  // These gameStats can just be inside of the kaplay instance, not outside. theres no need for react components since this isnt ever gonna rerender.
    


  useEffect(() => {
    if (kaplayInitialized.current) {
      return;
    }
    const tileWidth = 32;
    const sourceTileWidth = 32;

    const gameStats = {
      leftTower: 2000,
      rightTower: 2000,
      middleTower: 2500,
      coconuts: 10,
    };
    

    // Drag Functionality:

    let currentDrag: any = null;
    let originalCard: any = null;

    const maxCoconuts = 10;

    // These are some universal constants
    const totalWidth = window.outerWidth / 2;
    const totalHeight = window.outerHeight;

    const totalColumns = 288 / sourceTileWidth; // 36
    const totalRows = 576 / sourceTileWidth; // 18

    const k = kaplay({
      plugins: [crew],
      width: window.innerWidth / 2,
      height: window.innerHeight,
    });
    kaplayInitialized.current = true;
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



    





  
    // We need to use the col and row items.

    // Lets make a list of every character given their tile space/section

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
      type Tile = {
          x: number,
          y: number
        }

    const heightOfUI = 120
        class CharacterState {
    // --- PROPERTIES ---
    // These will be populated by the 'originalCard' object
    
    public name!: string;
    public health!: number;
    public damage!: number;
    public speed!: number;
    public attackRadius!: number;
    public type!: string;
    public attackSpeed!: number;
    public finalTile: Tile = {x: 0, y:0,};
    public isAttacking: boolean = false;
    public wayPoints: any[] = [];
    public isDestroyed: boolean = false;

    public currentTarget: any | null = null;
    public facingDirection: "down" | "up" = "down";
    // This is relative to the current player
    public isOpponent!: boolean;
    
    public currentAnimation: "idle" | "walking" | "attacking" = 'idle';
    private isPlayingWalkAnimation: boolean = false;
    public attackTimer: number = 0;

    // Other properties for managing the character in the game
    public gameObject: any | null; // Reference to the game object in the engine
    // public anims: { up: any; down: any; };

    // A private reference to the game engine context (e.g., Kaboom.js)
    private k: any;

    // --- CONSTRUCTOR ---
    /**
     * Creates an instance of CharacterState.
     * @param originalCard - The data object for the character (e.g., from a JSON file).
     * @param k - The game engine instance (e.g., Kaboom context).
     * @param listOfAllSprites - An object mapping sprite names to sprite assets.
     */
    constructor(originalCard: any, k: any, listOfAllSprites: any, gameObj: any, isOpponent: boolean) {
        // Assign all properties from the card data to this instance
        Object.assign(this, originalCard);
        this.isOpponent = isOpponent
        // Store the game engine context
        this.k = k;

        // Initialize properties that aren't in the originalCard
        this.gameObject = gameObj;
        // this.anims = {
        //     up: listOfAllSprites[originalCard.name + "Front"],
        //     down: listOfAllSprites[originalCard.name + "Back"],
        // };
    }

    // --- METHODS ---
    /**
     * Reduces the character's health by a given amount.
     * If health drops to 0 or below, it destroys the associated game object.
     */
    public takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            console.log('we are here about to destory and', this.gameObject)
            this.gameObject.destroy(); // Safely destroy the game object if it exists
            this.isDestroyed = true;
        }
    }

    /**
     * Moves the character towards the nearest target.
     * @returns {boolean} - True if the character is moving, false if it's stopped.
     */


    // It woudl return a Vec2 but ion want to import that type.
    public movingAlgo(): any {
      
      if (!this.gameObject) return false; // Guard clause
        let closestTarget = null;
        let closestDistance = Infinity;


        // This will choose what the end target is.
        const primaryTargets = this.findNearEnemies();
        // Decides whether moving up or down
        if (primaryTargets.length ===0) {
          console.log("primary targets is null for some reason")
          this.currentTarget = null;
          this.wayPoints = [];
          return;
        }
        

        for (const target of primaryTargets) {
            const distance = this.gameObject.pos.dist(target.pos);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTarget = target;
            }
        }

        this.currentTarget = closestTarget;
        console.log("We've found a target", closestTarget)
        let currNode: Tile = {
          x: Math.floor(this.gameObject.pos.x/16),
          y: Math.floor(this.gameObject.pos.y/16)
        };
        const closedList = new Set<string>();
        closedList.add(`${currNode.x},${currNode.y}`);



      
        const direction = closestTarget.pos.sub(this.gameObject.pos).unit();
        const destinationPos = closestTarget.pos.sub(direction.scale(this.attackRadius - 5));
        const attackVector = direction.scale(this.attackRadius - 5);

        console.log("this is the computed attack radius", attackVector);


        const maxPathLength = 200;

        
        let pathLength = 0;
        this.finalTile = {x: Math.floor(destinationPos.x / 16),
        y: Math.floor(destinationPos.y / 16)};
        const firstTile: Tile = {x: Math.floor(this.gameObject.pos.x/16), y: Math.floor(this.gameObject.pos.y/16)};
        while ((currNode.x !== this.finalTile.x || currNode.y !== this.finalTile.y) && (pathLength < maxPathLength)) {
          console.log('we are here being run');
          let winningG = 100000;
          let winningH = 100000;
          let winningTile: Tile | null = null;

          // Could do a forloop, but honestly hardcoding would be easier here

          for (let i=1; i<9; i++) {
            const nodeInAttempt = {
              x: currNode.x,
              y: currNode.y
            }
            if (i<=3) {
              nodeInAttempt.x -= 1;
            } else if (i>=6) {
              nodeInAttempt.x += 1;
            }

            if (i===1||i===4||i===6) {
              nodeInAttempt.y += 1;
            } else if (i===3||i===5||i===8) {
              nodeInAttempt.y -= 1;
            }

            const nodeKey = `${nodeInAttempt.x},${nodeInAttempt.y}`;
            if (closedList.has(nodeKey)) {
              continue; // If we've already been to this tile, skip it!
            }
            if (this.isTileBlocked(nodeInAttempt.x, nodeInAttempt.y)) {
              continue;
            }

            const nodeG = Math.sqrt(Math.pow((nodeInAttempt.x - firstTile.x), 2) + Math.pow((nodeInAttempt.y - firstTile.y), 2));
            const nodeH = Math.sqrt(Math.pow((nodeInAttempt.x - this.finalTile.x),2) + Math.pow((nodeInAttempt.y - this.finalTile.y),2))

            if ((
              (winningG + winningH) > 
              (nodeG + nodeH)) || 
              (
                (
                (winningG + winningH) === (nodeG + nodeH)
              ) && (nodeH < winningH))) {
              console.log("we found a winning tile right here", nodeInAttempt)
              winningG = nodeG;
              winningH = nodeH;
              winningTile = nodeInAttempt;

              pathLength++;
              
            }

          }

     
          if (winningTile!==null) {
            this.wayPoints.push(winningTile);
            currNode = winningTile;
            closedList.add(`${currNode.x},${currNode.y}`);
          } else {
            console.error("Pathfinding failed: Character is trapped.");
            break;
          }
     


        





        }

        console.log("This is the whole waypoint structure", this.wayPoints, pathLength);

        // const xTilesAway = Math.floor(closestTarget.pos.x / tileWidth);
        // const yTilesAway = Math.floor(closestTarget.pos.y / tileWidth); 

        // console.log("this is what target", xTilesAway, yTilesAway)


          // we will use the cl;osestTarget
      



    }

    public isTileBlocked(tileX: number, tileY: number) {
    const TILE_SIZE = 16; // Assuming your tile size is 32
    const obstacles = k.get("object"); // Get all objects with the "object" tag

    for (const obs of obstacles) {
        const obsTileX = Math.floor(obs.pos.x / TILE_SIZE);
        const obsTileY = Math.floor(obs.pos.y / TILE_SIZE);

        if (obsTileX === tileX && obsTileY === tileY) {
            return true; // Found an obstacle on this tile
        }
    }

    return false; // No obstacle found
    }

public move(): boolean {
    if (!this.gameObject) return false;

    const primaryTargets = this.findNearEnemies();

    // --- PRIORITY 1: CHECK FOR ATTACK OPPORTUNITIES ---
    let targetInRange = false;
    for (const target of primaryTargets) {
        if (this.gameObject.pos.dist(target.pos) <= this.attackRadius) {
            targetInRange = true;
            break;
        }
    }

    if (targetInRange) {
        // If we can attack, STOP EVERYTHING.
        this.wayPoints = [];
        this.gameObject.vel = this.k.vec2(0, 0);
        if (this.isPlayingWalkAnimation) {
            // Revert to idle animation
            this.isPlayingWalkAnimation = false;
            if (this.facingDirection === "up") {
                this.gameObject.use(listOfAllSprites[this.name + "Back"]);
            } else {
                this.gameObject.use(listOfAllSprites[this.name + "Front"]);
            }
        }
        return false; // Signal to attack
    }

    // --- PRIORITY 2: MOVE (Only if no targets are in range) ---
    if (primaryTargets.length === 0) {
        this.wayPoints = [];
        this.gameObject.vel = this.k.vec2(0, 0);
        return false;
    }

    if (this.wayPoints.length === 0) {
        this.movingAlgo();
    }

    if (this.wayPoints.length > 0) {
        // --- NEW PUSH-HANDLING LOGIC ---
        const finalDestPos = this.k.vec2(
            (this.finalTile.x * 16) + 8,
            (this.finalTile.y * 16) + 8
        );

        // Loop and remove any waypoints that are now "behind" us relative to the final goal.
        while (this.wayPoints.length > 0) {
            const nextWaypointPos = this.k.vec2(
                (this.wayPoints[0].x * 16) + 8,
                (this.wayPoints[0].y * 16) + 8
            );

            const distCharToGoal = this.gameObject.pos.dist(finalDestPos);
            const distWaypointToGoal = nextWaypointPos.dist(finalDestPos);

            if (distCharToGoal < distWaypointToGoal) {
                // We are closer to the end than this waypoint is. It's redundant. Skip it.
                this.wayPoints.shift();
            } else {
                // This is the correct waypoint to move towards. Stop checking.
                break;
            }
        }
        // --- END OF PUSH-HANDLING LOGIC ---

        // If the push logic cleared all waypoints, we have arrived.
        if (this.wayPoints.length === 0) {
            this.gameObject.vel = this.k.vec2(0, 0);
            return false;
        }

        // --- RESUME NORMAL PATH-FOLLOWING ---
        const nextWaypoint = this.wayPoints[0];
        const targetPos = this.k.vec2(
            (nextWaypoint.x * 16) + 8,
            (nextWaypoint.y * 16) + 8
        );

        if (this.gameObject.pos.dist(targetPos) < 4) {
            this.wayPoints.shift();
            if (this.wayPoints.length === 0) {
                this.gameObject.vel = this.k.vec2(0, 0);
                return false;
            }
        }
        
        const direction = targetPos.sub(this.gameObject.pos).unit();
        this.gameObject.vel = direction.scale(this.speed);
        this.updateAnimation(direction);
        
        return true; // We are actively moving
    }

    this.gameObject.vel = this.k.vec2(0, 0);
    return false;
}

// (Your updateAnimation helper function remains the same)

// Don't forget to add the helper function if you didn't already
private updateAnimation(direction: any): void {
    if (!this.isPlayingWalkAnimation) {
        this.isPlayingWalkAnimation = true;
    }
    const yComp = direction.y;
    if (yComp < 0 && this.facingDirection !== "up") {
        this.facingDirection = "up";
        this.gameObject.use(this.k.sprite(this.name + "BackWalking"));
        this.gameObject.play("walk_back");
    } else if (yComp >= 0 && this.facingDirection !== "down") {
        this.facingDirection = "down";
        this.gameObject.use(this.k.sprite(this.name + "FrontWalking"));
        this.gameObject.play("walk_front");
    }
}

    // public move(): boolean {
        
    //     if (!this.gameObject) return false; // Guard clause
      
    //     // console.log("past the first if statement about gameObject")
  

    //     const primaryTargets = this.findNearEnemies();
    //     if (this.wayPoints.length === 0) {
    //       console.log(" the og moving algo was called")
    //       this.movingAlgo();
    //     }
    
    //     if (primaryTargets.length === 0) {
    //         this.gameObject.vel = this.k.vec2(0, 0); // No targets, stop moving
    //         console.log("there are no targets and we returned")
    //         return false;
    //     }
        

    //     // Find the closest target
    //     let closestTarget = null;
    //     let closestDistance = Infinity;


    //     // Decides whether moving up or down

 

    //     for (const target of primaryTargets) {
    //         const distance = this.gameObject.pos.dist(target.pos);
    //         if (distance < closestDistance) {
    //             closestDistance = distance;
    //             closestTarget = target;
    //         }
    //     }
    //      const edgeToEdgeDist = closestTarget 
    //         ? this.gameObject.pos.dist(closestTarget.pos)
    //         : Infinity;

    //     // Move if the target is outside a certain radius, otherwise stop
    //     const isInAttackRadius = edgeToEdgeDist-(tileWidth+1) < this.attackRadius;
    //     // console.log("the Edge to edge attack dist is the following", edgeToEdgeDist, this.attackRadius)
    //     if (!isInAttackRadius && closestTarget) {
           

    //         if (!this.isPlayingWalkAnimation) {
    //            const direction = closestTarget.pos.sub(this.gameObject.pos).unit();

    //             // const angleRad = Math.atan2(direction.x, direction.y);


    //             // const angleDegree = ((angleRad * 180) / Math.PI) - 180;

    //             // const normalizedDeg = (angleDegree +360) % 360;

    //             // this.gameObject.use(k.rotate(normalizedDeg));
    
    //         const yComp = direction.y;
    //         console.log(this.name + "Back")
    //           this.isPlayingWalkAnimation = true;
    //          this.gameObject.vel = direction.scale(this.speed);
    //            if (yComp<0) {
    //             this.facingDirection = "up";
    //             this.gameObject.use(k.sprite(this.name+"BackWalking"));
    //             this.gameObject.play("walk_back")
                
                
    //             // this.gameObject.play("up")
    //         } else {
    //             this.facingDirection = "down";
    //             this.gameObject.use(k.sprite(this.name+"FrontWalking"));
    //             this.gameObject.play("walk_front")
                
    //             // this.gameObject.use(this.anims.down);
    //             // this.gameObject.play("down")
    //         }
    //         }
         


           
    //         // console.log("we are moving a tad bit")
    //         return true; // Is moving
    //     } else {
    //         this.gameObject.vel = this.k.vec2(0, 0);
  

    //         this.gameObject.vel = this.k.vec2(0, 0);

    //     // If we were just walking, switch back to the idle (static) sprite
    //     if (this.isPlayingWalkAnimation) {
    //         if (this.facingDirection === "up") {
    //             this.gameObject.use(listOfAllSprites[this.name + "Back"]);
    //         } else {
    //             this.gameObject.use(listOfAllSprites[this.name + "Front"]);
    //         }
    //         this.isPlayingWalkAnimation = false; // Unset the flag!
    //     }
        
    //     return false; // Is not moving
      
    //     }
    // }

    
    public findNearEnemies(): any[] {
        if (this.isOpponent) {
            // console.log("friend list with target", this.k.get("friend").length)
            return this.k.get("friend").filter((e: any) => e.is("target"));
        } else {
            // console.log("enemy list with target", this.k.get("enemy").length)
            return this.k.get("enemy").filter((e: any) => e.is("target"));
        }

        
    }


    /**
     * Placeholder for the character's attack logic.
    */
   public attack(): void {
        // 1. CHECK COOLDOWN: If the timer is still running, do nothing.
        if (this.attackTimer > 0) {
            return;
        }

        // console.log("we are attacking here")

        const allEnemies = this.findNearEnemies();

        
        let didAttack = false; // Flag to check if an attack actually occurred

        for (const target of allEnemies) {
             const edgeToEdgeDist = this.gameObject.pos.dist(target.pos);
            
            if (edgeToEdgeDist-(tileWidth+1) <= this.attackRadius) {
                target.state.takeDamage(this.damage);
                
                didAttack = true; // Mark that an attack happened

                // If it's a troop (not a spell), attack only one target and break the loop
                if (this.type !== "spell") {
                    break;
                }
            }
        }

        // 2. RESET TIMER: If an attack happened, reset the timer to the character's attack speed.
        if (didAttack) {
            this.attackTimer = this.attackSpeed;
            this.isAttacking = true;

            if (this.name === "tower") {
              this.gameObject.use(k.sprite(this.name + 'Shooting'))
              this.gameObject.play("shoot")
              return;
            } else if (this.type === "spell") {
               
              this.gameObject.destroy();
        
            }
             if (this.facingDirection === "up") {
                // this.gameObject.play("shoot_back");
                // 1. Temporarily switch to the sprite component that CONTAINS the animation
                this.gameObject.use(k.sprite(this.name+"BackAnimationShooting"));



        // 2. NOW we can play the animation because the object is using the right asset
                this.gameObject.play("shoot_back");
              } else {
                this.gameObject.use(k.sprite(this.name+"FrontAnimationShooting"));
        
        // 2. NOW we can play the animation because the object is using the right asset
                this.gameObject.play("shoot_front");
              }


        // Self-destruct logic for spells
     
        
        // REMOVE THIS LINE: k.wait(this.attackSpeed) is not needed here.
    } else {
      this.isAttacking = false;
    }
  }


    public update(dt: number): void {
        // Count down the attack timer every frame
        if (this.attackTimer > 0) {
            this.attackTimer -= dt;
        }



        if (this.type !== "tower") {
            const isMoving = this.move();
      
            if (!isMoving) {
                this.attack(); // The check inside attack() will handle the cooldown
            }
        } else {
            // only for towers
            // console.log("this is right here.")
            this.attack();


        }

        // Decide whether to move or attack
        
    }


    /**
     * A helper method to link this state object to its visual representation in the game.
     */
    public setGameObject(gameObject: any): void {
        this.gameObject = gameObject;
    }
}

      class ShooterCharacter extends CharacterState {




        


      }

    function towerSetup() {
      // 1. Define the playable area with 10% padding on the sides
      const paddingX = k.width() * 0.1;
      const playableWidth = k.width() - paddingX * 2;

      // 2. Calculate the three X positions
      const leftTowerX = paddingX;
      const rightTowerX = k.width() - paddingX;
      const middleTowerX = k.center().x;

      // 3. Define the Y positions for top and bottom towers
      // Place them 15% from the top and bottom of the screen
      const enemyTowerY = (k.height()-heightOfUI)* 0.15;
      const friendlyTowerY = k.height()-heightOfUI - k.height() * 0.15;

      // 4. A helper function to create a single tower
      const addTower = (pos: any, tag: string) => {
        const tower = k.add([
          listOfAllSprites.tower,
          k.pos(pos),

        //   just for debugging purposes
          k.scale(tag==="enemy" ? 2.5 : 2), // Make the tower a bit bigger
          tag==="enemy" ? k.rotate(180) : "",
          k.anchor("center"),
          k.area(),
          k.body({ isStatic: true }), // Towers shouldn't move
          "tower", // General tag
          "target",
          "object",
          tag, // Specific tag ("enemy" or "friend")
        ]);

        const fullBar = tower.add([
            k.rect(tower.width, 4),
            k.pos(0, -tower.height / 2 - 4),
            k.anchor("center"),
            k.color(k.BLACK),
            k.z(4)
          ]);

          const healthBar = fullBar.add([
            k.rect(fullBar.width - 2, fullBar.height - 2),
            k.pos(0, 0),
            k.anchor("center"),
            k.color(k.RED),
            k.z(4)
          ]);
         tower.state = new CharacterState(cardDefinitions["tower"], k, listOfAllSprites, tower, tag==="enemy" ? true : false)

          tower.onUpdate(() => {
            const curHealth = tower.state.health;
            const maxHealth = tower.state.maxHealth;
            const percentage = curHealth / maxHealth;


            tower.state.update(k.dt());

            // This will show you the exact numbers being used for each character
            // console.log(curHealth, maxHealth, percentage);

            healthBar.width = (fullBar.width - 2) * percentage;
            // ...
          });
        
       
      };

  
      // 5. Create all six towers
      // Enemy towers (top)
      addTower(k.vec2(leftTowerX, enemyTowerY), "enemy");
      addTower(k.vec2(middleTowerX, enemyTowerY), "enemy");
      addTower(k.vec2(rightTowerX, enemyTowerY), "enemy");

      // Friendly towers (bottom)
      addTower(k.vec2(leftTowerX, friendlyTowerY), "friend");
      addTower(k.vec2(middleTowerX, friendlyTowerY), "friend");
      addTower(k.vec2(rightTowerX, friendlyTowerY), "friend");

    
    const dashWidth = 15;
    const dashHeight = 5;
    const gap = 10;
    const yPos = (k.height()-heightOfUI)/2 // The vertical center of the screen

    // 2. Loop from the left edge to the right edge of the screen
    for (let xPos = 0; xPos < k.width(); xPos += dashWidth + gap) {
        // 3. Add a small rectangle for each dash
        k.add([
            k.rect(dashWidth, dashHeight),
            k.pos(xPos, yPos),
            k.color(k.WHITE),
            k.opacity(0.5), // Make the line semi-transparent
            k.anchor("center"),
        ]);
    }


    }



    
   
    k.scene("menu", () => {
      k.loadCrew("sprite", "cursor");

      k.add([
        k.sprite("cursor"),
        k.pos(100, 200),
        // k.area(),
        // k.body(),
        k.z(4),
        "cursor",
      ]);
      


      
    const defaultRate = 3; // We'll generate 1 coconut per 3 seconds
    
    // 2. Use k.onUpdate() which runs every single frame
    k.onUpdate(() => {
        // 3. Calculate the CURRENT required interval between coconuts
        // The multiplier modifies the default rate. A higher multiplier means a shorter interval.
        // Note: Your original logic was inverted. A multiplier of 1.5 should be faster, not slower.
        const newRate = defaultRate / coconutMultiplier.current
        // 4. Add the time since the last frame (delta time) to our timer
        const timeConstant = k.dt();

        // 5. Check if the accumulated time has passed our desired interval
        if (gameStats.coconuts < maxCoconuts) {
            gameStats.coconuts += (timeConstant/newRate)
            
            // 6. Reset the timer, carrying over any extra time
            // coconutTimer -= currentInterval;
        }
    });

      //handle mapping side of things
      generateMap();
             towerSetup();
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

      

    //   const cardDefinitions = [

    //     {
          
            
    //     }
    //   ]

      // --- 3. The Card Deck ---
      // A sample deck of cards. You would populate this with your game data.
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


     


    //   function createCharacterState(originalCard: any) {
    //     try {
    //       return {
    //         takeDamage(amount: number) {
    //           this.health -= amount;
    //           if (this.health <= 0) {
    //             this.health = 0;
    //             // 'this' refers to the state object, so we need a reference to the game object
    //             // We'll add this reference when we attach the state.
    //             this.gameObject?.destroy();
    //           }
    //         },
    //         move() {
    //             const allEnemies = k.get("enemy");
            
    //             const primaryTargets = allEnemies.filter((enemy) => {
    //                 return enemy.is("target")
    //             })
        

    //         // 
            
    //         let closestCoordinate: any = 100000;
    //         let closestMagnitude: number = 1000000;
    //         for (let i=0; i<primaryTargets.length; i++) {
    //             if (this.gameObject.pos.dist(primaryTargets[i].pos) < closestMagnitude) {
    //                 closestMagnitude = this.gameObject.pos.dist(primaryTargets[i].pos);
    //                 closestCoordinate = primaryTargets[i].pos;
    //             }
    //         }
    //         const somethingInRadius = closestMagnitude-5<Number(this.gameObject.state.attackRadius) ? true : false
    //         if (!somethingInRadius) {
    //             const direction = closestCoordinate.sub(this.gameObject.pos);
    //             const unitVec = direction.unit();
    //             this.gameObject.vel = unitVec.scale(this.gameObject.state.speed)
    //             return true;
    //         } else {
    //             this.gameObject.vel = k.vec2(0,0);
    //             return false;
    //             // It shouldn't move
    //         }
    //         },
    //         attack() {
    //             // 

    //         },
    //         anims: {
    //           up: listOfAllSprites[originalCard.name + "Front"],
    //           down: listOfAllSprites[originalCard.name + "Back"],
    //         },
    //         gameObject: null,
    //         ...originalCard,
    //         // health: originalCard.health,
    //         // attackDamage: originalCard.damage,
    //         // type: originalCard.type:

    //         // this would depending on the attributes of originalcard...
    //       };
    //     } catch (e) {
    //       throw new Error("Error in the component factory");
    //     }
    //   }

      const placeCharacter = (placementPos: any, isFriendly: boolean) => {
        // This needs to check that it isn't in contact with any other components of value.

        // console.log("Attempting to place character at:", placementPos);
        const card = (originalCard as any).cardData;
        console.log("this is the card that was placed", card)

        const characterAdded = k.add([
          card.sprite,
          k.pos(placementPos),
          card.type=="spell" ? "" : k.body(),
          k.area(),
          k.scale(2),
          k.anchor("center"),
          "character",
          "target",
          "object",
          isFriendly ? "friend" : "enemy",
          
        ]);


        characterAdded.state = new CharacterState(card, k, listOfAllSprites, characterAdded, !isFriendly);
        characterAdded.state.gameObject = characterAdded;
        // Okay. what this is doing is making it so that I can reference the exact monkey from an object instead of doing collision stuff all the time.

        if (card.type === "troop") {
          const fullBar = characterAdded.add([
            k.rect(characterAdded.width, 4),
            k.pos(0, -characterAdded.height / 2 - 4),
            k.anchor("center"),
            k.color(k.BLACK),
          ]);


          
          const healthBar = fullBar.add([
            k.rect(fullBar.width - 2, fullBar.height - 2),
            k.pos(0, 0),
            k.anchor("center"),
            k.color(isFriendly ? k.GREEN : k.RED),
          ]);

          characterAdded.onUpdate(() => {
            const curHealth = characterAdded.state.health;
            const maxHealth = characterAdded.state.maxHealth;
            const percentage = curHealth / maxHealth;

            // This will show you the exact numbers being used for each character
            // console.log(curHealth, maxHealth, percentage);

            healthBar.width = (fullBar.width - 2) * percentage;

            characterAdded.state.update(k.dt());
            // ...
          });

          characterAdded.onAnimEnd((anim: string) => {
        // After shooting, go back to the correct idle sprite
        if (anim === "shoot_back" || anim === "shoot_front") {
            const state = characterAdded.state;
            if (state.facingDirection === "up") {
                // Use the static front-facing sprite from your global list
                characterAdded.use(listOfAllSprites[state.name + "Back"]);
            } else {
                // Use the static back-facing sprite
                characterAdded.use(listOfAllSprites[state.name + "Front"]);
            }
        }
    });


        } else if (card.type === "spell") {
            //bookmark
            characterAdded.state.attack()
        }
      };

      function testFunction() {

        originalCard = cardObjects[0];
        placeCharacter(k.vec2(0,0), false,)
        




    }


      k.onMouseRelease(() => {
        // Do nothing if we weren't dragging anything
        if (!currentDrag) return;

        // --- Placement Logic ---
        const placementPos = k.mousePos();

        // Check if the placement position is on the battlefield
        if ((placementPos.y < uiPanel.pos.y)&&( originalCard.cardData.type !== "troop" || (placementPos.y > (k.height()-heightOfUI)/2) )) {



          console.log("Placed card at", placementPos);
        
          if (gameStats.coconuts >= (originalCard as any).cardData.cost) {
            placeCharacter(placementPos, true);

              testFunction();
            gameStats.coconuts -= (originalCard as any).cardData.cost;
          }

          //
          // TODO: Spawn your actual game character here!
          // You'll need info from the originalCard to know what to spawn.
          // For example: spawnCharacter(originalCard.characterType, placementPos);
          //
        } else {
          console.log("Invalid placement area!");
        }

        // --- Cleanup ---
        // Restore the original card's appearance
        if (originalCard) {
          originalCard.color = k.rgb(80, 80, 100);
        }

        // Destroy the ghost card and reset state variables
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
                const circle = currentDrag.add([
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

      k.onMouseMove((pos, delta) => {
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
    });

    k.go("menu");
  }, []);

  return null;
}
