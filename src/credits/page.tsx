import React from "react";
import { Link } from "react-router-dom";


export default function Credits() {
    const teamMembers = [
        { name: 'Sebastian', role: 'Developed the whole thing' },
        { name: 'Your name', role: 'Commit to be added' },


    ];


    return (
        <>
      <div className="flex justify-center items-center min-h-screen bg-[#1a1a1a] bg-[url('/grid.apng')] bg-cover font-1 text-white text-center">
      <div className="flex flex-col items-center gap-8 p-4">
        <h1 className="text-5xl text-primary font-bold" style={{ textShadow: '2px 2px #000' }}>
          CREDITS
        </h1>

        <div className="flex flex-col gap-6 w-full max-w-md">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="flex justify-between items-center text-xl border-b-2 border-dotted border-gray-600 pb-2"
            >
              <span className="text-white">{member.name}</span>
              <span className="text-gray-400 italic">{member.role}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Special thanks to everyone who supported this project.
        </p>

        <Link to="/dashboard" className="btn btn-primary font-1 text-lg scale-125 mt-8">
          Back to Menu
        </Link>
      </div>
    </div>



        
        
        </>
    )

}