import React from 'react';
import Image from 'next/image';
import logo from './zkare.png';
const Banner = () => {
  const bannerStyle = {
    backgroundColor: '#FFFFFF',
    padding: '10px',
    textAlign: 'left',
  };

  const titleStyle = {
    fontSize: '24px',
    marginBottom: '10px',
    marginLeft: '20px',
    marginTop: '10px',
    color: '#000000',
    fontFamily: "Sans-serif",
  };

  const descriptionStyle = {
    fontSize: '16px',
  };

  return (
    <div style={bannerStyle}>
        <Image 
        src={logo}
        alt="picture"
        width ={125}
        height={50}
        ></Image>
    </div>
  );
};

export default Banner;
