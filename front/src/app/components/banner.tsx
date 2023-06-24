import React from 'react';
import Image from 'next/image';
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
        <Image src="./zkare.png"></Image>
      <h1 style={titleStyle}>zKare</h1>

    </div>
  );
};

export default Banner;
