import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TransactionContext } from '../../contest/TransactionContext';
import "./Hero.css";
import hero from "../../assets/artHero.gif";

const Hero = () => {
  const { currentAccount } = useContext(TransactionContext);

  const renderMarketplaceLink = () => {
    if (currentAccount) {
      return (
        <Link to='/orderCreation'>
          <button className='second-button'>MarketPlace</button>
        </Link>
      );
    } else {
      return (
        <button className='second-button' onClick={() => alert("Please connect your account.")}>
          MarketPlace
        </button>
      );
    }
  };

  return (
    <div className='hero'>
      <div className='first-hero'>
        <h1><span>Decentralized</span> <br /> Art Marketplace</h1>
        <div className='sub-first-hero'>
          <Link to='/artinfo'>
            <button className='first-button'>Learn More</button>
          </Link>
          {renderMarketplaceLink()}
        </div>
      </div>
      <div className='second-hero'>
        <img src={hero} alt="Hero Art" />
      </div>
    </div>
  );
}

export default Hero;
