import React from "react";
import { useState, useEffect } from 'react'

const useScroll = () => {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.pageYOffset);
            console.log(window.pageYOffset)
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    const getPos = () => {
        return scrollY
    }
}

export default useScroll