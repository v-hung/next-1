"use client"
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react'

const useNavigationEvent = (onPathnameChange: () => void) => {
  const pathname = usePathname(); // Get current route

  // Save pathname on component mount into a REF
  const savedPathNameRef = useRef(pathname);

  useEffect(() => {
    // If REF has been changed, do the stuff
    if (savedPathNameRef.current !== pathname) {
      onPathnameChange();
      // Update REF
      savedPathNameRef.current = pathname;
    }
    console.log({pathname, savedPathNameRef: savedPathNameRef.current})
  }, [pathname, onPathnameChange]);
};

const ProgressBar = () => {
  const lineProcess = useRef<HTMLDivElement>(null)
  const pathname = usePathname();

  useNavigationEvent(() => {
    console.log(1)
  })

  return (
    <div className="fixed w-full h-0.5 top-0 left-0 z-50">
      {pathname}
      <div ref={lineProcess} className="absolute w-0 h-full bg-blue-600 ease-in-out"></div>
    </div>
  )
}

export default ProgressBar