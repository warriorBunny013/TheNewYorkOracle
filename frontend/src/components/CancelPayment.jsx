import { Link } from 'react-router-dom';
function CancelPayment(){
    return(<div>
 
 <div className="flex flex-col h-screen max-h-screen justify-center items-center p-4">
  <dotlottie-player
    src="https://lottie.host/ca506b8c-419e-481b-b529-f492c4d7f7db/QTew6jHaDA.json"
    background="transparent"
    speed="1"
    style={{ maxWidth: '50vh', maxHeight: '50vh' }}
    className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
    loop
    autoplay
  ></dotlottie-player>
  <div className="font-bold text-red-700 text-xl sm:text-2xl mb-4 text-center">
    Payment Unsuccessful
  </div>
  <div className="text-lg text-center">
    Sorry, something went wrong. Please try again or use a different payment method.
  </div>
  <Link to="/"><button className="btn border-1 mt-8 text-sm border-white">Go back to booking page </button></Link>
</div>

            
 
    </div>);
 }
 
 
 export default CancelPayment;