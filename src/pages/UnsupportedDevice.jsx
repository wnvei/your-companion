import React from 'react';

const UnsupportedDevice = () => {
  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-3xl font-bold mb-4">Not Supported</h1>
      <p className="text-lg max-w-md">
        This experience is not compatible with your device.
        <br />
        Please access this site using a <span className="font-semibold underline">laptop or desktop computer</span> for the best experience.
      </p>
    </div>
  );
};

export default UnsupportedDevice;