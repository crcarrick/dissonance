import React from 'react';

import { LoaderContainer, LoaderMessage } from './Loader.style';

const MESSAGES = [
  '[A MEME]',
  'Suh dude',
  'PK Load Ω',
  'Generating terrain...',
  'Ready player one',
  'Did they just walk up slowly and load?',
  'i solemnly swear that i am up to no good',
  `Loading Lines in ${new Date().getFullYear()} LUL`,
  'Switching sides',
  'Is this thing on..?',
  'Error 404: Joke Not Found',
  'We at pumpkin hill, you ready?',
  'Preparing Final Form',
  'ULTIMATE IS READY!',
  'Activating Witch Time...',
  'Insert Coin to Continue',
  'spinning to win',
  'Entering cheat codes',
  'Rushing B',
  'Pressing random buttons',
  'Cheat Code Activated',
  'Dissonance A-GO-GO BABY',
  'Resetting Run',
  'Removing pen from pineapple',
  'Caution: Contents Spicy',
  'Good News Everyone!',
  'Resurrecting dead memes',
  'Clicking circles (to the beat!)',
  'Building Lore',
  `We don't need a healer for this, right?`,
  'Wubba Lubba Dub Dub',
  'Scaling Bananas',
  'l o a d i n g a e s t h e t i c s',
];

const getRandomMessage = () => {
  const min = 0;
  const max = MESSAGES.length - 1;

  const index = Math.floor(Math.random() * (max - min + 1) + min);

  return MESSAGES[index];
};

export const Loader = ({ message = true, width = 100 }) => {
  return (
    <LoaderContainer>
      <img
        alt="Loader"
        src="https://cdn.discordapp.com/attachments/414258067870449665/445736475158380544/discord.gif"
        style={{ width }}
      />
      {message && <LoaderMessage>{getRandomMessage()}</LoaderMessage>}
    </LoaderContainer>
  );
};
