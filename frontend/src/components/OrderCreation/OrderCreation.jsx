import React, { useState, useEffect, useContext } from 'react';
import ArtLogo from '../../assets/orderImg.jpeg';
import './OrderCreation.css';
import { addArt, getAllArts } from '../../utils/db';
import { Link } from 'react-router-dom';
import { ArtStatusContext } from '../../context/ArtStatusContext';
import { TransactionContext } from '../../contest/TransactionContext'; // Corrected import path
import { ethers } from 'ethers';

const OrderCreation = () => {
  const { purchaseArt } = useContext(TransactionContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false); // New state for wallet connection
  const [formData, setFormData] = useState({
    image: null,
    creatorImage: null,
    title: '',
    description: '',
    price: '',
    creatorName: ''
  });
  const [arts, setArts] = useState([]);
  const { artStatus, setArtStatus } = useContext(ArtStatusContext);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsWalletConnected(true);
          }
        } catch (error) {
          console.error("Error checking MetaMask connection:", error);
        }
      }
    };

    checkWalletConnection();

    const fetchArts = async () => {
      const savedArts = await getAllArts();
      setArts(savedArts);
    };

    fetchArts();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsWalletConnected(true);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('image', formData.image);
    data.append('creatorImage', formData.creatorImage);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('creatorName', formData.creatorName);

    await addArt(data);
    const savedArts = await getAllArts();
    setArts(savedArts);
    closeModal();
  };

  const handleBuyArt = async (id, price) => {
    setArtStatus((prevStatus) => ({ ...prevStatus, [id]: 'processing' }));
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: '0x1853E7DE95130a304e4dF355CF8aB7AE80160189', 
        value: ethers.utils.parseEther(price.toString())
      });
      await tx.wait();
      setArtStatus((prevStatus) => ({ ...prevStatus, [id]: 'bought' }));
    } catch (error) {
      console.error(error);
      setArtStatus((prevStatus) => ({ ...prevStatus, [id]: 'unsold' }));
    }
  };

  return (
    <div className="--orderCreation-header">
      {!isWalletConnected ? (
        <div className="connect-wallet">
          <button onClick={connectWallet} className="button">Connect Wallet</button>
        </div>
      ) : (
        <>
          <div className="orderCreation">
            <div className="orderCreation-img">
              <img src={ArtLogo} alt="" />
            </div>
            <div className="orderCreation-secong">
              <h1>
                Extraordinary <br /> <span>Art</span> you'll love
              </h1>
              <button className="button" onClick={openModal}>Create Art</button>
              <Link to="/artMarket">
                <button className="button">Art Market</button>
              </Link>
            </div>
          </div>

          <div className="marketplace">
            <h1>ART MARKETPLACE</h1>
          </div>

          <section className="artSection">
            {arts.map((art) => (
              <div key={art._id} className="artSection-one">
                <p>{artStatus[art._id] === 'bought' ? 'Sold' : 'Unsold'}</p>
                <img className='artsectionImage' src={`http://localhost:5000/${art.image}`} alt={art.title} />
                <div className='artDetails'>
                  <div>
                    <h2>{art.title}</h2>
                  </div>
                  <div className="creator">
                    <img src={`http://localhost:5000/${art.creatorImage}`} alt={art.creatorName} />
                    <h4 className="creatorName">{art.creatorName}</h4>
                  </div>
                  <div className="artTag">
                    <div>
                      <h2>{art.description}</h2>
                    </div>
                  </div>
                  <div className="artTag">
                    <div>
                      <h2>{art.price} cUSD</h2>
                    </div>
                    <button 
                      className="artTag-btn" 
                      onClick={() => handleBuyArt(art._id, art.price)} 
                      disabled={artStatus[art._id] === 'bought' || artStatus[art._id] === 'processing'}
                    >
                      {artStatus[art._id] === 'processing' 
                        ? 'Processing' 
                        : artStatus[art._id] === 'bought' 
                        ? 'Art Purchased' 
                        : `Buy Art for ${art.price}`}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Create New Art</h2>
                <form onSubmit={handleSubmit}>
                  <label>
                    Image:
                    <input type="file" name="image" onChange={handleFileChange} required />
                  </label>
                  <label>
                    Creator Image:
                    <input type="file" name="creatorImage" onChange={handleFileChange} required />
                  </label>
                  <label>
                    Title:
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                  </label>
                  <label>
                    Description:
                    <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                  </label>
                  <label>
                    Price:
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                  </label>
                  <label>
                    Creator Name:
                    <input type="text" name="creatorName" value={formData.creatorName} onChange={handleInputChange} required />
                  </label>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderCreation;
