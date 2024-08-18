import React from 'react';

const ERROR404 = () => {
    return (
        <div>
            <div>
                    <div className="flex flex-col h-screen max-h-screen justify-center items-center p-4">
  <dotlottie-player
    src="https://lottie.host/bf16abd4-5e05-4b60-97b1-f2a36e544633/SI3T1e3GMR.json"
    background="transparent"
    speed="1"
    style={{ maxWidth: '50vh', maxHeight: '50vh' }}
    className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
    loop
    autoplay
  ></dotlottie-player>
  <div className="text-lg text-center">
  Oops! The page you're looking for doesn't exist. Please check the URL or return to the homepage.
  </div>
 
</div>
                </div>
        </div>
    );
}

export default ERROR404;
