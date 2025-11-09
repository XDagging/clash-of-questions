import React from "react";





export default function Ad() {

    const possibleHeaders = [
  "Get One SAT Question Per Day",
  "Ace the SAT, One Day at a Time",
  "Your Daily SAT Boost",
  "Practice Smarter, Every Morning",
  "Small Steps, Big SAT Results",
  "Turn Breakfast Into Brain Training",
  "The SAT Habit That Sticks",
  "Sharpen Your Skills Daily",
  "The Easiest SAT Routine Ever",
  "Master the SAT Bit by Bit",
  "Make Every Day Count",
  "SAT Prep, Simplified",
  "Start Your Morning With a Challenge",
  "Daily SAT Drills, Zero Stress",
  "The One-Minute SAT Workout",
  "Build SAT Confidence Daily",
  "One Question Closer to Your Goal",
  "Crush the SAT With Consistency",
  "A Smarter Way to Study",
  "Level Up Your Score Daily"
];

const possibleCallToActions = [
  "Build your SAT skills by answering a fresh question every morning—delivered straight to your inbox.",
  "Practice daily without the overwhelm—one question is all it takes.",
  "Make SAT prep a simple habit with one daily challenge.",
  "Turn spare minutes into score improvements.",
  "Start your day with a question designed to sharpen your skills.",
  "Stay consistent and see results—one question at a time.",
  "Prep doesn't have to be stressful—just steady.",
  "Get a daily reminder to keep your SAT goals on track.",
  "Form the habit that top scorers rely on.",
  "Bite-sized prep designed for busy students like you.",
  "Progress comes from practice—make it effortless.",
  "Learn by doing, every single day.",
  "Consistency beats cramming—prove it to yourself.",
  "One question per day adds up to big improvements.",
  "The easiest way to keep SAT practice in your routine.",
  "Sharpen your mind before class, coffee, or scrolling.",
  "Build test-day confidence with daily exposure.",
  "Make studying feel lighter and more doable.",
  "Your path to a higher score starts with today's question.",
  "Stay motivated, stay sharp, stay ready."
];


// console.log("possible headers", possibleHeaders.length)
// console.log("possible call to action", possibleCallToActions.length)

    const [randomNum] = React.useState<number>((Math.floor(Math.random()*possibleHeaders.length)))



    return (

        <>
        
             <div key={"asd" + randomNum + "asdfa" + randomNum} className="p-4 rounded-box border-2 border-primary bg-base-100 shadow-md">
  <div className="badge badge-secondary">Free</div>
  <h3 className="mt-2 text-xl font-bold font-1">
    {possibleHeaders[randomNum]}
  </h3>
  <p className="mt-1 text-sm text-base-content">
    {possibleCallToActions[randomNum]}
  </p>
  <a href="https://thedailysat.com/" className="btn btn-accent mt-4 font-semibold">
    Sign Up Now
  </a>
</div>

        
        
        
        
        
        
        </>
    )
}