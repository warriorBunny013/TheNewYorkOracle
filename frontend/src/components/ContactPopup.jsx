import React from 'react';

const ContactPopup = ({ isPopupVisible, closePopup }) => {
  return (
    <>
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="relative bg-black border border-white text-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-auto">
            <button 
              className="absolute top-2 right-2 text-white text-2xl font-bold" 
              onClick={closePopup}
            >
              &times;
            </button>
            <p className="text-md min-w-4 mr-3">
              Mail to <strong>info@soulsticetarot.com</strong> for any inquiries.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactPopup;
