import { useEffect } from 'react';

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    // Handler to call on outside click
    const handleClickOutside = (event) => {
      // Check if click was outside of the component
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export default useOutsideClick;