import React from "react";
import cardimg from '../../assets/Home/Group 1321317301.png';

const Testimonials = () => {
  return (
    <section className="bg-[#151515] relative text-white !py-16 !px-6 !md:px-[13rem] ">
      {/* Top  Heading */}
      <div className="flex-col justify-center items-center !mb-10">
        <h6 className="text-center text-customBlue text-6xl gradient-text">
          Testimonials
        </h6>
        <h2 className="!text-[3.5rem] text-center !mt-4">
          What our customers say
        </h2>
        <p className="text-center text-xl !mt-4 ">
          Lorem ipsum dolor sit amet consectetur. Diam et quis sit pretium orci.
          <br />
          At feugiat duis parturient amet scelerisque enim vulputate tortor.
        </p>
      </div>

      {/* card  */}
      <div className="border rounded-3xl flex-col items-center justify-center !py-[5rem] !mt-5">
        <img src={cardimg} alt="" srcset="" className="!w-[4rem] mx-auto !mb-10" />
        <h4 className="text-center text-[2rem]">Web3Go is my go-to platform for things blockchain,</h4>
        <p className="text-center text-xl !my-4 ">Lorem ipsum dolor sit amet consectetur. Diam et quis sit pretium orci. At feugiat duis parturient amet scelerisque enim vulputate tortor. </p>
      </div>
    </section>
  );
};

export default Testimonials;