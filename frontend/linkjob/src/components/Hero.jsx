import React from "react";
import { ReactTyped } from "react-typed";

/* REACT ROUTER  */
import { Link } from "react-router-dom";
/* REACT BOOTSTRAP */
import { Button} from "react-bootstrap";

function Hero() {
  return (
    <div>
      <div className="text-white">
        <div className="max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center">
          <p className="text-[#00df9a] font-bold p-2">
            Let's help you start looking
          </p>
          <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold md:py-6">
            Find Hourly Workers with examplary price!
          </h1>
          <div className="flex justify-center items-center">
            <p className="md:text-4xl sm:text-4xl font-bold py-4">
              Fast, Hard Working lads in
            </p>
            <ReactTyped
            className="md:text-4xl sm:text-4xl font-bold md:pl-4 pl-2"
              strings={["Cleaning", "Plumbing", "Packing", "ETC..."]}
              typeSpeed={120}
              backSpeed={140}
              loop
            />
          </div>
            <p className="md:text-2xl text-xl font-bold text-gray-500">We want to simplify the process of finding workers for you</p>
            <Link to={`/services`}>
              <button className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black ">Get Started</button>
                
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
